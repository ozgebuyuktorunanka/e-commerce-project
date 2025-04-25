import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { PaymentMethod } from "payments/types/payments.methods";


export class CreatePaymentDo {
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @IsNumber()
    amount: number;
    
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}