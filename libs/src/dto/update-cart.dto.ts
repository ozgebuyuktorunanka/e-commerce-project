import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsNumberString()
    @Transform(({ value }) => parseInt(value, 10))
    id!: number;
}
