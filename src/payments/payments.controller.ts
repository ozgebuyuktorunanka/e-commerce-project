import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Payment } from './entities/payments.entity';
import { CreatePaymentDo } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
}

@Get('order/:orderId')
findByOrder(@Param('orderId') orderId: number): Promise<Payment[]>{
    return this.paymentService.findByOrder(orderId)
}

@Post()
create(@Body() createPaymentDto: CreatePaymentDo):Promise<Payment>{
  return this.paymentService.create(createPaymentDto);  
}

@Post()
update(@Param(':id') id:string,
@Body() updatePaymentDto : UpdatePaymentDto
):Promise<Payment>{
  return this.paymentService.update(id, updatePaymentDto);
}

@Delete(':id')
remove(@Param('id') id:string):Promise<void>{
  return this.paymentService.remove(id);
}

@Patch(':id/process')
processPayment(@Param('id') id:string):Promise<Payment>{
  return this.paymentService.processPayment(id);
}


}
