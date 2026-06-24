import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ description: 'UUID de la persona (ID del usuario)' })
  @Expose()
  idPerson: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @Expose()
  username: string;

  @Exclude()
  passwordHash: string;

  @ApiProperty({ description: 'Estado del usuario' })
  @Expose()
  active: boolean;

  @ApiProperty({ description: 'Último inicio de sesión', required: false })
  @Expose()
  lastLogin?: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
