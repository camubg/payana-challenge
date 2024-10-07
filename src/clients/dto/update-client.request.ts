import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  email: string;
}
