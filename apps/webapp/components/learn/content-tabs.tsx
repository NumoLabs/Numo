"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { DefiExplanation } from "./basics/defi-explanation"
import { KeyConcepts } from "./basics/key-concepts"
import { StarknetSection } from "./basics/starknet-section"
import { AdditionalResources } from "./additional-resources"
import { ProgressIndicator } from "./progress-indicator"
import { LearningPath } from "./learning-path"

export function ContentTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTabFromUrl = searchParams.get('tab') || 'defi'
  const [activeTab, setActiveTab] = useState(activeTabFromUrl)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  // Tab configuration
  const tabs = useMemo(() => [
    { id: 'defi', label: 'What is DeFi?' },
    { id: 'concepts', label: 'Fundamental Concepts' },
    { id: 'starknet', label: 'Starknet Ecosystem' },
    { id: 'resources', label: 'Resources' },
  ] as const, [])

  // Sync activeTab with URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'defi'
    // Validate that the tab from URL is valid
    if (tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams, tabs])

  // Handle tab change: update both state and URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const currentUrl = new URL(window.location.href)
    if (tabId === 'defi') {
      currentUrl.searchParams.delete('tab')
    } else {
      currentUrl.searchParams.set('tab', tabId)
    }
    router.replace(currentUrl.pathname + currentUrl.search, { scroll: false })
  }

  // Update indicator position when active tab changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
      if (activeIndex === -1 || !tabRefs.current[activeIndex]) return

      const activeButton = tabRefs.current[activeIndex]
      if (!activeButton) return

      const container = activeButton.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      })
    }

    // Initial update
    updateIndicator()

    // Update on resize
    window.addEventListener('resize', updateIndicator)
    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeTab, tabs])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Pill Nav */}
      <div className="relative w-full">
        <div className="grid grid-cols-2 md:flex md:items-center gap-1.5 md:gap-1.5 p-1.5 md:p-1.5 bg-muted/50 rounded-lg md:rounded-full border border-border/50 backdrop-blur-sm">
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
                  relative z-10 px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium rounded-lg md:rounded-full transition-colors duration-200 text-center
                  ${isActive 
                    ? 'text-bitcoin-orange bg-background border border-bitcoin-orange/30 shadow-md shadow-bitcoin-orange/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }
                `}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 md:mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'defi' && (
            <motion.div
              key="defi-tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <ProgressIndicator />
              <LearningPath />
              <DefiExplanation />
            </motion.div>
          )}

          {activeTab === 'concepts' && (
            <motion.div
              key="concepts-tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <KeyConcepts />
            </motion.div>
          )}

          {activeTab === 'starknet' && (
            <motion.div
              key="starknet-tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <StarknetSection />
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources-tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <AdditionalResources />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
