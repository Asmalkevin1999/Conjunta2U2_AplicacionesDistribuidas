package ec.edu.espe.zonas.services.impl;

import ec.edu.espe.zonas.dtos.EspacioRequestDto;
import ec.edu.espe.zonas.dtos.EspacioResponseDto;
import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositorios.EspacioRepositorio;
import ec.edu.espe.zonas.repositorios.ZonaRepositorio;
import ec.edu.espe.zonas.services.EspacioServicio;
import ec.edu.espe.zonas.utils.UtilsMappers;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EspacioServicioImpl implements EspacioServicio{

    private final UtilsMappers mappers;
    private final EspacioRepositorio repositorioEspacio;
    private final ZonaRepositorio zonaRepositorio;


    @Override
    public List<EspacioResponseDto> obtenerEspacios() {
        return repositorioEspacio.findAll().stream()
                .map(mappers::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public EspacioResponseDto crearEspacio(EspacioRequestDto dto) {

        if (dto.getIdZona() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El id de la zona es obligatorio.");
        }

        if (dto.getTipo() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo de espacio es obligatorio.");
        }

        Zona objZona = zonaRepositorio.findById(dto.getIdZona())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Zona no encontrada con id: " + dto.getIdZona()));

        if (objZona.getEstado() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede crear un espacio en la zona '" + objZona.getNombre()
                            + "' porque se encuentra inactiva.");
        }

        String codigo = dto.getCodigo();
        if (codigo != null) {
            codigo = codigo.trim();
            if (codigo.isBlank()) {
                codigo = null;
            } else if (repositorioEspacio.existsByCodigo(codigo)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Ya existe un espacio con el código: " + codigo);
            }
        }

        long espaciosActuales = repositorioEspacio.countByZona_Id(dto.getIdZona());

        if (espaciosActuales >= objZona.getCapacidad()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    String.format(
                            "La zona '%s' ha alcanzado su capacidad máxima de %d espacio(s). " +
                                    "Espacios actuales: %d.",
                            objZona.getNombre(),
                            objZona.getCapacidad(),
                            espaciosActuales));
        }

        Espacio nuevoEspacio = mappers.toEntity(dto);
        if (codigo == null) {
            String fechaStr = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd"));
            nuevoEspacio.setCodigo(String.format("TICK-%s-%d-%s",
                    objZona.getCodigo(), espaciosActuales + 1, fechaStr));
        } else {
            nuevoEspacio.setCodigo(codigo);
        }
        if (nuevoEspacio.getDescripcion() != null) {
            nuevoEspacio.setDescripcion(nuevoEspacio.getDescripcion().trim());
        }
        nuevoEspacio.setZona(objZona);
        nuevoEspacio.setEstado(EstadoEspacio.DISPONIBLE);
        nuevoEspacio.setActivo(true);
        nuevoEspacio.setFechaCreacion(LocalDateTime.now());

        Espacio espacioGuardado = repositorioEspacio.save(nuevoEspacio);
        return mappers.toResponseDto(espacioGuardado);
    }


    @Override
    @Transactional
    public EspacioResponseDto actualizarEspacio(UUID idEspacio, EspacioRequestDto dto) {
        Espacio espacio = repositorioEspacio.findById(idEspacio)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Espacio no encontrado con id: " + idEspacio));

        if (espacio.getZona().getEstado() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede actualizar un espacio en una zona inactiva.");
        }

        if (dto.getDescripcion() != null) {
            espacio.setDescripcion(dto.getDescripcion().trim());
        }
        if (dto.getTipo() != null) {
            espacio.setTipo(dto.getTipo());
        }
        espacio.setFechaModificacion(LocalDateTime.now());

        return mappers.toResponseDto(repositorioEspacio.save(espacio));
    }


    @Override
    @Transactional
    public void eliminarEspacio(UUID idEspacio) {
        Espacio espacio = repositorioEspacio.findById(idEspacio)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Espacio no encontrado con id: " + idEspacio));
 
        if (!espacio.isActivo()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El espacio ya se encuentra inactivo.");
        }
 
        espacio.setActivo(false);
        espacio.setEstado(EstadoEspacio.INACTIVO);
        espacio.setFechaModificacion(LocalDateTime.now());
        repositorioEspacio.save(espacio);
    }


    @Override
    @Transactional
    public EspacioResponseDto cambiarEstado(UUID idEspacio, EstadoEspacio estado) {
        Espacio espacio = repositorioEspacio.findById(idEspacio)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Espacio no encontrado con id: " + idEspacio));

        if (estado == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El estado es obligatorio.");
        }

        if (estado == EstadoEspacio.DISPONIBLE && espacio.getZona().getEstado() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede marcar como disponible un espacio en una zona inactiva.");
        }

        if (!espacio.isActivo()) {
            espacio.setActivo(true);
        }

        espacio.setEstado(estado);
        espacio.setFechaModificacion(LocalDateTime.now());
        return mappers.toResponseDto(repositorioEspacio.save(espacio));
    }
    

    @Override
    @Transactional(readOnly = true)
    public List<EspacioResponseDto> obtenerEspaciosPorEstado(EstadoEspacio estado) {
        return repositorioEspacio.findByEstado(estado).stream()
                .map(mappers::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EspacioResponseDto> obtenerEspaciosPorZonaEstado(UUID idZona, EstadoEspacio estado) {
        return repositorioEspacio.findByZonaAndEstado(idZona, estado).stream()
                .map(mappers::toResponseDto)
                .toList();
    }
    
}
