import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientRequest {
  @ApiProperty({
    description: 'The name of the client',
    example: 'Cami',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'The email of the client',
    example: 'cami@mundo.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  email?: string;
}
