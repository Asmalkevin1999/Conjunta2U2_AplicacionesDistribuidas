import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { IRolesService } from './interfaces/roles-service.interface';

@Injectable()
export class RolesService implements IRolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Role with name "${createRoleDto.name}" already exists`,
      );
    }
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateData: Partial<Role>): Promise<Role> {
    if (updateData.name) {
      const existing = await this.rolesRepository.findOne({
        where: { name: updateData.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Role with name "${updateData.name}" already exists`,
        );
      }
    }
    const role = await this.findOne(id);
    Object.assign(role, updateData);
    return this.rolesRepository.save(role);
  }

  async softDelete(id: string): Promise<void> {
    await this.update(id, { active: false });
  }
}
