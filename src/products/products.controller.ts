import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';

import { Product } from './entities/product.entity';

import { UpdateProductDto } from './dto/update-product.dto';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { AdminGuard } from 'common/guards/admin.guard';
import { CapitalizeNamePipe } from 'common/pipes/capitalize-name.pipe';

@Controller('products')
//@UseInterceptors(TransformResponseInterceptor)
//@UseFilters(HttpException)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AdminGuard)
    create(
        @Body() createProductDto: CreateProductDto,
        @Body('name', CapitalizeNamePipe) name: string
    ): Product {
        const modifiedDto = {
            ...createProductDto,
            name,
        };
        return this.productsService.create(modifiedDto);
    }

    @Get()
    findAll(
        @Query() paginationQuery: PaginationQueryDto): Product[] {
        return this.productsService.findAll(paginationQuery);
    }

    @Get()
    findOne(
        @Param('id', ParseIntPipe) id: number):
        Product {
        return this.productsService.findOne(id)
    }

    @Put()
    @UseGuards(AdminGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @Body('name', CapitalizeNamePipe) name: string
    ): Product {
        const modifiedDto = {
            ...updateProductDto,
            name: name !== undefined ? name : updateProductDto.name,
        }
        return this.productsService.update(id, modifiedDto);
    }

    @Delete()
    @UseGuards(AdminGuard)
    remove(
        @Param('id', ParseIntPipe) id: number): void {
            return this.productsService.remove(id);
    }
}
