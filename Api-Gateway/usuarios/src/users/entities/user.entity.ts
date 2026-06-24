import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/person.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ name: 'id_person', type: 'uuid' })
  idPerson: string;

  @OneToOne(() => Person)
  @JoinColumn({ name: 'id_person' })
  person: Person;

  @Column({ name: 'username', type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
