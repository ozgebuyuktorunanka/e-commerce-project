import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { PaymentStatus } from "payments/types/payments.methods";


export class UpdatePaymentDto {
    @IsOptional()
    @IsEnum(PaymentStatus,{
        //Special and detailed message text
        message: `status must be one of: ${Object.values(PaymentStatus).join(', ')}`,
    })
    readonly status?: PaymentStatus;

    @IsOptional()
    @IsString({ message: 'transactionId must be a string' })
    @Length(6, 50, { message: 'transactionId must be between 6 and 50 characters' })
    readonly transactionId?: string;

}