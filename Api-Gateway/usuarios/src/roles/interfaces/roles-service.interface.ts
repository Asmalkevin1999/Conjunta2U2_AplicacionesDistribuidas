import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

export interface IRolesService {
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  findAll(): Promise<Role[]>;
  findOne(id: string): Promise<Role>;
  update(id: string, updateData: Partial<Role>): Promise<Role>;
  softDelete(id: string): Promise<void>;
}
