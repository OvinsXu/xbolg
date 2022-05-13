import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty() @IsString() @Expose() nickname: string;
  @ApiProperty() @IsString() @Expose() email: string;
  @ApiProperty() @IsString() @Expose() phone: string;
}
