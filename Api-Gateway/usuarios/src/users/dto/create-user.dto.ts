import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { toLowerTrim } from '../../common/transforms';

export class CreateUserDto {
  @ApiProperty({ description: 'UUID de la persona asociada' })
  @IsString()
  idPerson: string;

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
    maxLength: 255,
  })
  @IsString()
  @MinLength(11, { message: 'password debe tener al menos 11 caracteres' })
  @MaxLength(255)
  password: string;
}
