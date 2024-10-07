import { Exclude } from 'class-transformer';

export class ProductResponse {
  id: number;
  name: string;
  price: number;
  @Exclude()
  isDeleted: boolean;
}
