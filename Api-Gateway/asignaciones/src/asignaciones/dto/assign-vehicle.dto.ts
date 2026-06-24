import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class AssignVehicleDto {
  @ApiProperty({ description: 'UUID del propietario' })
  @IsString()
  @Matches(uuidRegex)
  userId: string;

  @ApiProperty({ description: 'UUID del vehículo' })
  @IsString()
  @Matches(uuidRegex)
  vehicleId: string;
}
