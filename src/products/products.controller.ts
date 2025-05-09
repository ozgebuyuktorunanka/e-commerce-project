import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { AdminGuard } from 'common/guards/admin.guard';
import { CapitalizeNamePipe } from 'common/pipes/capitalize-name.pipe';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'auth/guards/roles.guard';
import { UserRole } from 'users/entities/user.enum';
import { Roles } from 'auth/decorator/roles.decorator';

@Controller('products')
@ApiTags('products')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpException)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.SELLER)
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error - Only Admin User can create a new product.',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Body('name', CapitalizeNamePipe) name: string,
  ): Promise<Product> {
    const modifiedDto = {
      ...createProductDto,
      name,
    };
    return this.productsService.create(modifiedDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Products not found.' })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Product[]> {
    return this.productsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({
    status: 200,
    description: 'Product has been successfully retrieved.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new HttpException(
        `ID:${id} - the product is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'Product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error - Only admin user can update the product.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const name = updateProductDto.name
      ? new CapitalizeNamePipe().transform(updateProductDto.name, {
          type: 'body',
          metatype: String,
        })
      : undefined;

    const modifiedDto = {
      ...updateProductDto,
      name: name !== undefined ? name : updateProductDto.name,
    };
    const product = await this.productsService.update(id, modifiedDto);

    if (!product) {
      throw new HttpException(
        `ID:${id}-This product is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  @Delete(':id')
  @UseGuards(AdminGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({
    status: 200,
    description: 'Product has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error - Only Admin user can delete the product.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const result = await this.productsService.remove(id);

    //This console log only debug and trace the result value.
    console.log(`After the delete process id:${id} - The result is: ${result}`);

    return { message: `ID:${id}- This product is deleted succesfully.` };
  }
}
