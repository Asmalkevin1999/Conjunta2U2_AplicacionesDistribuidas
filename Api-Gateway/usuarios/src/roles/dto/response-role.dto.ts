import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseRoleDto {
  @ApiProperty({ description: 'UUID del rol' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Estado del rol' })
  @Expose()
  active: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
