import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Car, 
  Clock, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Users,
  MapPin,
  Calendar,
  RefreshCw,
  BarChart3,
  PlayCircle,
  Menu,
  Activity
} from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useRevenueData } from '../hooks/useRevenueData'
import { useParkingData } from '../hooks/useParkingData'
import MetricCard from '../components/MetricCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EstaparLogo from '../components/EstaparLogo'
import Footer from '../components/Footer'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: revenueData, isLoading: revenueLoading, refetch: refetchRevenue } = useRevenueData()
  const { data: parkingData, isLoading: parkingLoading, refetch: refetchParking } = useParkingData()

  // Simulated real-time data
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentOccupancy: 65,
    totalRevenue: 2847.50,
    vehiclesToday: 13,
    averageStayTime: 135 // em minutos
  })

  useEffect(() => {
    // Simulate real-time updates every 5 minutes
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        currentOccupancy: Math.max(20, Math.min(95, prev.currentOccupancy + (Math.random() - 0.5) * 8)),
        totalRevenue: prev.totalRevenue + Math.random() * 50 + 25, // R$ 25-75 por atualização
        vehiclesToday: prev.vehiclesToday + Math.floor(Math.random() * 2), // 0-1 veículo por atualização
        averageStayTime: Math.max(60, Math.min(240, prev.averageStayTime + (Math.random() - 0.5) * 10))
      }))
    }, 300000) // 5 minutos = 300000ms

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    refetchRevenue()
    refetchParking()
  }

  const handleGenerateReport = () => {
    // Simular geração de relatório
    const reportData = {
      date: new Date().toLocaleDateString('pt-BR'),
      revenue: realTimeMetrics.totalRevenue,
      occupancy: realTimeMetrics.currentOccupancy,
      vehicles: realTimeMetrics.vehiclesToday
    }
    
    // Criar e baixar relatório
    const reportText = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🚗 ESTAPAR PARKING                               ║
║                      Sistema de Gerenciamento                              ║
║                                                                              ║
║                              RELATÓRIO DE RECEITA                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Data: ${reportData.date}                                                    ║
║ Gerado em: ${new Date().toLocaleString('pt-BR')}                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  💰 FATURAMENTO TOTAL: R$ ${reportData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).padEnd(20)} ║
║  📊 OCUPAÇÃO ATUAL: ${reportData.occupancy.toFixed(1)}%${' '.repeat(25)} ║
║  🚗 VEÍCULOS HOJE: ${reportData.vehicles}${' '.repeat(28)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  📈 ANÁLISE:                                                                 ║
║  • Ocupação ${reportData.occupancy > 70 ? 'ALTA' : reportData.occupancy > 40 ? 'MÉDIA' : 'BAIXA'} - ${reportData.occupancy > 70 ? 'Considere expansão' : reportData.occupancy > 40 ? 'Performance normal' : 'Oportunidade de crescimento'}${' '.repeat(20)} ║
║  • Receita por veículo: R$ ${(reportData.revenue / Math.max(reportData.vehicles, 1)).toFixed(2)}${' '.repeat(25)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  🏢 ESTAPAR - A maior rede de estacionamentos do Brasil                    ║
║  📍 102 cidades | +468 mil vagas | +730 operações                          ║
║  🌐 www.estapar.com.br                                                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `
    
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ESTAPAR-Relatorio-Receita-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    alert('Relatório gerado e baixado com sucesso!')
  }

  const handleSimulateLoad = () => {
    // Simular adição de veículos
    setRealTimeMetrics(prev => ({
      ...prev,
      vehiclesToday: prev.vehiclesToday + Math.floor(Math.random() * 5) + 3,
      currentOccupancy: Math.min(95, prev.currentOccupancy + Math.floor(Math.random() * 15) + 5),
      totalRevenue: prev.totalRevenue + Math.random() * 200 + 100
    }))
    alert('Simulação de carga executada! Veículos e ocupação atualizados.')
  }

  const handleAnalyzeTrends = () => {
    // Simular análise de tendências
    const trend = realTimeMetrics.currentOccupancy > 70 ? 'alta' : 'baixa'
    const recommendation = trend === 'alta' 
      ? 'Considere aumentar os preços ou abrir novos setores.'
      : 'Ocupação baixa - considere promoções ou ajustes de preço.'
    
    alert(`Análise de Tendências:\n\nOcupação atual: ${trend}\n\nRecomendação: ${recommendation}`)
  }

  const handleSyncData = () => {
    // Simular sincronização
    setRealTimeMetrics(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + Math.random() * 100 + 50,
      currentOccupancy: Math.max(20, Math.min(95, prev.currentOccupancy + (Math.random() - 0.5) * 10)),
      vehiclesToday: prev.vehiclesToday + Math.floor(Math.random() * 3)
    }))
    alert('Dados sincronizados com sucesso!')
  }

  // Sample data for charts
  const revenueChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 59000, 72000, 68000, 75000, 71000, 82000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const occupancyChartData = {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
    datasets: [
      {
        label: 'Ocupação (%)',
        data: [15, 8, 45, 85, 92, 78, 25],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.6)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 2,
      }
    ]
  }

  const sectorDistributionData = {
    labels: ['Setor A', 'Setor B', 'Setor C', 'Setor D'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  if (revenueLoading || parkingLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EstaparLogo showText={true} className="text-white" />
              <div className="text-white">
                <h1 className="text-2xl font-bold">Dashboard Executivo</h1>
                <p className="text-green-100">Sistema de Gerenciamento de Estacionamentos</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <a href="/revenue" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Faturamento
                </a>
                <a href="/analytics" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  Analytics
                </a>
                <a href="/simulation" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <PlayCircle className="h-4 w-4 inline mr-1" />
                  Simulação
                </a>
                <a href="/monitoring" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <Activity className="h-4 w-4 inline mr-1" />
                  Monitoramento
                </a>
              </div>
              
              <div className="text-right text-white">
                <div className="text-sm text-green-100">Tempo real</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Executivo</h2>
              <p className="mt-2 text-gray-600">Sistema de Gerenciamento de Estacionamentos</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleRefresh}
                className="btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Faturamento Hoje"
            value={`R$ ${realTimeMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            change="+12.5%"
            changeType="positive"
            color="primary"
          />
          
          <MetricCard
            title="Ocupação Atual"
            value={`${Math.round(realTimeMetrics.currentOccupancy)}%`}
            icon={Car}
            change="+3.2%"
            changeType="positive"
            color={realTimeMetrics.currentOccupancy > 80 ? "danger" : realTimeMetrics.currentOccupancy > 60 ? "warning" : "success"}
          />
          
          <MetricCard
            title="Veículos Hoje"
            value={realTimeMetrics.vehiclesToday.toString()}
            icon={Users}
            change="+8.1%"
            changeType="positive"
            color="success"
          />
          
          <MetricCard
            title="Tempo Médio"
            value={`${Math.floor(realTimeMetrics.averageStayTime / 60)}h ${Math.round(realTimeMetrics.averageStayTime % 60)}m`}
            icon={Clock}
            change="-2.3%"
            changeType="negative"
            color="warning"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tendência de Faturamento</h3>
                  <p className="text-sm text-gray-600">Últimos 12 meses</p>
                </div>
                <TrendingUp className="h-5 w-5 text-success-600" />
              </div>
            </div>
            <div className="chart-container">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Occupancy by Hour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ocupação por Horário</h3>
                  <p className="text-sm text-gray-600">Padrão diário de hoje</p>
                </div>
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="chart-container">
              <Bar data={occupancyChartData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Distribuição por Setor</h3>
                  <p className="text-sm text-gray-600">Percentual de ocupação</p>
                </div>
                <Car className="h-5 w-5 text-warning-600" />
              </div>
            </div>
            <div className="chart-container">
              <Doughnut data={sectorDistributionData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Status Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
                  <p className="text-sm text-gray-600">Monitoramento em tempo real</p>
                </div>
                <AlertCircle className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">API Backend</p>
                  <p className="text-xs text-gray-600">Online - Resposta: 45ms</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Banco de Dados</p>
                  <p className="text-xs text-gray-600">Conectado - MySQL 8.0</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Simulador</p>
                  <p className="text-xs text-gray-600">Ativo - 15 eventos/min</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-warning-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Setor A</p>
                  <p className="text-xs text-gray-600">85% ocupado - Próximo do limite</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
                  <p className="text-sm text-gray-600">Operações frequentes</p>
                </div>
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleGenerateReport}
                className="w-full btn-primary text-left hover:bg-primary-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4" />
                  <span>Gerar Relatório de Receita</span>
                </div>
              </button>
              <button 
                onClick={handleSimulateLoad}
                className="w-full btn-secondary text-left hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Car className="h-4 w-4" />
                  <span>Simular Carga de Veículos</span>
                </div>
              </button>
              <button 
                onClick={handleAnalyzeTrends}
                className="w-full btn-secondary text-left hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Analisar Tendências</span>
                </div>
              </button>
              <button 
                onClick={handleSyncData}
                className="w-full btn-secondary text-left hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-4 w-4" />
                  <span>Sincronizar Dados</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Dashboard
