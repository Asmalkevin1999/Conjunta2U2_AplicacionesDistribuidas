import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

export enum Clasificacion {
    ELECTRICO = 'Electrico',
    HIBRIDO = 'Hibrido',
    GASOLINA = 'Gasolina',
    DIESEL = 'Diesel'
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export abstract class Vehiculo {

    @ApiProperty({ description: 'UUID del vehículo', example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({ description: 'Placa del vehículo', example: 'ABC-1234' })
    @Column({ unique: true })
    placa!: string;
    
    @ApiProperty({ description: 'Marca del vehículo', example: 'Toyota' })
    @Column()
    marca!: string;

    @ApiProperty({ description: 'Modelo del vehículo', example: 'Corolla' })
    @Column()
    modelo!: string;

    @ApiProperty({ description: 'Color del vehículo', example: 'Rojo' })
    @Column()
    color!: string;

    @ApiProperty({ description: 'Año del vehículo', example: 2024 })
    @Column()
    anio!: number;

    @ApiProperty({ description: 'Clasificación del vehículo', enum: Clasificacion, example: Clasificacion.GASOLINA })
    @Column({type: 'enum', enum: Clasificacion, default: Clasificacion.GASOLINA})
    clasificacion!: Clasificacion;

    
    abstract obtenerTipo(): string;

}
