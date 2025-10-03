import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
  LayoutDashboard,
  DollarSign,
  PlayCircle,
  Activity,
} from 'lucide-react'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useParkingData, useVehicleEvents } from '../hooks/useParkingData'
import MetricCard from '../components/MetricCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EstaparLogo from '../components/EstaparLogo'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('occupancy')

  const { data: parkingData, isLoading: parkingLoading } = useParkingData()
  const { data: vehicleEvents, isLoading: eventsLoading } = useVehicleEvents()

  // Calculate analytics metrics
  const totalEvents = vehicleEvents?.length || 0
  const entryEvents = vehicleEvents?.filter(event => event.eventType === 'ENTRY').length || 0
  const exitEvents = vehicleEvents?.filter(event => event.eventType === 'EXIT').length || 0
  const avgStayTime = vehicleEvents?.filter(event => event.duration)
    .reduce((sum, event) => sum + event.duration, 0) / (vehicleEvents?.length || 1) || 0

  const occupancyBySector = parkingData?.sectors?.reduce((acc, sector) => {
    acc[sector.name] = (sector.occupiedSpots / sector.totalSpots) * 100
    return acc
  }, {}) || {}

  // Chart data
  const occupancyTrendData = {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
    datasets: [
      {
        label: 'Ocupação (%)',
        data: [15, 8, 45, 85, 92, 78, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const eventTypeData = {
    labels: ['Entrada', 'Saída', 'Estacionado'],
    datasets: [
      {
        data: [entryEvents, exitEvents, totalEvents - entryEvents - exitEvents],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2,
      }
    ]
  }

  const sectorPerformanceData = {
    labels: ['Setor A', 'Setor B', 'Setor C', 'Setor D'],
    datasets: [
      {
        label: 'Ocupação (%)',
        data: [
          occupancyBySector.A || 75,
          occupancyBySector.B || 60,
          occupancyBySector.C || 45,
          occupancyBySector.D || 55
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Receita (R$)',
        data: [15000, 12000, 9000, 11000],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ]
  }

  const performanceRadarData = {
    labels: ['Ocupação', 'Receita', 'Eficiência', 'Satisfação', 'Velocidade'],
    datasets: [
      {
        label: 'Setor A',
        data: [85, 90, 75, 88, 82],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Setor B',
        data: [70, 75, 80, 85, 78],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
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

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
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

  if (parkingLoading || eventsLoading) {
    return <LoadingSpinner message="Carregando dados de analytics..." />
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
                <h1 className="text-2xl font-bold">Analytics Avançado</h1>
                <p className="text-green-100">Análise profunda de performance e tendências</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <a href="/" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />
                  Dashboard
                </a>
                <a href="/revenue" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Faturamento
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
              <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
              <p className="mt-2 text-gray-600">Análise profunda de performance e tendências</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="select"
              >
                <option value="1d">Último dia</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>
              <button className="btn-primary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Eventos"
          value={totalEvents.toString()}
          icon={BarChart3}
          change="+12.5%"
          changeType="positive"
          color="primary"
          delay={0.1}
        />
        
        <MetricCard
          title="Taxa de Entrada"
          value={`${entryEvents}`}
          icon={Users}
          change="+8.3%"
          changeType="positive"
          color="success"
          delay={0.2}
        />
        
        <MetricCard
          title="Tempo Médio"
          value={`${Math.round(avgStayTime)} min`}
          icon={Clock}
          change="-2.1%"
          changeType="negative"
          color="warning"
          delay={0.3}
        />
        
        <MetricCard
          title="Ocupação Geral"
          value={`${Math.round(Object.values(occupancyBySector).reduce((a, b) => a + b, 0) / Object.keys(occupancyBySector).length)}%`}
          icon={MapPin}
          change="+5.7%"
          changeType="positive"
          color="danger"
          delay={0.4}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tendência de Ocupação</h3>
                <p className="text-sm text-gray-600">Padrão diário de utilização</p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="chart-container">
            <Line data={occupancyTrendData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Event Types Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Distribuição de Eventos</h3>
                <p className="text-sm text-gray-600">Tipos de eventos por período</p>
              </div>
              <BarChart3 className="h-5 w-5 text-success-600" />
            </div>
          </div>
          <div className="chart-container">
            <Doughnut data={eventTypeData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance por Setor</h3>
                <p className="text-sm text-gray-600">Comparação de ocupação e receita</p>
              </div>
              <MapPin className="h-5 w-5 text-warning-600" />
            </div>
          </div>
          <div className="chart-container">
            <Bar data={sectorPerformanceData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Análise de Performance</h3>
                <p className="text-sm text-gray-600">Métricas comparativas por setor</p>
              </div>
              <Zap className="h-5 w-5 text-danger-600" />
            </div>
          </div>
          <div className="chart-container">
            <Radar data={performanceRadarData} options={radarOptions} />
          </div>
        </motion.div>
      </div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Insights e Recomendações</h3>
              <p className="text-sm text-gray-600">Análise automática baseada nos dados</p>
            </div>
            <Filter className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
              Pontos Fortes
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-success-800">
                  <strong>Alta ocupação:</strong> Setor A atingiu 85% de ocupação, indicando alta demanda.
                </p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-success-800">
                  <strong>Eficiência operacional:</strong> Tempo médio de permanência otimizado em 2.1%.
                </p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-success-800">
                  <strong>Crescimento consistente:</strong> Receita aumentou 12.5% no período.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
              Oportunidades
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Setor C subutilizado:</strong> Apenas 45% de ocupação, potencial para otimização.
                </p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Picos de demanda:</strong> Horários 12h-16h podem beneficiar de preços dinâmicos.
                </p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Expansão:</strong> Considerar novos setores baseado na alta demanda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Analytics
