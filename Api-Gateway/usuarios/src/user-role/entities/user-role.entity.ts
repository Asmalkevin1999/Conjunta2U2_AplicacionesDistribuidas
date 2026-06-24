import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_role')
export class UserRole {
  @PrimaryColumn({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @PrimaryColumn({ name: 'id_role', type: 'uuid' })
  idRole: string;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
