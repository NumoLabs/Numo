"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ForecastHero from "./forecast-hero"
import YieldSimulator from "./yield-simulator"
import PerformanceChart from "./performance-chart"
import InsightsDashboard from "./insights-dashboard"

export function ForecastContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTabFromUrl = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(activeTabFromUrl)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  // Tab configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'yield-simulator', label: 'Yield Simulator' },
    { id: 'performance', label: 'Performance' },
    { id: 'insights', label: 'Insights' },
  ] as const, [])

  // Sync activeTab with URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'overview'
    // Validate that the tab from URL is valid
    if (tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams, tabs])

  // Handle tab change: update both state and URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const currentUrl = new URL(window.location.href)
    if (tabId === 'overview') {
      currentUrl.searchParams.delete('tab')
    } else {
      currentUrl.searchParams.set('tab', tabId)
    }
    router.replace(currentUrl.pathname + currentUrl.search, { scroll: false })
  }

  // Update indicator position when active tab changes
  useEffect(() => {
    const updateIndicator = () => {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const activeIndex = tabs.findIndex(t => t.id === activeTab)
        const activeButton = tabRefs.current[activeIndex]
        const container = activeButton?.parentElement

        if (activeButton && container) {
          const containerRect = container.getBoundingClientRect()
          const buttonRect = activeButton.getBoundingClientRect()

          setIndicatorStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
          })
        }
      })
    }

    // Small delay to ensure buttons are rendered
    const timeoutId = setTimeout(updateIndicator, 0)

    // Update on window resize
    window.addEventListener('resize', updateIndicator)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeTab, tabs])

  return (
    <div className="space-y-6">
      {/* Hero Section - Always visible */}
      <ForecastHero />

      {/* Pill Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Pill Nav */}
        <div className="relative w-full overflow-x-auto">
          <div className="relative inline-flex items-center gap-1 p-1 sm:p-1.5 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm min-w-max sm:min-w-0">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={`tab-button-${tab.id}`}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative z-10 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0
                    ${isActive 
                      ? 'text-bitcoin-orange' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {tab.label}
                </button>
              )
            })}
            {/* Active indicator pill */}
            {indicatorStyle.width > 0 && (
              <motion.div
                className="absolute top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 bg-background border border-bitcoin-orange/30 rounded-full shadow-lg shadow-bitcoin-orange/10 z-0"
                initial={false}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'overview' && (
              <motion.div
                key="overview-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-bitcoin-orange mb-4">Forecasting Overview</h2>
                    <p className="text-lg text-gray-600">
                      Explore BTC forecasting tools to compare strategies, simulate potential gains, and analyze performance insights.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Yield Simulator</h3>
                      <p className="text-sm text-gray-300">
                        Calculate potential returns across different BTC strategies with customizable parameters.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Performance Charts</h3>
                      <p className="text-sm text-gray-300">
                        Visual comparison of vault vs HODL strategies with historical projections.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Smart Insights</h3>
                      <p className="text-sm text-gray-300">
                        AI-powered analytics and optimization recommendations for your vault strategy.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'yield-simulator' && (
              <motion.div
                key="yield-simulator-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-bitcoin-orange mb-4">Yield Simulator</h2>
                    <p className="text-lg text-gray-600">
                      Calculate and compare potential returns across different BTC strategies
                    </p>
                  </div>
                  <YieldSimulator />
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-bitcoin-orange mb-4">Performance Charts</h2>
                    <p className="text-lg text-gray-600">Compare how different strategies have performed over time</p>
                  </div>
                  <PerformanceChart />
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-bitcoin-orange mb-4">Analytics & Insights</h2>
                    <p className="text-lg text-gray-600">Deep dive into performance metrics and optimization recommendations</p>
                  </div>
                  <InsightsDashboard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
