import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Person } from './entities/person.entity';
import { UpdatePersonDto } from './dto/update-person.dto';
import type { IPersonsService } from './interfaces/persons-service.interface';
import type { IUsersService } from '../users/interfaces/users-service.interface';

@Injectable()
export class PersonsService implements IPersonsService {
  constructor(
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
    @Inject('IUsersService')
    private usersService: IUsersService,
  ) {}

  async findAll(): Promise<Person[]> {
    return this.personsRepository.find({ relations: { user: true } });
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.personsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!person) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    if (updatePersonDto.username || updatePersonDto.password) {
      const userUpdate: Record<string, any> = {};
      if (updatePersonDto.username) {
        userUpdate.username = updatePersonDto.username;
      }
      if (updatePersonDto.password) {
        const salt = await bcrypt.genSalt();
        userUpdate.passwordHash = await bcrypt.hash(
          updatePersonDto.password,
          salt,
        );
      }
      await this.usersService.update(id, userUpdate);
    }

    const personFields: (keyof UpdatePersonDto)[] = [
      'firstName',
      'lastName',
      'middleName',
      'dni',
      'email',
      'phone',
      'nationality',
      'address',
      'active',
    ];
    const personUpdateData: Record<string, any> = {};
    for (const field of personFields) {
      if (updatePersonDto[field] !== undefined) {
        personUpdateData[field] = updatePersonDto[field];
      }
    }
    if (updatePersonDto.email) {
      const existingPersonByEmail = await this.personsRepository.findOne({
        where: { email: updatePersonDto.email },
      });
      if (existingPersonByEmail && existingPersonByEmail.id !== id) {
        throw new NotFoundException(`Email ya existente en otra persona`);
      }
    }
    if (updatePersonDto.dni) {
      const existingPersonByDni = await this.personsRepository.findOne({
        where: { dni: updatePersonDto.dni },
      });
      if (existingPersonByDni && existingPersonByDni.id !== id) {
        throw new NotFoundException(`DNI ya existente en otra persona`);
      }
    }

    if (Object.keys(personUpdateData).length > 0) {
      Object.assign(person, personUpdateData);
      await this.personsRepository.save(person);
    }

    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    const person = await this.findOne(id);
    person.active = false;
    await this.personsRepository.save(person);
    await this.usersService.softDelete(id);
  }
}
