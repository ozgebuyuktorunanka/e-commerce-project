import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { dummyProducts } from 'data/dummy-product';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [...dummyProducts];

  create(createProductDto: CreateProductDto): Product {
    const { id, ...rest } = createProductDto;

    const newProduct: Product = {
      id: this.products.length + 1,
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(paginationQuery: PaginationQueryDto): Product[] {
    const { page, limit, sort, order } = paginationQuery;

    // Sıralama yap
    const sortedProducts = [...this.products].sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return sortedProducts.slice(startIndex, endIndex);
  }

  findOne(id: number): Product {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new NotFoundException(`Product id is not found. ( id=${id})`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new NotFoundException(`Product id does not found. id: ${id}`);
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number): void {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new NotFoundException(`Product id does not found. id:${id}`);
    }
    this.products.splice(productIndex, 1);
  }
}
