# 🚗 Estapar Parking Dashboard

Dashboard moderno e interativo para gerenciamento de estacionamento com análise de faturamento, simulação de carga e projeções de crescimento.

## ✨ Características

### 🎯 **Dashboard Principal**
- **Métricas em tempo real**: Ocupação, receita, veículos e tempo médio
- **Gráficos interativos**: Tendências de faturamento e ocupação por horário
- **Status do sistema**: Monitoramento de saúde dos serviços
- **Ações rápidas**: Acesso direto a funcionalidades principais

### 📊 **Análise de Receita**
- **Relatórios detalhados**: Filtros por data e setor
- **Visualizações múltiplas**: Linha, barras e pizza
- **Comparação por setor**: Distribuição de receita
- **Insights automáticos**: Análise de tendências e oportunidades
- **Exportação**: Geração de relatórios em PDF/Excel

### 🎮 **Simulação de Carga**
- **Cenários pré-definidos**: Conservador, moderado e agressivo
- **Configuração flexível**: Veículos, duração, intervalos e crescimento
- **Projeções visuais**: Gráficos de ocupação e receita
- **Execução em tempo real**: Simulação com métricas ao vivo
- **Histórico**: Registro de simulações anteriores

### 📈 **Analytics Avançado**
- **Métricas de performance**: KPIs detalhados
- **Análise de eventos**: Distribuição e padrões
- **Comparação de setores**: Performance relativa
- **Radar de performance**: Métricas multidimensionais
- **Insights e recomendações**: IA para otimização

### ⚙️ **Configurações**
- **Parâmetros de estacionamento**: Preços, tempo grátis, regras dinâmicas
- **Configurações do sistema**: Atualização, notificações, intervalos
- **Segurança**: Rate limiting, criptografia, controle de acesso
- **API**: Endpoints, timeouts, monitoramento de status

## 🛠️ Tecnologias

### **Frontend Stack**
- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animações
- **Chart.js + React-Chartjs-2** - Gráficos
- **React Query** - Gerenciamento de estado
- **React Router** - Navegação
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

### **Testes**
- **Vitest** - Test runner
- **React Testing Library** - Testes de componentes
- **Jest DOM** - Matchers customizados
- **MSW** - Mock de APIs

## 🚀 Instalação e Execução

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Backend da aplicação rodando na porta 3003

### **Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd estapar-parking/frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### **Execução**
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Executar testes
npm test

# Executar testes com UI
npm run test:ui
```

### **Acesso**
- **Desenvolvimento**: http://localhost:3000
- **Produção**: Conforme configurado no servidor

## 📱 Funcionalidades por Página

### **Dashboard (`/`)**
- Métricas em tempo real
- Gráficos de tendência
- Status do sistema
- Ações rápidas

### **Receita (`/revenue`)**
- Filtros por período e setor
- Múltiplos tipos de gráfico
- Comparação por setor
- Exportação de relatórios

### **Simulação (`/simulation`)**
- Configuração de cenários
- Simulação em tempo real
- Projeções de crescimento
- Histórico de simulações

### **Analytics (`/analytics`)**
- Métricas avançadas
- Análise de performance
- Insights automáticos
- Recomendações

### **Configurações (`/settings`)**
- Parâmetros de operação
- Configurações de segurança
- Monitoramento de API
- Status dos serviços

## 🔧 Configuração

### **Variáveis de Ambiente**
```env
VITE_API_BASE_URL=http://localhost:3003/api
VITE_APP_NAME=Estapar Parking Dashboard
VITE_APP_VERSION=1.0.0
```

### **Proxy de Desenvolvimento**
O Vite está configurado para fazer proxy das requisições `/api` para o backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3003',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 📊 Integração com Backend

### **Endpoints Utilizados**
- `GET /api/revenue` - Consulta de receita
- `POST /api/revenue` - Consulta de receita (POST)
- `GET /api/garage/sectors` - Dados dos setores
- `POST /api/webhook` - Simulação de eventos

### **Hooks Customizados**
- `useRevenueData` - Dados de receita
- `useRevenueHistory` - Histórico de receita
- `useParkingData` - Dados de estacionamento
- `useVehicleEvents` - Eventos de veículos
- `useBulkSimulation` - Simulação em massa

## 🎨 Design System

### **Cores**
- **Primary**: Azul (#3B82F6)
- **Success**: Verde (#22C55E)
- **Warning**: Amarelo (#F59E0B)
- **Danger**: Vermelho (#EF4444)

### **Componentes**
- `MetricCard` - Cards de métricas
- `LoadingSpinner` - Indicador de carregamento
- `Layout` - Layout principal com sidebar

### **Animações**
- Fade in/out com Framer Motion
- Transições suaves entre páginas
- Hover effects nos componentes
- Loading states animados

## 🧪 Testes

### **Estrutura de Testes**
```
src/
├── components/__tests__/
│   └── MetricCard.test.jsx
├── hooks/__tests__/
│   └── useRevenueData.test.js
├── pages/__tests__/
│   └── Simulation.test.jsx
└── test/
    └── setup.js
```

### **Executar Testes**
```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# UI de testes
npm run test:ui
```

## 📈 Performance

### **Otimizações**
- **Code Splitting**: Lazy loading de rotas
- **Bundle Analysis**: Análise de tamanho do bundle
- **Image Optimization**: Otimização automática de imagens
- **Caching**: React Query para cache de dados

### **Métricas**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB gzipped

## 🔒 Segurança

### **Medidas Implementadas**
- **Input Validation**: Validação de todos os inputs
- **XSS Protection**: Sanitização de dados
- **CSRF Protection**: Tokens de proteção
- **Rate Limiting**: Limitação de requisições

## 📱 Responsividade

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Adaptações**
- Sidebar colapsável em mobile
- Gráficos responsivos
- Grid adaptativo
- Touch-friendly interfaces

## 🚀 Deploy

### **Build de Produção**
```bash
npm run build
```

### **Deploy Estático**
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: Upload da pasta `dist/`

### **Deploy com Docker**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contribuição

### **Padrões de Código**
- **ESLint**: Linting automático
- **Prettier**: Formatação de código
- **Conventional Commits**: Padrão de commits
- **Husky**: Git hooks

### **Estrutura de Commits**
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 📞 Suporte

### **Documentação**
- **API Docs**: http://localhost:3003/swagger-ui.html
- **Storybook**: http://localhost:6006 (se configurado)
- **Changelog**: CHANGELOG.md

### **Contato**
- **Email**: devops@estapar.com
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**🎯 Dashboard criado para demonstrar capacidades técnicas avançadas e visão estratégica de produto!**
