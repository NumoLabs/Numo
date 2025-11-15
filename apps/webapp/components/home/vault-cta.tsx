"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Sparkles, Star } from "lucide-react"
import { motion } from "framer-motion"
import { CavosAuthModal } from "../ui/cavos-auth-modal"
import { Button } from "../ui/button"

export function VaultCTA() {
  const [userCount, setUserCount] = useState<number | null>(null)

  // Fetch real user count from Supabase via API route
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/users/count')
        if (!response.ok) {
          console.error('Failed to fetch user count')
          return
        }
        
        const data = await response.json()
        if (data.count !== undefined) {
          setUserCount(data.count)
        }
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    }

    fetchUserCount()
  }, [])

  return (
    <section id="waitlist" className="w-full py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl" />
        <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-orange-400/10 rounded-full blur-xl" />
      </motion.div>

      <div className="container px-4 md:px-6 flex flex-col items-center relative z-10">
        <div className="max-w-2xl w-full mx-auto">
          <motion.div 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="inline-block rounded-lg bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 px-2 sm:px-3 py-1 text-xs sm:text-sm text-black font-bold shadow-bitcoin mb-4 md:mb-6">
              Limited Beta Access
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-white via-orange-300 to-yellow-400 bg-clip-text text-transparent px-2">
              Join the Future of BTC DeFi
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto px-2">
              Be among the first to experience modular Bitcoin finance on Starknet. Get exclusive early access to our
              beta platform.
            </p>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-3xl blur-sm opacity-60"></div>

            <div className="relative bg-black/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-orange-500/30 p-4 sm:p-5 md:p-6 flex flex-col gap-4 md:gap-6">
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <CavosAuthModal
                  trigger={
                    <Button
                      size={undefined}
                      className="!h-auto group relative w-80 overflow-hidden font-bold rounded-lg !py-2 !px-4 mr-11 text-base shadow-xl transition-all transform focus:outline-none focus:ring-4 focus:ring-orange-500/50 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 text-black shadow-bitcoin hover:-translate-y-1 hover:shadow-bitcoin-gold animate-bitcoin-pulse"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Join to Numo
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  }
                />

                <div className="text-center sm:text-left w-full sm:w-auto">
                  <div className="text-xs sm:text-sm text-gray-400">
                    <span className="font-semibold text-green-400">
                      {userCount !== null ? userCount.toLocaleString() : '...'}
                    </span> already joined
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-[10px] sm:text-xs text-gray-400 ml-1">Trusted by users</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Benefits section */}
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold text-white mb-2">Early Access</h3>
              <p className="text-sm text-gray-300">
                Be the first to try new features and strategies
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Star className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold text-white mb-2">Exclusive Rewards</h3>
              <p className="text-sm text-gray-300">
                Special bonuses and higher yields for beta users
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold text-white mb-2">Priority Support</h3>
              <p className="text-sm text-gray-300">Direct access to our team and community</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}