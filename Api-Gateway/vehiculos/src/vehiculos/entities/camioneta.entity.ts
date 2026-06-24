import { ApiProperty } from "@nestjs/swagger";
import { ChildEntity, Column } from "typeorm";
import { Vehiculo } from "./vehiculo.entity";

@ChildEntity("Camioneta")
export class Camioneta extends Vehiculo {

    @ApiProperty({ description: 'Tipo de cabina', example: 'Simple' })
    @Column()
    cabina!: string;
    
    @ApiProperty({ description: 'Capacidad de carga en kg', example: 1500 })
    @Column()
    capacidadCarga!: number;

    obtenerTipo(): string {
        return 'camioneta';
    }

}