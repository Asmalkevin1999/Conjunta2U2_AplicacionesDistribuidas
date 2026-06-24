package ec.edu.espe.zonas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server()
                        .url("http://localhost:8000")
                        .description("Kong API Gateway"))
                .info(new Info()
                        .title("Zonas")
                        .description("API para la gestión de zonas y espacios de parqueadero")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Desarrollador")
                                .email("kfamaguana@espe.edu.ec"))
                        .license(new License()
                                .name("© ESPE - 2026")));
    }
}
