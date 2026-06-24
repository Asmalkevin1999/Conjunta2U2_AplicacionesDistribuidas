package ec.edu.espe.zonas.dtos;

import java.util.UUID;

import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.TipoEspacio;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un espacio")
public class EspacioRequestDto {

    @Schema(description = "Código único del espacio", example = "ESP-A-001")
    private String codigo;

    @Schema(description = "ID de la zona a la que pertenece el espacio", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID idZona;

    @Schema(description = "Descripción del espacio", example = "Espacio número 1 - Planta baja")
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de espacio es obligatorio")
    @Schema(description = "Tipo de espacio", example = "AUTO")
    private TipoEspacio tipo;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Estado del espacio", example = "DISPONIBLE")
    private EstadoEspacio estado;

}
