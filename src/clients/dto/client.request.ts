import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ClientRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;
}
