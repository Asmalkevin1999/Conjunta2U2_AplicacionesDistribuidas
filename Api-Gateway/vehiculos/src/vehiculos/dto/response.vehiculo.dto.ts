import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ResponseVehiculoDto {

    @ApiProperty({ description: 'UUID del vehículo', example: '550e8400-e29b-41d4-a716-446655440000' })
    id! : string;

    @ApiProperty({ description: 'Marca del vehículo', example: 'Toyota' })
    marca! : string;

    @ApiProperty({ description: 'Modelo del vehículo', example: 'Corolla' })
    modelo! : string;

    @ApiProperty({ description: 'Año del vehículo', example: 2024 })
    anio! : number;

    @ApiProperty({ description: 'Color del vehículo', example: 'Rojo' })
    color! : string;

    @ApiProperty({ description: 'Placa del vehículo', example: 'ABC-1234' })
    placa! : string;

    @ApiProperty({ description: 'Tipo de vehículo', example: 'Auto' })
    tipo! : string;

    @ApiPropertyOptional({ description: 'Capacidad de carga en kg (solo camionetas)', example: 1500 })
    capacidadCarga! : number;

    @ApiPropertyOptional({ description: 'Tipo de cabina (solo camionetas)', example: 'Simple' })
    cabina! : string;

    @ApiPropertyOptional({ description: 'Capacidad del maletero en litros (solo autos)', example: 470 })
    capacidadMaletero! : number;
}