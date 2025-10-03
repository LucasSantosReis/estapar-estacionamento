# Documentação Swagger/OpenAPI

## Visão Geral

Este projeto utiliza o SpringDoc OpenAPI 3 (Swagger) para documentação automática da API REST. A documentação interativa está disponível através da interface web do Swagger UI.

## Acesso à Documentação

### URLs de Acesso

- **Swagger UI**: http://localhost:3003/swagger-ui.html
- **OpenAPI JSON**: http://localhost:3003/api-docs
- **OpenAPI YAML**: http://localhost:3003/api-docs.yaml

### Configuração

A configuração do Swagger está definida em:

1. **OpenApiConfig.java** - Configuração principal do OpenAPI
2. **application.yml** - Configurações do SpringDoc
3. **Anotações nos Controllers** - Documentação dos endpoints

## Estrutura da Documentação

### Tags (Categorias)

A API está organizada em três categorias principais:

1. **Webhook** - Endpoints para recebimento de eventos de veículos
2. **Revenue** - Endpoints para consulta de receita
3. **Garage** - Endpoints para consulta de informações da garagem

### Endpoints Documentados

#### Webhook
- `POST /webhook` - Processar evento de webhook
- `GET /webhook/health` - Verificar saúde do endpoint

#### Revenue
- `GET /revenue` - Consultar receita (query parameters)
- `POST /revenue` - Consultar receita (JSON body)

#### Garage
- `GET /garage/sectors` - Listar todos os setores
- `GET /garage/sectors/{sector}` - Consultar setor específico
- `GET /garage/spots` - Listar todas as vagas
- `GET /garage/spots/sector/{sector}` - Consultar vagas por setor
- `GET /garage/status` - Status da garagem

## Exemplos de Uso

### Evento de Entrada (Webhook)
```json
POST /webhook
{
  "license_plate": "ABC1234",
  "event_type": "ENTRY",
  "entry_time": "2025-01-01T10:30:00"
}
```

### Evento de Estacionamento (Webhook)
```json
POST /webhook
{
  "license_plate": "ABC1234",
  "event_type": "PARKED",
  "lat": -23.5505,
  "lng": -46.6333
}
```

### Evento de Saída (Webhook)
```json
POST /webhook
{
  "license_plate": "ABC1234",
  "event_type": "EXIT",
  "exit_time": "2025-01-01T12:30:00"
}
```

### Consulta de Receita
```json
POST /revenue
{
  "date": "2025-01-01",
  "sector": "A"
}
```

### Resposta de Receita
```json
{
  "amount": 150.50,
  "currency": "BRL",
  "timestamp": "2025-01-01T10:30:00.000Z"
}
```

## Configurações Avançadas

### Personalização do OpenAPI

As configurações podem ser ajustadas no arquivo `OpenApiConfig.java`:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("Estapar Parking Management API")
            .description("API para gerenciamento de estacionamento")
            .version("1.0.0"))
        .servers(List.of(
            new Server().url("http://localhost:3003")
        ));
}
```

### Configurações do SpringDoc

No `application.yml`:

```yaml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  show-actuator: true
```

## Anotações Utilizadas

### Controllers
- `@Tag` - Categorização dos endpoints
- `@Operation` - Descrição dos endpoints
- `@ApiResponses` - Documentação das respostas
- `@Parameter` - Descrição dos parâmetros

### DTOs
- `@Schema` - Documentação dos campos
- `@ExampleObject` - Exemplos de valores

## Testando a API

1. Acesse http://localhost:3003/swagger-ui.html
2. Explore os endpoints disponíveis
3. Use o botão "Try it out" para testar os endpoints
4. Visualize os schemas dos DTOs
5. Teste com dados reais ou exemplos fornecidos

## Benefícios

- **Documentação Automática**: Atualizada automaticamente com mudanças no código
- **Interface Interativa**: Teste direto da API através do Swagger UI
- **Validação de Schemas**: Visualização clara dos tipos de dados
- **Exemplos**: Valores de exemplo para facilitar o uso
- **Categorização**: Organização clara dos endpoints por funcionalidade

## Integração com Desenvolvimento

- A documentação é gerada automaticamente durante o build
- Mudanças nos controllers e DTOs são refletidas automaticamente
- Não requer manutenção manual da documentação
- Compatível com ferramentas de geração de clientes (OpenAPI Generator)
