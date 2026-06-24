import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { trimOnly } from '../../common/transforms';

export class AssignRoleDto {
  @ApiProperty({ description: 'UUID del usuario' })
  @IsString()
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )
  @trimOnly
  idUser: string;

  @ApiProperty({ description: 'UUID del rol' })
  @IsString()
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )
  @trimOnly
  idRole: string;
}
