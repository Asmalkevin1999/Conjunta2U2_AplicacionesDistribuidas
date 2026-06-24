package ec.edu.espe.zonas.entidades;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Estado del espacio: DISPONIBLE, OCUPADO o INACTIVO")
public enum EstadoEspacio {
    DISPONIBLE, OCUPADO, INACTIVO
}
