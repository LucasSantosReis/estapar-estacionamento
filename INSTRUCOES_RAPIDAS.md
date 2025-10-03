# 🚀 Instruções Rápidas - Estapar Parking System

## ✅ Pré-requisitos
- Docker instalado
- Docker Compose instalado

## 🎯 Passos para Executar

### 1. Iniciar o Simulador
```bash
docker run -d --network="host" cfontes0estapar/garage-sim:1.0.0
```

### 2. Clone e Execute
```bash
git clone https://github.com/LucasSantosReis/estapar-estacionamento.git
cd estapar-estacionamento
docker-compose up -d
```

## ⏱️ Aguardar Inicialização
- **Aguarde 60 segundos** para todos os serviços iniciarem
- Verifique se está funcionando: `docker-compose ps`

## 🌐 Acessar o Sistema
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3003
- **Swagger:** http://localhost:3003/swagger-ui.html

## 🧪 Testar Rapidamente

### API de Receita
```bash
curl "http://localhost:3003/revenue?date=2025-01-01&sector=A"
```

### Webhook (Fluxo Completo)
```bash
# 1. ENTRY
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{"license_plate":"TEST123","event_type":"ENTRY","entry_time":"2025-01-01T12:00:00Z"}'

# 2. PARKED
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{"license_plate":"TEST123","event_type":"PARKED","lat":-23.561684,"lng":-46.655981}'

# 3. EXIT
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{"license_plate":"TEST123","event_type":"EXIT","exit_time":"2025-01-01T14:00:00Z"}'
```

## 🛑 Parar o Sistema
```bash
# Parar aplicação
docker-compose down

# Parar simulador (se necessário)
docker stop <container-id-do-simulador>
```

## 📊 Executar Testes
```bash
docker exec parking-app mvn test
```

**Resultado esperado:** `Tests run: 36, Failures: 0, Errors: 0, Skipped: 0`

---

**🎯 É isso! Sistema funcionando em menos de 2 minutos!**
