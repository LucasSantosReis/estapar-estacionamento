# API Tests - Estapar Parking Management System

Este documento contém exemplos de como testar todas as funcionalidades da API.

## Pré-requisitos

1. Aplicação rodando em `http://localhost:3003`
2. Simulador da garagem rodando
3. MySQL configurado e rodando

## 1. Verificar Status da Garagem

### Listar todos os setores
```bash
curl -X GET http://localhost:3003/garage/sectors
```

### Listar todas as vagas
```bash
curl -X GET http://localhost:3003/garage/spots
```

### Verificar status geral da garagem
```bash
curl -X GET http://localhost:3003/garage/status
```

## 2. Simular Ciclo Completo de Estacionamento

### 2.1 Entrada do Veículo
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "ABC1234",
    "entry_time": "2025-01-01T12:00:00.000Z",
    "event_type": "ENTRY"
  }'
```

**Resposta esperada:**
```
Event processed successfully
```

### 2.2 Evento de Estacionamento
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "ABC1234",
    "lat": -23.561684,
    "lng": -46.655981,
    "event_type": "PARKED"
  }'
```

### 2.3 Saída do Veículo (após 1 hora)
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "ABC1234",
    "exit_time": "2025-01-01T13:00:00.000Z",
    "event_type": "EXIT"
  }'
```

## 3. Testar Regras de Preço Dinâmico

### 3.1 Teste com menos de 25% de ocupação (desconto de 10%)
```bash
# Entrada 1
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "CAR001",
    "entry_time": "2025-01-01T10:00:00.000Z",
    "event_type": "ENTRY"
  }'

# Saída após 1 hora
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "CAR001",
    "exit_time": "2025-01-01T11:00:00.000Z",
    "event_type": "EXIT"
  }'
```

### 3.2 Teste com mais de 75% de ocupação (aumento de 25%)
```bash
# Simular múltiplas entradas para aumentar ocupação
for i in {2..80}; do
  curl -X POST http://localhost:3003/webhook \
    -H "Content-Type: application/json" \
    -d "{
      \"license_plate\": \"CAR$i\",
      \"entry_time\": \"2025-01-01T10:00:00.000Z\",
      \"event_type\": \"ENTRY\"
    }"
done
```

## 4. Testar Primeiros 30 Minutos Gratuitos

### Entrada e saída em 15 minutos (deve ser gratuito)
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "FREE001",
    "entry_time": "2025-01-01T12:00:00.000Z",
    "event_type": "ENTRY"
  }'

# Saída após 15 minutos
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "FREE001",
    "exit_time": "2025-01-01T12:15:00.000Z",
    "event_type": "EXIT"
  }'
```

### Entrada e saída em 45 minutos (deve cobrar 1 hora)
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "PAID001",
    "entry_time": "2025-01-01T12:00:00.000Z",
    "event_type": "ENTRY"
  }'

# Saída após 45 minutos
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "PAID001",
    "exit_time": "2025-01-01T12:45:00.000Z",
    "event_type": "EXIT"
  }'
```

## 5. Consultar Receita

### Consultar receita por setor e data
```bash
curl -X GET "http://localhost:3003/revenue?date=2025-01-01&sector=A"
```

**Resposta esperada:**
```json
{
  "amount": 150.00,
  "currency": "BRL",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Consultar receita via POST
```bash
curl -X POST http://localhost:3003/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-01",
    "sector": "A"
  }'
```

## 6. Testar Casos de Erro

### 6.1 Tentativa de entrada sem vagas disponíveis
```bash
# Primeiro, ocupar todas as vagas do setor A
for i in {1..100}; do
  curl -X POST http://localhost:3003/webhook \
    -H "Content-Type: application/json" \
    -d "{
      \"license_plate\": \"FULL$i\",
      \"entry_time\": \"2025-01-01T10:00:00.000Z\",
      \"event_type\": \"ENTRY\"
    }"
done

# Tentar entrar quando setor está cheio
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "REJECTED",
    "entry_time": "2025-01-01T11:00:00.000Z",
    "event_type": "ENTRY"
  }'
```

### 6.2 Tentativa de saída de veículo não estacionado
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "NOTPARKED",
    "exit_time": "2025-01-01T12:00:00.000Z",
    "event_type": "EXIT"
  }'
```

### 6.3 Dados inválidos
```bash
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "",
    "event_type": "INVALID"
  }'
```

## 7. Verificar Logs da Aplicação

Os logs da aplicação mostrarão:
- Carregamento da configuração da garagem
- Processamento de eventos
- Cálculos de preços dinâmicos
- Erros e exceções

## 8. Testes de Performance

### Teste de múltiplas entradas simultâneas
```bash
#!/bin/bash
for i in {1..10}; do
  curl -X POST http://localhost:3003/webhook \
    -H "Content-Type: application/json" \
    -d "{
      \"license_plate\": \"PERF$i\",
      \"entry_time\": \"2025-01-01T12:00:00.000Z\",
      \"event_type\": \"ENTRY\"
    }" &
done
wait
```

## 9. Validação dos Resultados

### Verificar vagas ocupadas
```bash
curl -X GET http://localhost:3003/garage/spots/sector/A | grep -c '"available":false'
```

### Verificar total de eventos
```bash
# Contar eventos de entrada
curl -X GET http://localhost:3003/garage/status
```

### Verificar receita total
```bash
curl -X GET "http://localhost:3003/revenue?date=2025-01-01&sector=A"
```

## 10. Limpeza dos Dados (Opcional)

Para resetar os dados entre testes, você pode:
1. Parar a aplicação
2. Limpar as tabelas do banco de dados
3. Reiniciar a aplicação

```sql
USE parking_management;
TRUNCATE TABLE parking_events;
UPDATE parking_spots SET available = TRUE, occupied_by = NULL;
```

## Observações

- Todos os eventos devem retornar status 200 OK quando processados com sucesso
- Erros devem retornar status 400 Bad Request com mensagem descritiva
- Os preços dinâmicos são calculados no momento da entrada
- A receita é calculada apenas para eventos de saída (EXIT)
- O sistema suporta múltiplos setores (configurados via simulador)
