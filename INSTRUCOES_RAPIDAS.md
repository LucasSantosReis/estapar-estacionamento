# 🚀 Instruções Rápidas - Estapar Parking System

## ✅ Pré-requisitos
- Docker instalado
- Docker Compose instalado

## 🎯 Comando Único para Executar
```bash
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
```bash
# Teste da API de receita
curl "http://localhost:3003/revenue?date=2025-01-01&sector=A"

# Teste do webhook
curl -X POST http://localhost:3003/webhook \
  -H "Content-Type: application/json" \
  -d '{"license_plate":"ABC1234","event_type":"ENTRY","entry_time":"2025-01-01T12:00:00Z"}'
```

## 🛑 Parar o Sistema
```bash
docker-compose down
```

## 📊 Executar Testes
```bash
docker exec parking-app mvn test
```

**Resultado esperado:** `Tests run: 19, Failures: 0, Errors: 0, Skipped: 0`

---

**🎯 É isso! Sistema funcionando em menos de 2 minutos!**
