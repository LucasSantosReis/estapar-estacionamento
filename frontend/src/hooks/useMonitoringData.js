import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api'

export const useMonitoringData = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Buscar dados do dashboard de monitoramento
      const dashboardResponse = await axios.get(`${API_BASE_URL}/monitoring/dashboard`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Buscar dados de saúde do sistema
      const healthResponse = await axios.get(`${API_BASE_URL}/actuator/health`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Buscar dados detalhados de saúde
      const detailedHealthResponse = await axios.get(`${API_BASE_URL}/monitoring/health`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      setData({
        dashboard: dashboardResponse.data,
        health: healthResponse.data,
        detailedHealth: detailedHealthResponse.data
      })
    } catch (err) {
      console.error('Erro ao buscar dados de monitoramento:', err)
      
      // Tratar diferentes tipos de erro
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3003.')
      } else if (err.response?.status === 404) {
        setError('Endpoint não encontrado. Verifique se a aplicação está configurada corretamente.')
      } else if (err.response?.status >= 500) {
        setError('Erro interno do servidor. Tente novamente em alguns instantes.')
      } else {
        setError(err.message || 'Erro desconhecido ao carregar dados.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}
