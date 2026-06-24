import { ApiProperty } from "@nestjs/swagger";
import { ChildEntity, Column } from "typeorm";
import { Vehiculo } from "./vehiculo.entity";

export enum TipoMoto {
    DEPORTIVO = 'Deportivo',
    SCOOTER = 'Scooter',
    MOTOCROSS = 'Motocross',
}

@ChildEntity("Motocicleta")
export class Motocicleta extends Vehiculo {

    @ApiProperty({ description: 'Tipo de motocicleta', enum: TipoMoto, example: TipoMoto.DEPORTIVO })
    @Column({ type: 'enum', enum: TipoMoto })
    tipoMoto!: TipoMoto;

    obtenerTipo(): string {
        return 'Motocicleta';
    }

}