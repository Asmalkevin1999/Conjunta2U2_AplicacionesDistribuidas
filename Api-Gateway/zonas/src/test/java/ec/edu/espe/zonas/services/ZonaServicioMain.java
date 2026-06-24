package ec.edu.espe.zonas.services;

import ec.edu.espe.zonas.ZonasApplication;
import ec.edu.espe.zonas.dtos.ZonaRequestDto;
import ec.edu.espe.zonas.dtos.ZonaResponseDto;
import ec.edu.espe.zonas.entidades.TipoZona;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.List;

public class ZonaServicioMain {

    public static void main(String[] args) {

        ConfigurableApplicationContext ctx =
                SpringApplication.run(ZonasApplication.class, args);

        ZonaServicio zonaServicio = ctx.getBean(ZonaServicio.class);

        System.out.println("\n--- PRUEBA 1: Crear zona REGULAR (ZON-REG-NN) ---");
        ZonaRequestDto requestRegular = ZonaRequestDto.builder()
                .nombre("Zona Sur 20")
                .descripcion("Zona tipo REGULAR 20")
                .tipo(TipoZona.REGULAR)
                .build();

        ZonaResponseDto responseRegular = zonaServicio.crearZona(requestRegular);
        System.out.println(">>> Zona creada exitosamente:");

        // ── 3. Probar con tipo VIP ─────────────────────────────────────────────
        System.out.println("\n--- PRUEBA 2: Crear zona VIP (ZON-VIP-NN) ---");
        ZonaRequestDto requestVip = ZonaRequestDto.builder()
                .nombre("Zona VIP 40")
                .descripcion("Zona tipo VIP 40")
                .tipo(TipoZona.VIP)
                .build();

        ZonaResponseDto responseVip = zonaServicio.crearZona(requestVip);
        System.out.println(">>> Zona VIP creada:");
        System.out.println("    Codigo generado: " + responseVip.getCodigo());    // ZON-VIP-NN


        ctx.close();
    }
}