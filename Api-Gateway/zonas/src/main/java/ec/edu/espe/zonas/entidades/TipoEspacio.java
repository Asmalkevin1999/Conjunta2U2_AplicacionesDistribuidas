package ec.edu.espe.zonas.entidades;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Tipo de espacio: MOTO, AUTO o BUSETA")
public enum TipoEspacio {
    MOTO, AUTO, BUSETA
}
