import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  DollarSign, 
  BarChart3, 
  PlayCircle,
  Activity
} from 'lucide-react'
import EstaparLogo from './EstaparLogo'

const PageHeader = ({ title, subtitle, children }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Faturamento', href: '/revenue', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Simulação', href: '/simulation', icon: PlayCircle },
    { name: 'Monitoramento', href: '/monitoring', icon: Activity },
  ]

  return (
    <div className="space-y-6">
      {/* Estapar Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <EstaparLogo showText={true} className="text-white" />
            <div className="text-white">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-green-100">{subtitle}</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-white hover:text-green-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon className="h-4 w-4 inline mr-1" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
            
            {/* Botão de Monitoramento Destacado */}
            <Link
              to="/monitoring"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                location.pathname === '/monitoring'
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-white hover:text-green-600 hover:shadow-lg'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Sistema</span>
            </Link>
            
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>
        {children && (
          <div className="mt-4 sm:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
