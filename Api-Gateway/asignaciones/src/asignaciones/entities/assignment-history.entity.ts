import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ActionType {
  CREACION = 'CREACION',
  MODIFICACION = 'MODIFICACION',
  ELIMINACION = 'ELIMINACION',
}

@Entity('assignment_history')
export class AssignmentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'vehicle_id', type: 'uuid' })
  vehicleId: string;

  @Column({ name: 'action', type: 'enum', enum: ActionType })
  action: ActionType;

  @Column({ name: 'timestamp', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ name: 'previous_state', type: 'jsonb', nullable: true })
  previousState: Record<string, unknown> | null;

  @Column({ name: 'new_state', type: 'jsonb', nullable: true })
  newState: Record<string, unknown> | null;
}
