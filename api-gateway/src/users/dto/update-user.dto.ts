// This class extends the CreateUserDto using PartialType,
// which makes all properties optional. It is useful for update operations
// (e.g., PATCH or PUT requests), where not all fields are required.
import { CreateUserDto } from "./create-user.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

