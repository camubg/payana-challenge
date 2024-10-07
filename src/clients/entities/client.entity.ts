import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
