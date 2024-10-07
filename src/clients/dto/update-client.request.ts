import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClientRequest {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  email: string;
}
