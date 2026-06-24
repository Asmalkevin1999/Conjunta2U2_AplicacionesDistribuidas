import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUsersService } from './interfaces/users-service.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    if (existing) {
      if (existing.active) {
        throw new ConflictException('Username already exists');
      }
      existing.username = createUserDto.username;
      existing.passwordHash = passwordHash;
      existing.active = true;
      existing.idPerson = createUserDto.idPerson;
      return this.usersRepository.save(existing);
    }

    const user = this.usersRepository.create({
      idPerson: createUserDto.idPerson,
      username: createUserDto.username,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { idPerson: id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (updateData.username) {
      const existing = await this.usersRepository.findOne({
        where: { username: updateData.username },
      });
      if (existing && existing.idPerson !== id) {
        throw new ConflictException('Username already exists');
      }
    }
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async softDelete(id: string): Promise<void> {
    await this.update(id, { active: false });
  }
}
