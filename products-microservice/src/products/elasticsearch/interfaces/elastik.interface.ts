// Entity interfaces
export interface BaseEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  isActive: boolean;
  tags: string[];
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface Order extends BaseEntity {
  userId: string;
  totalAmount: number;
  status: string;
  orderItems: any[];
}

// Sync configuration interface
export interface SyncConfig {
  entity: string;
  index: string;
  batchSize: number;
  mapping?: any;
  settings?: any;
}

export interface IndexStatus {
    name: string;
    entity: string;
    documentCount: number;
    sizeInBytes: number;
}
export interface Status {
    indices: IndexStatus[];
}

