import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  DollarSign,
  BarChart3,
  PlayCircle,
  Menu,
  X,
  Car,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import EstaparLogo from './EstaparLogo'
import Footer from './Footer'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Faturamento', href: '/revenue', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Simulação', href: '/simulation', icon: PlayCircle },
  { name: 'Monitoramento', href: '/monitoring', icon: Activity },
]

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <EstaparLogo showText={true} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sistema</p>
                <p className="text-xs text-gray-500">Versão 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - Mobile only */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Tempo real</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-400 px-4 py-6 sm:px-6 lg:px-8 shadow-lg">
          <div className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <EstaparLogo showText={true} className="text-white" />
                <div className="text-white">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {location.pathname === '/' && 'Dashboard Executivo'}
                    {location.pathname === '/revenue' && 'Relatório de Faturamento'}
                    {location.pathname === '/analytics' && 'Analytics'}
                    {location.pathname === '/simulation' && 'Simulação'}
                    {location.pathname === '/monitoring' && 'Monitoramento do Sistema'}
                  </h1>
                  <p className="text-sm sm:text-base text-green-100">
                    {location.pathname === '/' && 'Sistema de Gerenciamento de Estacionamentos'}
                    {location.pathname === '/revenue' && 'Análise detalhada de receitas e tendências'}
                    {location.pathname === '/analytics' && 'Análise de dados e insights'}
                    {location.pathname === '/simulation' && 'Simulação de eventos de estacionamento'}
                    {location.pathname === '/monitoring' && 'Métricas de saúde e performance em tempo real'}
                  </p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                
                {/* Status info - Desktop only */}
                <div className="hidden lg:block text-right text-white">
                  <div className="text-sm text-green-100">Tempo real</div>
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Layout
