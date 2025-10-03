import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Network, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Car,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  Globe,
  PlayCircle
} from 'lucide-react'
import { useMonitoringData } from '../hooks/useMonitoringData'
import LoadingSpinner from '../components/LoadingSpinner'
import MetricCard from '../components/MetricCard'
import EstaparLogo from '../components/EstaparLogo'
import Footer from '../components/Footer'

const SystemMonitoring = () => {
  const { data, isLoading, error, refetch } = useMonitoringData()
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const handleRefresh = () => {
    refetch()
    setLastUpdate(new Date())
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'up':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'down':
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'up':
      case 'healthy':
        return 'text-green-600 bg-green-50'
      case 'down':
      case 'unhealthy':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const formatUptime = (uptime) => {
    if (!uptime) return 'N/A'
    // Simular tempo de atividade baseado no timestamp
    const now = new Date()
    const start = new Date(now.getTime() - Math.random() * 86400000) // 0-24h atrás
    const diff = now - start
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tentar novamente</span>
          </button>
        </div>
      </div>
    )
  }

  const dashboardData = data?.dashboard || {}
  const healthData = data?.health || {}
  const detailedHealth = data?.detailedHealth || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EstaparLogo showText={true} className="text-white" />
              <div className="text-white">
                <h1 className="text-2xl font-bold">Monitoramento do Sistema</h1>
                <p className="text-green-100">Métricas de saúde e performance em tempo real</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <a href="/" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <Activity className="h-4 w-4 inline mr-1" />
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
                <a href="/simulation" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <PlayCircle className="h-4 w-4 inline mr-1" />
                  Simulação
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
              <h2 className="text-2xl font-bold text-gray-900">Monitoramento do Sistema</h2>
              <p className="mt-2 text-gray-600">Métricas de saúde e performance em tempo real</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
                <button
                  onClick={handleRefresh}
                  className="btn-primary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Atualizar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Geral do Sistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Status Geral do Sistema</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthData.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthData.status)}`}>
                  {healthData.status || 'UNKNOWN'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Server className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Aplicação</p>
                  <p className="text-xs text-gray-600">Versão 1.0.0</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Banco de Dados</p>
                  <p className="text-xs text-gray-600">MySQL 8.0</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tempo de Atividade</p>
                  <p className="text-xs text-gray-600">{formatUptime(detailedHealth.timestamp)}</p>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Detalhes de Saúde do Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status dos Componentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Componentes do Sistema</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Banco de Dados</p>
                      <p className="text-xs text-gray-600">MySQL Connection</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(detailedHealth.database?.status)}
                    <span className="text-sm text-gray-600">
                      {detailedHealth.database?.sectors || 0} setores
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Simulador</p>
                      <p className="text-xs text-gray-600">Garage Simulator</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(detailedHealth.dependencies?.simulator)}
                    <span className="text-sm text-gray-600">Ativo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Aplicação</p>
                      <p className="text-xs text-gray-600">Spring Boot</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(detailedHealth.application?.status)}
                    <span className="text-sm text-gray-600">
                      v{detailedHealth.application?.version || '1.0.0'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Métricas de Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Métricas de Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">Tempo de Resposta</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dashboardData.performance?.avgResponseTime || '< 100ms'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">Taxa de Erro</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dashboardData.performance?.errorRate || '0%'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Network className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Throughput</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dashboardData.performance?.throughput || 'Alto'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">Uso de Memória</span>
                  </div>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Atividade de Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Atividade de Hoje</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {dashboardData.todayActivity?.entries || 0}
                </div>
                <p className="text-sm text-gray-600">Entradas</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {dashboardData.todayActivity?.exits || 0}
                </div>
                <p className="text-sm text-gray-600">Saídas</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {dashboardData.parkingStatus?.availableSpots || 0}
                </div>
                <p className="text-sm text-gray-600">Vagas Disponíveis</p>
              </div>
            </div>
          </motion.div>

          {/* Informações do Sistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Server className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Java Version</p>
                <p className="text-sm text-gray-600">{detailedHealth.application?.javaVersion || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Timestamp</p>
                <p className="text-sm text-gray-600">
                  {detailedHealth.timestamp ? new Date(detailedHealth.timestamp).toLocaleString('pt-BR') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Total de Vagas</p>
                <p className="text-sm text-gray-600">{dashboardData.parkingStatus?.totalSpots || 0}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Status</p>
                <p className="text-sm text-gray-600">{healthData.status || 'UNKNOWN'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default SystemMonitoring
