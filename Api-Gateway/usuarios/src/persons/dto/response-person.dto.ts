import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export class ResponsePersonDto {
  @ApiProperty({ description: 'UUID de la persona' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre de la persona' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Apellido de la persona' })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'Segundo nombre de la persona' })
  @Expose()
  middleName: string;

  @ApiProperty({ description: 'Cédula de identidad' })
  @Expose()
  dni: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Número de teléfono' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Nacionalidad' })
  @Expose()
  nationality: string;

  @ApiProperty({ description: 'Dirección de domicilio' })
  @Expose()
  address: string;

  @ApiProperty({ description: 'Estado de la persona' })
  @Expose()
  active: boolean;

  @ApiProperty({ description: 'Usuario asociado', type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user?: ResponseUserDto;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
