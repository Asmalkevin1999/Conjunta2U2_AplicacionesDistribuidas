import { ApiProperty } from "@nestjs/swagger";
import { ChildEntity, Column } from "typeorm";
import { Vehiculo } from "./vehiculo.entity";

@ChildEntity("Auto")
export class Auto extends Vehiculo {

    @ApiProperty({ description: 'Número de puertas', example: 4 })
    @Column()
    numeroPuertas!: number;

    @ApiProperty({ description: 'Capacidad del maletero en litros', example: 470 })
    @Column()
    capacidadMaletero!: number;
    
    obtenerTipo(): string {
        return 'Auto';
    }

}