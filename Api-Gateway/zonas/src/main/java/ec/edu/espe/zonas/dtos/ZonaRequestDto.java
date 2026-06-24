package ec.edu.espe.zonas.dtos;

import ec.edu.espe.zonas.entidades.TipoZona;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una zona")
public class ZonaRequestDto {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min =1, max = 32, message = "El nombre debe tener entre 1 y 32 caracteres")
    @Schema(description = "Nombre de la zona", example = "Zona Norte", maxLength = 32)
    private String nombre;

    @Schema(description = "Descripción de la zona", example = "Zona ubicada en el ala norte del edificio")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Tipo de zona", example = "REGULAR")
    private TipoZona tipo;

    @Min(1)
    @Max(100)
    @Schema(description = "Capacidad máxima de la zona", example = "50", minimum = "1", maximum = "100")
    private int capacidad;
    

}
