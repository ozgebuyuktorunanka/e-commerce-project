import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Product[]> {
    const { limit, offset } = paginationQuery;
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      if (!products || products.length === 0) {
        throw new NotFoundException(`Products not found`); 
      }
      return products;
    } catch (error) {
        throw error;
    }
  }
  
  // Find a single product by id
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product not found with id: ${id}`);
    }
    return product;
  }
  // Update a product
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const updatedProduct = Object.assign(product, updateProductDto, {
      updatedAt: new Date(),
    });
    return this.productRepository.save(updatedProduct);
  }

  // Remove a product
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
