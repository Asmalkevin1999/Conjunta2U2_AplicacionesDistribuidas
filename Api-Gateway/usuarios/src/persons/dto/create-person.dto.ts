import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
  Length,
  Matches,
} from 'class-validator';

import {
  toLowerSingleSpace,
  toLowerTrim,
  trimOnly,
} from '../../common/transforms';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ description: 'Nombre de la persona', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]+$/, {
    message: 'firstName solo debe contener letras',
  })
  @toLowerSingleSpace
  firstName: string;

  @ApiProperty({ description: 'Apellido de la persona', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]+$/, {
    message: 'lastName solo debe contener letras',
  })
  @toLowerSingleSpace
  lastName: string;

  @ApiProperty({
    description: 'Segundo nombre de la persona',
    maxLength: 30,
    required: false,
  })
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]*$/, {
    message: 'middleName solo debe contener letras',
  })
  @toLowerSingleSpace
  middleName: string;

  @ApiProperty({
    description: 'Cédula de identidad (10 dígitos)',
    example: '1234567890',
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @Length(10, 10, { message: 'dni debe tener exactamente 10 caracteres' })
  @Matches(/^\d+$/, { message: 'dni solo debe contener números' })
  @trimOnly
  dni: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'usuario@correo.com',
    maxLength: 50,
  })
  @IsEmail({}, { message: 'email no es válido' })
  @MaxLength(50)
  @toLowerTrim
  email: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '0999123456',
    maxLength: 15,
  })
  @IsString()
  @MaxLength(15)
  @Matches(/^\d+$/, { message: 'phone solo debe contener números' })
  @trimOnly
  phone: string;

  @ApiProperty({ description: 'Nacionalidad de la persona', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]+$/, {
    message: 'nationality solo debe contener letras',
  })
  @toLowerSingleSpace
  nationality: string;

  @ApiProperty({ description: 'Dirección de domicilio' })
  @IsString()
  @trimOnly
  address: string;

  @ApiProperty({
    description: 'Estado de la persona',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Nombre de usuario para login',
    minLength: 4,
    maxLength: 15,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username solo acepta letras, números y guión bajo',
  })
  @toLowerTrim
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    minLength: 11,
    maxLength: 60,
  })
  @IsString()
  @MinLength(11, { message: 'password debe tener al menos 11 caracteres' })
  @MaxLength(60)
  password: string;
}
