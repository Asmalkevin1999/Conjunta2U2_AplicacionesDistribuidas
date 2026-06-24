import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { Person } from './entities/person.entity';
import { UsersModule } from '../users/users.module';
import { CreatePersonUseCase } from './use-cases/create-person.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), UsersModule],
  controllers: [PersonsController],
  providers: [
    {
      provide: 'IPersonsService',
      useClass: PersonsService,
    },
    CreatePersonUseCase,
  ],
  exports: [TypeOrmModule],
})
export class PersonsModule {}
