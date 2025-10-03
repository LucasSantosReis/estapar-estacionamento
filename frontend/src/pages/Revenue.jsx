import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Search,
  LayoutDashboard,
  PlayCircle,
  Activity,
} from 'lucide-react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useRevenueData, useRevenueHistory } from '../hooks/useRevenueData'
import MetricCard from '../components/MetricCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EstaparLogo from '../components/EstaparLogo'
import Footer from '../components/Footer'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

const Revenue = () => {
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  })
  const [selectedSector, setSelectedSector] = useState('A')
  const [chartType, setChartType] = useState('line')

  const { data: currentRevenue, isLoading: currentLoading } = useRevenueData(
    format(new Date(), 'yyyy-MM-dd'),
    selectedSector
  )

  const { data: revenueHistory, isLoading: historyLoading } = useRevenueHistory(
    dateRange.start,
    dateRange.end,
    selectedSector
  )

  const handleExportReport = () => {
    // Simular exportação de relatório
    const reportData = {
      date: new Date().toLocaleDateString('pt-BR'),
      revenue: currentRevenue?.amount || 0,
      sector: selectedSector
    }
    
    const reportText = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🚗 ESTAPAR PARKING                               ║
║                      Sistema de Gerenciamento                              ║
║                                                                              ║
║                              RELATÓRIO DE RECEITA                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Data: ${reportData.date}                                                    ║
║ Setor: ${reportData.sector}                                                 ║
║ Gerado em: ${new Date().toLocaleString('pt-BR')}                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  💰 FATURAMENTO: R$ ${reportData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).padEnd(20)} ║
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
    
    alert('Relatório exportado com sucesso!')
  }

  // Sample data for charts
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita (R$)',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const sectorData = {
    labels: ['Setor A', 'Setor B', 'Setor C', 'Setor D'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  }

  if (currentLoading || historyLoading) {
    return <LoadingSpinner message="Carregando dados de receita..." />
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
                <h1 className="text-2xl font-bold">Relatório de Faturamento</h1>
                <p className="text-green-100">Análise detalhada de receitas e tendências</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <a href="/" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />
                  Dashboard
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
              <h2 className="text-2xl font-bold text-gray-900">Relatório de Faturamento</h2>
              <p className="mt-2 text-gray-600">Análise detalhada de receitas e tendências</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleExportReport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Receita Hoje"
              value={`R$ ${(currentRevenue?.amount || 2847.50).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              change="+12.5%"
              changeType="positive"
              color="success"
            />
            <MetricCard
              title="Crescimento"
              value="+8.2%"
              icon={TrendingUp}
              change="+2.1%"
              changeType="positive"
              color="primary"
            />
            <MetricCard
              title="Setor Ativo"
              value={selectedSector}
              icon={BarChart3}
              change="+5.3%"
              changeType="positive"
              color="warning"
            />
            <MetricCard
              title="Período"
              value={`${format(new Date(dateRange.start), 'dd/MM', { locale: ptBR })} - ${format(new Date(dateRange.end), 'dd/MM', { locale: ptBR })}`}
              icon={Calendar}
              change="30 dias"
              changeType="neutral"
              color="info"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card h-96"
            >
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Tendência de Receita</h3>
                <p className="text-sm text-gray-600">Últimos 6 meses</p>
              </div>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card h-96"
            >
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Distribuição por Setor</h3>
                <p className="text-sm text-gray-600">Percentual de receita</p>
              </div>
              <div className="chart-container flex items-center justify-center">
                <Pie data={sectorData} options={pieOptions} />
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

export default Revenue
