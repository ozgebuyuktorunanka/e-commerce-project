import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch'; // NestJS Elasticsearch module's service
import { ConfigService } from '@nestjs/config'; // For accessing environment variables
import { Cron, CronExpression } from '@nestjs/schedule'; // For scheduling cron jobs
import { DataSource, EntityTarget, Repository } from 'typeorm'; // For database interaction with TypeORM

// Define interfaces for better type safety and clarity
interface SyncConfig {
  entity: string; // Name of the TypeORM entity (e.g., 'Product', 'User')
  index: string;  // Corresponding Elasticsearch index name (e.g., 'products', 'users')
  batchSize: number; // Number of records to sync in a single bulk operation
  mapping: any; // Elasticsearch index mapping
  settings: any; // Elasticsearch index settings
}

interface IndexStatus {
  name: string; // Name of the Elasticsearch index
  entity: string; // Corresponding TypeORM entity name
  documentCount?: number; // Total number of documents in the index
  sizeInBytes?: number;   // Size of the index in bytes
  error?: string;         // Error message if fetching status failed
  status: 'success' | 'failed'; // Status of the operation for this index
}

interface SyncStatusResponse {
  indices: IndexStatus[]; // Array of status objects for each configured index
}

@Injectable()
export class ElasticsearchSyncService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchSyncService.name);
  private readonly syncConfigs: SyncConfig[] = []; // Array to store all synchronization configurations
  private isInitialized = false; // Flag to ensure service is fully initialized before operations
  private lastSyncTimestamps: Map<string, Date> = new Map(); // Stores the last successful sync timestamp for each entity

  constructor(
    private readonly elasticsearchService: ElasticsearchService, // Injected NestJS ElasticsearchService
    private readonly configService: ConfigService, // Injected NestJS ConfigService
    private readonly dataSource: DataSource, // Injected TypeORM DataSource for repository access
  ) {
    // Initialize synchronization configurations when the service is instantiated
    this.initializeSyncConfigs();
  }

  /**
   * Lifecycle hook: Called once the host module has been initialized.
   * Connects to Elasticsearch and ensures all configured indices exist.
   */
  async onModuleInit() {
    await this.initializeElasticsearch();
    this.isInitialized = true;
    this.logger.log('Elasticsearch Sync Service initialized successfully.');
  }

  /**
   * Defines and populates the synchronization configurations for different entities.
   * Each config specifies the entity, target index, batch size, and Elasticsearch mappings/settings.
   */
  private initializeSyncConfigs() {
    this.syncConfigs.push(
      {
        entity: 'Product',
        index: 'products',
        batchSize: 1000,
        mapping: this.getProductMapping(),
        settings: this.getDefaultSettings(),
      },
      {
        entity: 'User',
        index: 'users',
        batchSize: 500,
        mapping: this.getUserMapping(),
        settings: this.getDefaultSettings(),
      },
      {
        entity: 'Order',
        index: 'orders',
        batchSize: 1000,
        mapping: this.getOrderMapping(),
        settings: this.getDefaultSettings(),
      },
      // Add more entities here as needed
    );
  }

  /**
   * Initializes the Elasticsearch connection and ensures all configured indices are created.
   * Pings Elasticsearch to verify connectivity before proceeding.
   * @throws Error if connection or index creation fails.
   */
  private async initializeElasticsearch() {
    try {
      // Ping Elasticsearch to check connection status
      await this.elasticsearchService.ping();
      this.logger.log('Successfully connected to Elasticsearch.');

      // Iterate through all sync configurations and create indices if they don't exist
      for (const config of this.syncConfigs) {
        await this.createIndexIfNotExists(config);
      }
    } catch (error) {
      this.logger.error('Failed to initialize Elasticsearch connection or create indices.', error.stack);
      throw error; // Re-throw to prevent service from starting if critical initialization fails
    }
  }

  /**
   * Creates an Elasticsearch index if it does not already exist.
   * Applies the specified settings and mappings from the sync configuration.
   * @param config The SyncConfig object for the index to be created.
   * @throws Error if index creation fails.
   */
  private async createIndexIfNotExists(config: SyncConfig) {
    try {
      // Check if the index already exists
      const { body: exists } = await this.elasticsearchService.indices.exists({
        index: config.index,
      });

      if (!exists) {
        // Create the index with defined settings and mappings
        await this.elasticsearchService.indices.create({
          index: config.index,
          body: {
            settings: config.settings,
            mappings: config.mapping,
          },
        });
        this.logger.log(`Elasticsearch index created: '${config.index}'.`);
      } else {
        this.logger.debug(`Elasticsearch index '${config.index}' already exists.`);
      }
    } catch (error) {
      this.logger.error(`Failed to create index '${config.index}'.`, error.stack);
      throw error; // Re-throw to propagate the error
    }
  }

  /**
   * Performs a full synchronization for all configured entities, or a specific entity.
   * This method fetches all data from the database and re-indexes it into Elasticsearch.
   * @param entityName (Optional) The name of a specific entity to sync. If not provided, all configured entities will be synced.
   * @throws Error if the service is not initialized or if sync fails for any entity.
   */
  async fullSync(entityName?: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Elasticsearch Sync Service is not initialized. Please wait for onModuleInit to complete.');
    }

    // Determine which configurations to sync (all or a specific one)
    const configsToSync = entityName
      ? this.syncConfigs.filter((c) => c.entity === entityName)
      : this.syncConfigs;

    if (configsToSync.length === 0) {
      this.logger.warn(`No sync configurations found for entity: '${entityName || 'all'}' to perform full sync.`);
      return;
    }

    this.logger.log(`Starting full sync for ${entityName || 'all configured entities'}.`);
    for (const config of configsToSync) {
      await this.syncEntity(config, true); // Pass true for full sync
    }
    this.logger.log(`Full sync completed for ${entityName || 'all configured entities'}.`);
  }

  /**
   * Performs an incremental synchronization for all configured entities.
   * This method is scheduled to run periodically (e.g., every 5 minutes) using a cron job.
   * It syncs only the data that has been updated since the last successful sync.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async incrementalSync(): Promise<void> {
    if (!this.isInitialized) {
      this.logger.warn('Incremental sync skipped: Service not yet initialized.');
      return;
    }

    this.logger.log('Starting incremental sync for all configured entities.');

    // Process each entity configuration for incremental sync
    for (const config of this.syncConfigs) {
      await this.syncEntity(config, false); // Pass false for incremental sync
    }
    this.logger.log('Incremental sync completed for all configured entities.');
  }

  /**
   * Synchronizes data for a single entity from the database to Elasticsearch.
   * Supports both full synchronization and incremental synchronization based on `updatedAt` timestamps.
   * @param config The SyncConfig object for the entity to sync.
   * @param isFullSync A boolean indicating whether to perform a full sync (true) or incremental sync (false).
   * @throws Error if database query or bulk indexing fails.
   */
  private async syncEntity(config: SyncConfig, isFullSync: boolean = false): Promise<void> {
    const startTime = Date.now();
    let syncedCount = 0;
    let offset = 0;

    try {
      this.logger.log(`Initiating ${isFullSync ? 'full' : 'incremental'} sync for entity: '${config.entity}'.`);

      // Get the TypeORM repository for the specified entity
      const repository = this.dataSource.getRepository(config.entity as EntityTarget<any>);
      // Determine the last sync time for incremental sync
      const lastSyncTime = isFullSync ? null : this.lastSyncTimestamps.get(config.entity);

      let hasMore = true;
      while (hasMore) {
        // Create a TypeORM query builder
        const queryBuilder = repository.createQueryBuilder('entity');

        // For incremental sync, add a WHERE clause to fetch only recently updated records
        if (lastSyncTime && !isFullSync) {
          queryBuilder.where('entity.updatedAt > :lastSync', { lastSync: lastSyncTime });
        }

        // Fetch entities in batches
        const entities = await queryBuilder
          .skip(offset)
          .take(config.batchSize)
          .orderBy('entity.updatedAt', 'ASC') // Order by updatedAt to ensure consistent pagination and incremental sync
          .getMany();

        // If no entities are found in the current batch, stop the loop
        if (entities.length === 0) {
          hasMore = false;
          break;
        }

        // Perform a bulk index operation to Elasticsearch
        await this.bulkIndex(config.index, entities);

        syncedCount += entities.length;
        offset += config.batchSize;

        // Check if there might be more data to fetch (if the batch was full)
        hasMore = entities.length === config.batchSize;

        this.logger.debug(`Synced ${syncedCount} records for entity: '${config.entity}'.`);
      }

      // Update the last successful sync timestamp for this entity
      this.lastSyncTimestamps.set(config.entity, new Date());

      const duration = Date.now() - startTime;
      this.logger.log(`Completed sync for entity '${config.entity}': ${syncedCount} records processed in ${duration}ms.`);

    } catch (error) {
      this.logger.error(`Failed to sync entity '${config.entity}'.`, error.stack);
      throw error; // Re-throw to propagate the error to the caller (e.g., fullSync or incrementalSync)
    }
  }

  /**
   * Performs a bulk indexing operation to Elasticsearch.
   * Transforms documents and handles potential errors during the bulk operation.
   * @param index The target Elasticsearch index name.
   * @param documents An array of documents (TypeORM entities) to be indexed.
   * @throws Error if the bulk indexing operation fails.
   */
  private async bulkIndex(index: string, documents: any[]): Promise<void> {
    if (documents.length === 0) {
      this.logger.debug(`No documents to bulk index for index '${index}'.`);
      return;
    }

    // Prepare the bulk request body: alternating index action and document source
    const body = documents.flatMap((doc) => [
      {
        index: {
          _index: index,
          _id: doc.id.toString(), // Use entity's ID as Elasticsearch document ID
        },
      },
      this.transformDocument(doc), // Transform the document before indexing
    ]);

    try {
      const response = await this.elasticsearchService.bulk({ body });

      // Check if any errors occurred during the bulk operation
      if (response.body.errors) {
        const errorItems = response.body.items.filter((item: any) => item.index?.error);
        this.logger.error(`Bulk index operation encountered errors for index '${index}':`, errorItems);
        // Optionally, throw an error here if you want to fail the sync on partial errors
        // throw new Error(`Partial bulk index failure for index '${index}'.`);
      } else {
        this.logger.debug(`Successfully bulk indexed ${documents.length} documents to '${index}'.`);
      }
    } catch (error) {
      this.logger.error(`Bulk index operation failed entirely for index '${index}'.`, error.stack);
      throw error; // Re-throw to propagate the error
    }
  }

  /**
   * Transforms an entity object into a format suitable for Elasticsearch indexing.
   * Removes sensitive data, adds derived fields, and handles data type conversions.
   * @param entity The TypeORM entity object to transform.
   * @returns The transformed document ready for Elasticsearch.
   */
  private transformDocument(entity: any): any {
    const doc = { ...entity }; // Create a shallow copy to avoid modifying the original entity

    // Remove sensitive or unnecessary fields before indexing
    delete doc.password;
    delete doc.passwordHash;
    // Add more fields to delete if needed (e.g., specific relations that should not be indexed directly)

    // Add search-friendly derived fields
    if (entity.firstName && entity.lastName) {
      doc.fullName = `${entity.firstName} ${entity.lastName}`;
    }

    // Handle array-like fields that might be stored as strings in the database
    // Example: if 'tags' is a comma-separated string, convert it to an array of keywords
    if (doc.tags && typeof doc.tags === 'string') {
      doc.tags = doc.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean); // Filter out empty strings
    }

    // Add a timestamp indicating when the document was synced to Elasticsearch
    doc.syncedAt = new Date().toISOString();

    return doc;
  }

  /**
   * Deletes a document from a specific Elasticsearch index by its ID.
   * Gracefully handles cases where the document does not exist (404 Not Found).
   * @param index The Elasticsearch index name.
   * @param id The ID of the document to delete.
   * @throws Error if deletion fails for reasons other than 404.
   */
  async deleteDocument(index: string, id: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index,
        id: id.toString(), // Ensure ID is a string
      });
      this.logger.debug(`Document with ID '${id}' successfully deleted from index '${index}'.`);
    } catch (error) {
      // Ignore 404 errors (document not found), as it means it's already deleted or never existed
      if (error.statusCode !== 404) {
        this.logger.error(`Failed to delete document with ID '${id}' from index '${index}'.`, error.stack);
        throw error; // Re-throw other errors
      } else {
        this.logger.warn(`Attempted to delete document with ID '${id}' from index '${index}', but it was not found.`);
      }
    }
  }

  /**
   * Updates (or creates if not exists) a single document in a specific Elasticsearch index.
   * Uses the `index` API which performs an upsert.
   * @param index The Elasticsearch index name.
   * @param id The ID of the document to update/create.
   * @param document The document object to index.
   * @throws Error if the indexing operation fails.
   */
  async updateDocument(index: string, id: string, document: any): Promise<void> {
    try {
      await this.elasticsearchService.index({
        index,
        id: id.toString(), // Ensure ID is a string
        body: this.transformDocument(document), // Transform document before indexing
      });
      this.logger.debug(`Document with ID '${id}' successfully updated/indexed in index '${index}'.`);
    } catch (error) {
      this.logger.error(`Failed to update/index document with ID '${id}' in index '${index}'.`, error.stack);
      throw error; // Re-throw to propagate the error
    }
  }

  /**
   * Performs a search query against a specific Elasticsearch index.
   * @param index The Elasticsearch index name(s) to search in.
   * @param query The Elasticsearch query body.
   * @param options Additional search options (e.g., size, from, sort).
   * @returns The search response body from Elasticsearch.
   * @throws Error if the search operation fails.
   */
  async search(index: string | string[], query: any, options: any = {}): Promise<any> {
    try {
      const searchParams = {
        index,
        body: query,
        ...options, // Spread additional search options
      };

      const response = await this.elasticsearchService.search(searchParams);
      return response.body;
    } catch (error) {
      this.logger.error(`Search operation failed for index '${index}'.`, error.stack);
      throw error; // Re-throw to propagate the error
    }
  }

  /**
   * Retrieves the synchronization status and statistics for all configured Elasticsearch indices.
   * Fetches document count and size, reporting success or failure for each index.
   * @returns A Promise resolving to an object containing an array of IndexStatus for each index.
   */
  async getSyncStatus(): Promise<SyncStatusResponse> {
    const status: SyncStatusResponse = {
      indices: []
    };

    // Use Promise.allSettled to concurrently fetch stats for all indices.
    // This ensures that even if one index fails, others will still be processed.
    const results = await Promise.allSettled(
      this.syncConfigs.map(async ({ index, entity }) => {
        try {
          // Fetch index statistics from Elasticsearch
          const { body } = await this.elasticsearchService.indices.stats({ index });
          const indexStats = body.indices?.[index]; // Use optional chaining for safe access

          // Return successful status with relevant statistics
          return {
            name: index,
            entity,
            documentCount: indexStats?.total?.docs?.count || 0,
            sizeInBytes: indexStats?.total?.store?.size_in_bytes || 0,
            status: 'success' as const, // Type assertion for string literal
          };
        } catch (error) {
          // Log the error and return a failed status with error details
          this.logger.error(`Failed to get stats for index '${index}': ${error.message}`, error.stack);
          return {
            name: index,
            entity,
            status: 'failed' as const, // Type assertion for string literal
            error: error.message || 'Unknown error occurred while fetching stats.',
          };
        }
      })
    );

    // Process the results from Promise.allSettled and populate the final status object
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        // If the promise was fulfilled (even if it contained an error object from the catch block)
        status.indices.push(result.value);
      } else {
        // This 'rejected' branch typically catches errors that occur *outside* the inner try/catch,
        // which are less common when using async/await within map.
        // It acts as a final safety net for unexpected rejections.
        this.logger.error(`Unexpected promise rejection when processing index stats: ${result.reason}`);
        // Add a generic failed status if a promise was truly rejected
        status.indices.push({
          name: 'unknown', // Cannot determine index name from rejected promise
          entity: 'unknown', // Cannot determine entity name
          status: 'failed',
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        });
      }
    });

    return status;
  }

  /**
   * Reindexes an Elasticsearch index for a specific entity.
   * This involves deleting the existing index, recreating it with fresh mappings/settings,
   * and then performing a full synchronization of all data for that entity.
   * @param entityName The name of the entity whose index needs to be reindexed.
   * @throws Error if the entity configuration is not found or reindexing fails.
   */
  async reindex(entityName: string): Promise<void> {
    const config = this.syncConfigs.find(c => c.entity === entityName);
    if (!config) {
      throw new Error(`No sync configuration found for entity: '${entityName}'. Cannot reindex.`);
    }

    this.logger.log(`Starting reindexing process for entity: '${entityName}' (index: '${config.index}').`);
    try {
      // Delete the existing index. 'ignore_unavailable: true' prevents error if index doesn't exist.
      await this.elasticsearchService.indices.delete({
        index: config.index,
        ignore_unavailable: true,
      });
      this.logger.log(`Existing index '${config.index}' deleted (if it existed).`);

      // Recreate the index with the latest settings and mappings
      await this.createIndexIfNotExists(config);
      this.logger.log(`Index '${config.index}' recreated.`);

      // Perform a full synchronization to populate the newly created index
      await this.syncEntity(config, true);

      this.logger.log(`Reindexing completed successfully for entity: '${entityName}'.`);
    } catch (error) {
      this.logger.error(`Reindexing failed for entity '${entityName}'.`, error.stack);
      throw error; // Re-throw to propagate the error
    }
  }

  /**
   * Defines the Elasticsearch mapping for the 'Product' index.
   * Specifies data types and analysis settings for product-related fields.
   */
  private getProductMapping() {
    return {
      properties: {
        id: { type: 'keyword' }, // Use keyword for exact matching (e.g., product ID)
        name: {
          type: 'text',
          analyzer: 'standard', // Standard analyzer for general text search
          fields: {
            keyword: { type: 'keyword' }, // For exact name matching/aggregations
            suggest: { type: 'completion' }, // For autocomplete suggestions
          },
        },
        description: {
          type: 'text',
          analyzer: 'standard',
        },
        price: { type: 'float' },
        categoryId: { type: 'keyword' },
        stock: { type: 'integer' },
        isActive: { type: 'boolean' },
        tags: { type: 'keyword' }, // Array of keywords for filtering/faceting
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        syncedAt: { type: 'date' }, // Timestamp when synced to Elasticsearch
      },
    };
  }

  /**
   * Defines the Elasticsearch mapping for the 'User' index.
   * Specifies data types for user-related fields.
   */
  private getUserMapping() {
    return {
      properties: {
        id: { type: 'keyword' },
        email: { type: 'keyword' }, // Use keyword for exact email search/login
        firstName: { type: 'text' },
        lastName: { type: 'text' },
        fullName: {
          type: 'text',
          fields: {
            keyword: { type: 'keyword' }, // For exact full name matching
          },
        },
        isActive: { type: 'boolean' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        syncedAt: { type: 'date' },
      },
    };
  }

  /**
   * Defines the Elasticsearch mapping for the 'Order' index.
   * Specifies data types for order-related fields, including nested documents for order items.
   */
  private getOrderMapping() {
    return {
      properties: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        totalAmount: { type: 'float' },
        status: { type: 'keyword' },
        orderItems: { type: 'nested' }, // Use 'nested' for arrays of objects to preserve relationships
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        syncedAt: { type: 'date' },
      },
    };
  }

  /**
   * Defines common Elasticsearch index settings.
   * Includes shard/replica configuration and custom analyzers.
   */
  private getDefaultSettings() {
    return {
      number_of_shards: 1, // Number of primary shards for the index
      number_of_replicas: 0, // Number of replica shards (0 for development, >0 for production)
      analysis: {
        analyzer: {
          custom_text_analyzer: { // Example custom analyzer
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'stop', 'snowball'], // Filters for text processing
          },
        },
      },
    };
  }
}
