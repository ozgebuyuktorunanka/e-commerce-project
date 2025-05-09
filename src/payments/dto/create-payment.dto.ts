import { IsIn, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { PaymentMethod } from "payments/types/payments.methods";


export class CreatePaymentDto {
    @IsUUID('4', { message: 'orderId must be a valid UUID v4' })
    @IsNotEmpty({ message: 'orderId is required' })
    readonly orderId: string;

    @IsNumber({}, { message: 'Amount must be a valid number' })
    readonly amount: number;
    
    @IsIn(['credit_card', 'paypal', 'bank_transfer', 'crypto', 'apple_pay', 'google_pay'])
    readonly paymentMethod: PaymentMethod;
    
}