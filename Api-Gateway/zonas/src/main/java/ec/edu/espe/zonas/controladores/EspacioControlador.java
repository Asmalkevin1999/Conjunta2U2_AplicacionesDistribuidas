package ec.edu.espe.zonas.controladores;

import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ec.edu.espe.zonas.dtos.EspacioRequestDto;
import ec.edu.espe.zonas.dtos.EspacioResponseDto;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.services.EspacioServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/espacios")
@RequiredArgsConstructor
@Tag(name = "Espacios", description = "Operaciones CRUD para la gestión de espacios de parqueadero")
public class EspacioControlador {

    private final EspacioServicio espacioServicio; 

    @Operation(summary = "Listar todos los espacios", description = "Obtiene un listado de todos los espacios registrados")
    @ApiResponse(responseCode = "200", description = "Lista de espacios obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<EspacioResponseDto>> listarEspacios() {
        return ResponseEntity.ok(espacioServicio.obtenerEspacios());
    }


    @Operation(summary = "Crear un nuevo espacio", description = "Registra un nuevo espacio en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Espacio creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos", content = @Content)
    })
    @PostMapping
    public ResponseEntity<EspacioResponseDto> crearEspacio(
            @Valid @RequestBody EspacioRequestDto request) {
        return new ResponseEntity<>(espacioServicio.crearEspacio(request), HttpStatus.CREATED);
    }


    @Operation(summary = "Actualizar un espacio", description = "Actualiza los datos de un espacio existente por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Espacio actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Espacio no encontrado", content = @Content)
    })
    @PutMapping("/{idEspacio}")
    public ResponseEntity<EspacioResponseDto> actualizarEspacio(
            @Parameter(description = "ID del espacio a actualizar") @PathVariable UUID idEspacio,
            @Valid @RequestBody EspacioRequestDto request) {
        return ResponseEntity.ok(espacioServicio.actualizarEspacio(idEspacio, request));
    }


    @Operation(summary = "Eliminar un espacio (desactivación lógica)", description = "Realiza una desactivación lógica del espacio, no un borrado físico")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Espacio desactivado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Espacio no encontrado", content = @Content)
    })
    @DeleteMapping("/{idEspacio}")
    public ResponseEntity<Void> eliminarEspacio(@PathVariable UUID idEspacio) {
        espacioServicio.eliminarEspacio(idEspacio);
        return ResponseEntity.noContent().build();
    }


    @Operation(summary = "Cambiar estado de un espacio", description = "Cambia el estado de un espacio (DISPONIBLE, OCUPADO, INACTIVO)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Espacio no encontrado", content = @Content)
    })
    @PatchMapping("/{idEspacio}/estado")
    public ResponseEntity<EspacioResponseDto> cambiarEstado(
            @Parameter(description = "ID del espacio") @PathVariable UUID idEspacio,
            @Parameter(description = "Nuevo estado (DISPONIBLE, OCUPADO, INACTIVO)") @RequestParam EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.cambiarEstado(idEspacio, estado));
    }


    @Operation(summary = "Obtener espacios por estado", description = "Filtra espacios según su estado (DISPONIBLE, OCUPADO, INACTIVO)")
    @ApiResponse(responseCode = "200", description = "Lista de espacios filtrada exitosamente")
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EspacioResponseDto>> obtenerPorEstado(
            @Parameter(description = "Estado para filtrar") @PathVariable EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.obtenerEspaciosPorEstado(estado));
    }


    @Operation(summary = "Obtener espacios por zona y estado", description = "Filtra espacios según la zona y el estado")
    @ApiResponse(responseCode = "200", description = "Lista de espacios filtrada exitosamente")
    @GetMapping("/zona/{idZona}/estado/{estado}")
    public ResponseEntity<List<EspacioResponseDto>> obtenerPorZonaYEstado(
            @Parameter(description = "ID de la zona") @PathVariable UUID idZona,
            @Parameter(description = "Estado para filtrar") @PathVariable EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.obtenerEspaciosPorZonaEstado(idZona, estado));
    }


}
