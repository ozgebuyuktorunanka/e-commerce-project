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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpException)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'New Product Creation.' })
  @ApiResponse({
    status: 201,
    description: 'The product is created succesfully.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid Data is occured.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error  - Only Admin User can create a new product.',
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
  @ApiOperation({ summary: 'List all products.' })
  @ApiResponse({
    status: 200,
    description: 'All products is listed succesfully.',
  })
  @ApiResponse({ status: 404, description: 'Product is not found.' })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Product[]> {
    return this.productsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a product with using ID.' })
  @ApiResponse({ status: 404, description: 'The product is not found.' })
  @ApiResponse({
    status: 200,
    description: 'The product is found succesfully with ID.',
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
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update the product.' })
  @ApiResponse({
    status: 200,
    description: 'The product is updated succesfully.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error- Only admin user can be update the product.',
  })
  @ApiResponse({ status: 404, description: 'The product is not found.' })
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
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete the Product with ID.' })
  @ApiResponse({
    status: 200,
    description: 'The product is deleted succesfully.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Authorization Error - Only Admin user can be updated the product.',
  })
  @ApiResponse({ status: 404, description: 'The product is not found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const result = await this.productsService.remove(id);

    //This console log only debug and trace the result value.
    console.log(`After the delete process id:${id} - The result is: ${result}`);

    return { message: `ID:${id}- This product is deleted succesfully.` };
  }
}
