"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  variant?: "default" | "bitcoin" | "minimal"
  className?: string
}

export function SectionDivider({ variant = "default", className = "" }: SectionDividerProps) {
  const variants = {
    default: (
      <div className={`w-full py-8 md:py-12 ${className}`}>
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <motion.div 
              className="mx-4 w-2 h-2 bg-orange-500 rounded-full"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            ></motion.div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    ),
    bitcoin: (
      <div className={`w-full py-12 md:py-16 ${className}`}>
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-8 h-px bg-gradient-to-r from-transparent to-orange-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              ></motion.div>
              <motion.div 
                className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center animate-bitcoin-pulse"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
                viewport={{ once: true }}
              >
                <span className="text-black text-xs font-bold">₿</span>
              </motion.div>
              <motion.div 
                className="w-8 h-px bg-gradient-to-l from-transparent to-orange-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    minimal: (
      <div className={`w-full py-6 md:py-8 ${className}`}>
        <div className="container px-4 md:px-6">
          <motion.div 
            className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.3 }}
          ></motion.div>
        </div>
      </div>
    )
  }

  return variants[variant]
}
