import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAssignmentDto {
  @ApiPropertyOptional({ description: 'Marca la asignación como activa o inactiva' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
