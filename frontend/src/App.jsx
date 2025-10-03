import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import Simulation from './pages/Simulation'
import SystemMonitoring from './pages/SystemMonitoring'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
      </Routes>
    </motion.div>
  )
}

export default App
