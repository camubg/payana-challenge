import { Exclude } from 'class-transformer';

export class ClientResponse {
  id: number;
  name: string;
  email: string;
  @Exclude()
  isDeleted: boolean;
}
