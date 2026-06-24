import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 30 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30 })
  lastName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 30 })
  middleName: string;

  @Column({ name: 'dni', type: 'varchar', length: 30, unique: true })
  dni: string;

  @Column({ name: 'email', type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 15 })
  phone: string;

  @Column({ name: 'nationality', type: 'varchar', length: 30 })
  nationality: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @OneToOne(() => User, (user) => user.person)
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
