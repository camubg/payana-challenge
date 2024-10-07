import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientRequest {
  @ApiProperty({ description: 'The name of the client', example: 'Cami' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The email of the client',
    example: 'cami@mundo.com',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;
}
