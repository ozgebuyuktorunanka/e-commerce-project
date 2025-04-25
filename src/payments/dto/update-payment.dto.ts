import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaymentStatus } from "payments/types/payments.methods";


export class UpdatePaymentDto {
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsOptional()
    @IsString()
    transactionId?: string;
    
}