import { useQuery } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = '/api'

const fetchRevenueData = async (date, sector) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/revenue`, {
      date: date || new Date().toISOString().split('T')[0],
      sector: sector || 'A'
    })
    return response.data
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    throw error
  }
}

export const useRevenueData = (date, sector) => {
  return useQuery(
    ['revenue', date, sector],
    () => fetchRevenueData(date, sector),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      refetchOnWindowFocus: true,
      onError: (error) => {
        toast.error('Erro ao carregar dados de receita')
        console.error('Revenue data error:', error)
      },
      retry: (failureCount, error) => {
        if (error.response?.status === 404) {
          return false // Don't retry on 404
        }
        return failureCount < 3
      }
    }
  )
}

export const useRevenueHistory = (startDate, endDate, sector) => {
  return useQuery(
    ['revenue-history', startDate, endDate, sector],
    async () => {
      // Simulate historical data since we don't have this endpoint yet
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      const history = []
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        
        const baseRevenue = 1000 + Math.random() * 2000
        const weekendMultiplier = [0, 6].includes(date.getDay()) ? 0.7 : 1
        const revenue = Math.round(baseRevenue * weekendMultiplier * 100) / 100
        
        history.push({
          date: date.toISOString().split('T')[0],
          amount: revenue,
          currency: 'BRL',
          sector: sector || 'A'
        })
      }
      
      return history
    },
    {
      enabled: !!startDate && !!endDate,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useRevenueProjection = (currentData, growthRate = 0.15) => {
  return useQuery(
    ['revenue-projection', currentData, growthRate],
    () => {
      if (!currentData) return []
      
      const projections = []
      const baseAmount = currentData.amount || 0
      
      for (let month = 1; month <= 12; month++) {
        const projectedAmount = baseAmount * Math.pow(1 + growthRate, month)
        projections.push({
          month: month,
          amount: Math.round(projectedAmount * 100) / 100,
          currency: 'BRL'
        })
      }
      
      return projections
    },
    {
      enabled: !!currentData,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}
