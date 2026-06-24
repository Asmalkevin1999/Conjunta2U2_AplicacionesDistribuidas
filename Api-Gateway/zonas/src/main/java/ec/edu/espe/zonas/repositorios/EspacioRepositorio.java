package ec.edu.espe.zonas.repositorios;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;

public interface EspacioRepositorio extends JpaRepository<Espacio, UUID> {

    boolean existsByCodigo(String codigo);

    List<Espacio> findByZona(UUID idZona);

    List<Espacio> findByZonaAndEstado(UUID idZona, EstadoEspacio estado);

    List<Espacio> findByEstado(EstadoEspacio estado);

    // Método derivado: cuenta todos los espacios que pertenecen a una zona
    long countByZona_Id(UUID idZona);

    @Query("SELECT COUNT(e) > 0 FROM Espacio e WHERE e.zona.id = :idZona AND e.activo = true")
    boolean existsEspaciosActivosPorZona(@Param("idZona") UUID idZona);

    @Query(value = "SELECT COUNT(*) FROM espacios WHERE id_zona = :idZona AND estado = 'DISPONIBLE'", nativeQuery = true)
    long contarEspaciosDisponiblesPorZona(@Param("idZona") UUID idZona);
    
}
