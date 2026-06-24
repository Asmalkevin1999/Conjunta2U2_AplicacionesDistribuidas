package ec.edu.espe.zonas.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.TipoZona;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Respuesta con los datos de una zona")
public class ZonaResponseDto {
    @Schema(description = "ID único de la zona", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID idZona;

    @Schema(description = "Nombre de la zona", example = "Zona Norte")
    private String nombre;

    @Schema(description = "Código único de la zona", example = "ZN-001")
    private String codigo;

    @Schema(description = "Descripción de la zona", example = "Zona ubicada en el ala norte")
    private String descripcion;

    @Schema(description = "Estado de la zona (1=Activo, 0=Inactivo)", example = "1")
    private int estado;

    @Schema(description = "Tipo de zona", example = "REGULAR")
    private TipoZona tipo;

    @Schema(description = "Capacidad máxima", example = "50")
    private int capacidad;

    @JsonIgnoreProperties("zona")
    @Schema(description = "Lista de espacios pertenecientes a la zona")
    private List<Espacio> espacios;

    @Schema(description = "Fecha de creación", example = "2026-01-15T10:30:00")
    private LocalDateTime fechaCreacion;

    @Schema(description = "Fecha de última modificación", example = "2026-06-20T15:45:00")
    private LocalDateTime fechaModificacion;

}
