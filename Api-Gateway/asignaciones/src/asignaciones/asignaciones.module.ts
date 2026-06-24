import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesController } from './asignaciones.controller';
import { AsignacionesService } from './asignaciones.service';
import { Assignment } from './entities/assignment.entity';
import { AssignmentHistory } from './entities/assignment-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, AssignmentHistory])],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [AsignacionesService],
})
export class AsignacionesModule {}
