package com.estapar.parking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Estapar Parking Management API")
                        .description("API para gerenciamento de estacionamento Estapar com controle de vagas, eventos de veículos e cálculo de receita")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Estapar Development Team")
                                .email("dev@estapar.com")
                                .url("https://www.estapar.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:3003")
                                .description("Servidor Principal"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Servidor Alternativo")
                ));
    }
}
