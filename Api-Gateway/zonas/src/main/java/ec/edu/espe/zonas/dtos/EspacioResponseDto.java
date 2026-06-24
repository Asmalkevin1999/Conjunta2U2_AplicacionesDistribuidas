package ec.edu.espe.zonas.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.TipoEspacio;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con los datos de un espacio")
public class EspacioResponseDto {

    @Schema(description = "ID único del espacio", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Código único del espacio", example = "ESP-A-001")
    private String codigo;

    @Schema(description = "Descripción del espacio", example = "Espacio número 1 - Planta baja")
    private String descripcion;

    @Schema(description = "Tipo de espacio", example = "AUTO")
    private TipoEspacio tipo;

    @Schema(description = "Estado del espacio", example = "DISPONIBLE")
    private EstadoEspacio estado;

    @Schema(description = "Indica si el espacio está activo", example = "true")
    private boolean activo;

    @Schema(description = "ID de la zona a la que pertenece", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID idZona;

    @Schema(description = "Nombre de la zona a la que pertenece", example = "Zona Norte")
    private String nombreZona;

    @Schema(description = "Fecha de creación", example = "2026-01-15T10:30:00")
    private LocalDateTime fechaCreacion;

    @Schema(description = "Fecha de última modificación", example = "2026-06-20T15:45:00")
    private LocalDateTime fechaModificacion;
    
}
