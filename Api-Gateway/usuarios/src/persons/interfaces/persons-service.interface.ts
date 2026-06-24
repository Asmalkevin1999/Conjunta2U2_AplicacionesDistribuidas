import { Person } from '../entities/person.entity';
import { UpdatePersonDto } from '../dto/update-person.dto';

export interface IPersonsService {
  findAll(): Promise<Person[]>;
  findOne(id: string): Promise<Person>;
  update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person>;
  softDelete(id: string): Promise<void>;
}
