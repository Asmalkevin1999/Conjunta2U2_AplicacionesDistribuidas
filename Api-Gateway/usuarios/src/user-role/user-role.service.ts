import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { IUserRoleService } from './interfaces/user-role-service.interface';

@Injectable()
export class UserRoleService implements IUserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async assignRole(assignRoleDto: AssignRoleDto): Promise<UserRole> {
    const existing = await this.userRoleRepository.findOne({
      where: {
        idUser: assignRoleDto.idUser,
        idRole: assignRoleDto.idRole,
      },
    });

    if (existing) {
      if (existing.active) {
        throw new ConflictException('User already has this role assigned');
      }
      existing.active = true;
      return this.userRoleRepository.save(existing);
    }

    const userRole = this.userRoleRepository.create({
      idUser: assignRoleDto.idUser,
      idRole: assignRoleDto.idRole,
    });

    return this.userRoleRepository.save(userRole);
  }

  async removeRole(idUser: string, idRole: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { idUser, idRole, active: true },
    });

    if (!userRole) {
      throw new NotFoundException('Role assignment not found');
    }

    userRole.active = false;
    await this.userRoleRepository.save(userRole);
  }

  async findRolesByUser(idUser: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { idUser, active: true },
      relations: { role: true },
    });
  }

  async findUsersByRole(idRole: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { idRole, active: true },
      relations: { user: true },
    });
  }
}
