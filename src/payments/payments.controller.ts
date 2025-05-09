import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Payment } from './entities/payments.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiTags('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'List all the Payments' })
  @ApiResponse({
    status: 200,
    description: 'Payments is listed succesfully.',
    type: [Payment],
  })
  @ApiResponse({ status: 401, description: 'Forbidden, Authorization Error.' })
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the payment information with using ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment Info is founded succesfully.',
    type: Payment,
  })
  @ApiResponse({ status: 401, description: 'Forbidden, Authorization Error.' })
  @ApiResponse({
    status: 404,
    description: 'The Payment Information is not founded.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    const payment = await this.paymentService.findOne(id);

    if (!payment) {
      throw new HttpException(
        `ID:${id} - Payment information is not founded.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return payment;
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get the order detail with using orderId.' })
  @ApiResponse({
    status: 200,
    description: 'Payments for the order were listed succesfully.',
    type: [Payment],
  })
  @ApiResponse({ status: 401, description: 'Forbidden. Authorization Error. ' })
  async findByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<Payment[]> {
    return this.paymentService.findByOrder(orderId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Payment' })
  @ApiResponse({
    status: 201,
    description: 'The payment is created succesfully.',
  })
  @ApiResponse({ status: 400, description: ' Invalid Data' })
  @ApiResponse({ status: 401, description: 'Forbidden, Authorization Error.' })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the Payment Details.' })
  @ApiResponse({
    status: 201,
    description: 'The payment is updated succesfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 401, description: 'Forbiddeni Authorization Error' })
  @ApiResponse({
    status: 404,
    description: 'The payment is not found to update.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentService.update(id, updatePaymentDto);

    if (!payment) {
      throw new HttpException(
        `ID:${id} - payment is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return payment;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the payment with using id.' })
  @ApiResponse({ status: 200, description: 'Payment is deleted succesfully.' })
  @ApiResponse({ status: 401, description: 'Forbidden. Authorization Issue.' })
  @ApiResponse({ status: 404, description: 'Payment is not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.paymentService.remove(id);
    console.log(`After delete process, the result is: ${result}`)
  }

  @Patch(':id/process')
  async processPayment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Payment> {
    return this.paymentService.processPayment(id);
  }
}
