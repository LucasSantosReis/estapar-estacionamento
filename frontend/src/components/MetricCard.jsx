import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral', 
  color = 'primary',
  delay = 0 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      border: 'border-primary-200'
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success-600',
      border: 'border-success-200'
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-600',
      border: 'border-warning-200'
    },
    danger: {
      bg: 'bg-danger-50',
      icon: 'text-danger-600',
      border: 'border-danger-200'
    }
  }

  const changeClasses = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-gray-600'
  }

  const colors = colorClasses[color] || colorClasses.primary

  return (
    <motion.div
      data-testid="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`metric-card ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="metric-label">{title}</p>
          <p className={`metric-value mt-1 ${colors.icon}`}>{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${changeClasses[changeType]}`}>
              {changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : null}
              <span className="text-xs font-medium">{change}</span>
              <span className="text-xs ml-1">vs ontem</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  )
}

export default MetricCard
