import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  Car, 
  Clock, 
  DollarSign,
  BarChart3,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  LayoutDashboard,
  PlayCircle,
  Activity
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useBulkSimulation, useParkingData } from '../hooks/useParkingData'
import { useRevenueData } from '../hooks/useRevenueData'
import MetricCard from '../components/MetricCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EstaparLogo from '../components/EstaparLogo'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import toast from 'react-hot-toast'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Simulation = () => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationConfig, setSimulationConfig] = useState({
    vehicleCount: 50,
    duration: 120, // minutes
    eventInterval: 30000, // 30 seconds
    growthRate: 0.15
  })
  const [simulationHistory, setSimulationHistory] = useState([])
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    vehiclesInProgress: 0,
    totalRevenue: 0,
    averageStayTime: 0,
    peakOccupancy: 0
  })

  const { runBulkSimulation, isLoading } = useBulkSimulation()
  const { data: parkingData } = useParkingData()
  const { data: revenueData } = useRevenueData()

  // Simulate real-time updates during simulation
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        vehiclesInProgress: prev.vehiclesInProgress + (Math.random() - 0.5) * 2,
        totalRevenue: prev.totalRevenue + Math.random() * 5,
        averageStayTime: Math.max(30, prev.averageStayTime + (Math.random() - 0.5) * 2),
        peakOccupancy: Math.max(prev.peakOccupancy, prev.vehiclesInProgress)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isSimulating])

  const handleStartSimulation = async () => {
    setIsSimulating(true)
    
    try {
      const result = await runBulkSimulation(simulationConfig)
      
      setSimulationHistory(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        config: { ...simulationConfig },
        result: result
      }])
      
      toast.success(`Simulação iniciada: ${result.vehicleCount} veículos em ${result.duration} minutos`)
      
      // Auto-stop simulation after duration
      setTimeout(() => {
        setIsSimulating(false)
        toast.success('Simulação concluída!')
      }, simulationConfig.duration * 60 * 1000)
      
    } catch (error) {
      setIsSimulating(false)
      toast.error('Erro ao iniciar simulação')
    }
  }

  const handleStopSimulation = () => {
    setIsSimulating(false)
    toast.info('Simulação interrompida')
  }

  const handleConfigChange = (key, value) => {
    setSimulationConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Chart data for simulation results
  const occupancyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: 'Ocupação Atual',
        data: [15, 12, 8, 5, 8, 15, 25, 35, 45, 55, 65, 75, 80, 85, 90, 88, 85, 80, 75, 70, 60, 45, 30, 20],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Projeção com Crescimento',
        data: Array.from({ length: 24 }, (_, i) => 
          Math.floor((30 + i * 2) * (1 + simulationConfig.growthRate))
        ),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  }

  const revenueProjectionData = {
    labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
    datasets: [
      {
        label: 'Receita Atual',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Projeção de Crescimento',
        data: [45000, 51750, 59513, 68439, 78705, 90511],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EstaparLogo showText={true} className="text-white" />
              <div className="text-white">
                <h1 className="text-2xl font-bold">Simulação de Carga</h1>
                <p className="text-green-100">Teste diferentes cenários de crescimento e otimização</p>
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
                <a href="/analytics" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  Analytics
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
              <h2 className="text-2xl font-bold text-gray-900">Simulação de Carga</h2>
              <p className="mt-2 text-gray-600">Teste diferentes cenários de crescimento e otimização</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating || isLoading}
                className="btn-success flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>Iniciar Simulação</span>
              </button>
              {isSimulating && (
                <button
                  onClick={handleStopSimulation}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Square className="h-4 w-4" />
                  <span>Parar</span>
                </button>
              )}
            </div>
          </div>

      {/* Simulation Status */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="animate-spin">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Simulação em Andamento</h3>
                  <p className="text-sm opacity-90">
                    {simulationConfig.vehicleCount} veículos • {simulationConfig.duration} minutos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Car className="h-4 w-4" />
                  <span>{realTimeMetrics.vehiclesInProgress.toFixed(0)} ativos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>R$ {realTimeMetrics.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuração da Simulação</h3>
              <p className="text-sm text-gray-600">Ajuste os parâmetros para diferentes cenários</p>
            </div>
            <PlayCircle className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="vehicleCount" className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Veículos
            </label>
            <input
              id="vehicleCount"
              type="number"
              min="1"
              max="1000"
              value={simulationConfig.vehicleCount}
              onChange={(e) => handleConfigChange('vehicleCount', parseInt(e.target.value))}
              className="input"
              disabled={isSimulating}
            />
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duração (minutos)
            </label>
            <input
              id="duration"
              type="number"
              min="30"
              max="480"
              value={simulationConfig.duration}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              className="input"
              disabled={isSimulating}
            />
          </div>
          
          <div>
            <label htmlFor="eventInterval" className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo entre Eventos (ms)
            </label>
            <select
              id="eventInterval"
              value={simulationConfig.eventInterval}
              onChange={(e) => handleConfigChange('eventInterval', parseInt(e.target.value))}
              className="select"
              disabled={isSimulating}
            >
              <option value={10000}>10 segundos</option>
              <option value={30000}>30 segundos</option>
              <option value={60000}>1 minuto</option>
              <option value={120000}>2 minutos</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="growthRate" className="block text-sm font-medium text-gray-700 mb-2">
              Taxa de Crescimento (%)
            </label>
            <input
              id="growthRate"
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={simulationConfig.growthRate}
              onChange={(e) => handleConfigChange('growthRate', parseFloat(e.target.value))}
              className="input"
              disabled={isSimulating}
            />
          </div>
        </div>
      </motion.div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Veículos em Andamento"
          value={Math.round(realTimeMetrics.vehiclesInProgress)}
          icon={Car}
          change="+12.5%"
          changeType="positive"
          color={realTimeMetrics.vehiclesInProgress > 80 ? "danger" : realTimeMetrics.vehiclesInProgress > 60 ? "warning" : "success"}
          delay={0.1}
        />
        
        <MetricCard
          title="Receita Simulada"
          value={`R$ ${realTimeMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          change="+8.3%"
          changeType="positive"
          color="primary"
          delay={0.2}
        />
        
        <MetricCard
          title="Tempo Médio de Permanência"
          value={`${Math.round(realTimeMetrics.averageStayTime)} min`}
          icon={Clock}
          change="-2.1%"
          changeType="negative"
          color="warning"
          delay={0.3}
        />
        
        <MetricCard
          title="Pico de Ocupação"
          value={`${Math.round(realTimeMetrics.peakOccupancy)}%`}
          icon={TrendingUp}
          change="+5.7%"
          changeType="positive"
          color={realTimeMetrics.peakOccupancy > 90 ? "danger" : "success"}
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Projeção de Ocupação</h3>
                <p className="text-sm text-gray-600">Cenário atual vs crescimento</p>
              </div>
              <BarChart3 className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="chart-container">
            <Line data={occupancyChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Projeção de Receita</h3>
                <p className="text-sm text-gray-600">Crescimento com taxa de {(simulationConfig.growthRate * 100).toFixed(1)}%</p>
              </div>
              <Target className="h-5 w-5 text-success-600" />
            </div>
          </div>
          <div className="chart-container">
            <Bar data={revenueProjectionData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Simulation Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cenários Pré-definidos</h3>
              <p className="text-sm text-gray-600">Teste rapidamente diferentes situações</p>
            </div>
            <Zap className="h-5 w-5 text-warning-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setSimulationConfig({
              vehicleCount: 25,
              duration: 60,
              eventInterval: 60000,
              growthRate: 0.10
            })}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            disabled={isSimulating}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-success-600" />
              <div>
                <h4 className="font-medium text-gray-900">Cenário Conservador</h4>
                <p className="text-sm text-gray-600">25 veículos • 60 min • 10% crescimento</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setSimulationConfig({
              vehicleCount: 100,
              duration: 180,
              eventInterval: 30000,
              growthRate: 0.20
            })}
            className="p-4 border border-gray-200 rounded-lg hover:border-warning-300 hover:bg-warning-50 transition-colors text-left"
            disabled={isSimulating}
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
              <div>
                <h4 className="font-medium text-gray-900">Cenário Moderado</h4>
                <p className="text-sm text-gray-600">100 veículos • 180 min • 20% crescimento</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setSimulationConfig({
              vehicleCount: 200,
              duration: 240,
              eventInterval: 15000,
              growthRate: 0.30
            })}
            className="p-4 border border-gray-200 rounded-lg hover:border-danger-300 hover:bg-danger-50 transition-colors text-left"
            disabled={isSimulating}
          >
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-danger-600" />
              <div>
                <h4 className="font-medium text-gray-900">Cenário Agressivo</h4>
                <p className="text-sm text-gray-600">200 veículos • 240 min • 30% crescimento</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <div className="card-header">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Simulações</h3>
              <p className="text-sm text-gray-600">Resultados das simulações anteriores</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veículos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crescimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {simulationHistory.map((sim) => (
                  <tr key={sim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sim.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sim.config.vehicleCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sim.config.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(sim.config.growthRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge-success">Concluída</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Simulation
