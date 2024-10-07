import { IsISO8601, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceFiltersDto {
  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  fromDate: string;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  toDate: string;
}
