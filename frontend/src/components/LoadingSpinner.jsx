import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'large', message = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        data-testid="loading-spinner"
        className={`loading-spinner ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-gray-600"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner
