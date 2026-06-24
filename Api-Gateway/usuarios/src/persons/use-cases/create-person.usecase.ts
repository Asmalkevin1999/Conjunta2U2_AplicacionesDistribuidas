import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Person } from '../entities/person.entity';
import { User } from '../../users/entities/user.entity';
import { CreatePersonDto } from '../dto/create-person.dto';
import type { IPersonsService } from '../interfaces/persons-service.interface';

@Injectable()
export class CreatePersonUseCase {
  constructor(
    @Inject('IPersonsService')
    private readonly personsService: IPersonsService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CreatePersonDto): Promise<Person> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const personRepo = queryRunner.manager.getRepository(Person);
      const userRepo = queryRunner.manager.getRepository(User);

      const existingUserByUsername = await userRepo.findOne({
        where: { username: dto.username, active: true },
      });
      if (existingUserByUsername) {
        throw new ConflictException('Usuario ya existente');
      }
      let person = await personRepo.findOne({
        where: [{ dni: dto.dni }, { email: dto.email }],
      });

      if (person) {
        if (person.active) {
          throw new ConflictException(
            `A person with this DNI or email already exists (active)`,
          );
        }

        Object.assign(person, {
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          phone: dto.phone,
          nationality: dto.nationality,
          address: dto.address,
          active: true,
        });
        person = await personRepo.save(person);

        const user = await userRepo.findOne({
          where: { idPerson: person.id },
        });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(dto.password, salt);

        if (user) {
          user.username = dto.username;
          user.passwordHash = passwordHash;
          user.active = true;
          await userRepo.save(user);
        } else {
          const newUser = userRepo.create({
            idPerson: person.id,
            username: dto.username,
            passwordHash,
          });
          await userRepo.save(newUser);
        }
      } else {
        person = personRepo.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          dni: dto.dni,
          email: dto.email,
          phone: dto.phone,
          nationality: dto.nationality,
          address: dto.address,
          active: dto.active,
        });

        person = await personRepo.save(person);

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(dto.password, salt);

        const user = userRepo.create({
          idPerson: person.id,
          username: dto.username,
          passwordHash,
        });

        await userRepo.save(user);
      }

      await queryRunner.commitTransaction();

      return this.personsService.findOne(person.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
