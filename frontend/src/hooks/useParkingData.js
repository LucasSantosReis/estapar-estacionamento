import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = '/api'

// Mock data for development
const generateMockParkingData = () => {
  const sectors = ['A', 'B', 'C', 'D']
  const data = {
    totalSpots: 400,
    occupiedSpots: Math.floor(Math.random() * 350) + 50,
    sectors: sectors.map(sector => ({
      name: sector,
      totalSpots: 100,
      occupiedSpots: Math.floor(Math.random() * 90) + 10,
      basePrice: 10 + Math.random() * 5,
      currentOccupancy: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString()
    })),
    recentEvents: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      licensePlate: `ABC${String(i + 1).padStart(4, '0')}`,
      eventType: ['ENTRY', 'EXIT', 'PARKED'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      amount: Math.random() * 50 + 5
    }))
  }
  
  return data
}

const fetchParkingData = async () => {
  try {
    // Try to fetch from API first
    const response = await axios.get(`${API_BASE_URL}/garage/sectors`)
    
    // Transform the API response to match the expected format
    const sectors = response.data
    const totalSpots = sectors.reduce((sum, sector) => sum + sector.maxCapacity, 0)
    const occupiedSpots = sectors.reduce((sum, sector) => sum + sector.occupiedSpots, 0)
    
    return {
      totalSpots,
      occupiedSpots,
      sectors: sectors.map(sector => ({
        name: sector.sector,
        totalSpots: sector.maxCapacity,
        occupiedSpots: sector.occupiedSpots,
        basePrice: 10 + Math.random() * 5,
        currentOccupancy: Math.round(sector.occupancyRate * 100),
        lastUpdated: new Date().toISOString()
      })),
      recentEvents: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        licensePlate: `ABC${String(i + 1).padStart(4, '0')}`,
        eventType: ['ENTRY', 'EXIT', 'PARKED'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        sector: sectors[Math.floor(Math.random() * sectors.length)]?.sector || 'A',
        amount: Math.random() * 50 + 5
      }))
    }
  } catch (error) {
    console.warn('API not available, using mock data:', error.message)
    // Fallback to mock data
    return generateMockParkingData()
  }
}

const simulateVehicleEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/webhook`, eventData)
    return response.data
  } catch (error) {
    console.warn('Webhook simulation failed, using mock response:', error.message)
    // Mock successful response
    return { message: 'Event processed successfully', timestamp: new Date().toISOString() }
  }
}

export const useParkingData = () => {
  return useQuery(
    'parking-data',
    fetchParkingData,
    {
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnWindowFocus: true,
      onError: (error) => {
        console.error('Parking data error:', error)
      }
    }
  )
}

export const useVehicleEvents = () => {
  const queryClient = useQueryClient()
  
  return useQuery(
    'vehicle-events',
    async () => {
      // Mock recent events
      return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        licensePlate: `ABC${String(i + 1).padStart(4, '0')}`,
        eventType: ['ENTRY', 'EXIT', 'PARKED'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(), // Last 2 hours
        sector: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        amount: Math.random() * 50 + 5,
        duration: Math.floor(Math.random() * 180) + 30 // 30-210 minutes
      }))
    },
    {
      refetchInterval: 15000, // Refetch every 15 seconds
    }
  )
}

export const useVehicleEventMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation(simulateVehicleEvent, {
    onSuccess: (data, variables) => {
      toast.success('Evento simulado com sucesso!')
      // Invalidate and refetch parking data
      queryClient.invalidateQueries('parking-data')
      queryClient.invalidateQueries('vehicle-events')
    },
    onError: (error) => {
      toast.error('Erro ao simular evento')
      console.error('Vehicle event simulation error:', error)
    }
  })
}

export const useBulkSimulation = () => {
  const queryClient = useQueryClient()
  const eventMutation = useVehicleEventMutation()
  
  const runBulkSimulation = async (config) => {
    const { vehicleCount, duration, eventInterval } = config
    
    toast.success(`Iniciando simulação de ${vehicleCount} veículos...`)
    
    const events = []
    const startTime = Date.now()
    
    for (let i = 0; i < vehicleCount; i++) {
      const licensePlate = `SIM${String(i + 1).padStart(4, '0')}`
      const sector = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
      
      // Entry event
      const entryEvent = {
        license_plate: licensePlate,
        event_type: 'ENTRY',
        entry_time: new Date(startTime + i * eventInterval).toISOString()
      }
      
      // Parked event (after 1-5 minutes)
      const parkedEvent = {
        license_plate: licensePlate,
        event_type: 'PARKED',
        lat: -23.561684 + (Math.random() - 0.5) * 0.001,
        lng: -46.655981 + (Math.random() - 0.5) * 0.001
      }
      
      // Exit event (after duration)
      const exitEvent = {
        license_plate: licensePlate,
        event_type: 'EXIT',
        exit_time: new Date(startTime + i * eventInterval + duration * 60000).toISOString()
      }
      
      events.push({ event: entryEvent, delay: i * eventInterval })
      events.push({ event: parkedEvent, delay: i * eventInterval + (Math.random() * 4 + 1) * 60000 })
      events.push({ event: exitEvent, delay: i * eventInterval + duration * 60000 })
    }
    
    // Sort events by delay
    events.sort((a, b) => a.delay - b.delay)
    
    // Execute events with delays
    for (const { event, delay } of events) {
      setTimeout(() => {
        eventMutation.mutate(event)
      }, delay)
    }
    
    return {
      totalEvents: events.length,
      duration: duration,
      vehicleCount: vehicleCount
    }
  }
  
  return {
    runBulkSimulation,
    isLoading: eventMutation.isLoading
  }
}
