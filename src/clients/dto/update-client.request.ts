import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOneField } from '../../utils/at-least-one-field.validator';

@AtLeastOneField(['name', 'email'], {
  message: 'At least one field (name or email) must be provided',
})
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
