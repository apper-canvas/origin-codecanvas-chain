import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="FileQuestion" className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-200 mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">Page not found</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ApperIcon name="Home" className="w-4 h-4" />
          Go Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound