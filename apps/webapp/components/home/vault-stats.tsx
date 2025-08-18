"use client"

import { ArrowUpRight, Bitcoin, Percent, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { staggerContainer, staggerItem } from "@/lib/animation-variants"

export function VaultStats() {
  const { ref: statsRef, controls: statsControls } = useScrollAnimation(0.2)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="stats" style={{ backgroundColor: '#000000' }}>
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-2">
            <motion.div 
              className="inline-block rounded-lg bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 px-3 py-1 text-sm text-black font-bold shadow-bitcoin animate-pulse"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Platform Stats
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-white via-orange-300 to-yellow-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Bitcoin Finance by the Numbers
            </motion.h2>
            <motion.p 
              className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Real-time metrics: vault performance, BTC locked, active strategies, users, and bond yields.
            </motion.p>
          </div>
        </motion.div>
        <motion.div 
          ref={statsRef}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
          initial="hidden"
          animate={statsControls}
          variants={staggerContainer}
        >
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">Vault APY</CardTitle>
                <TrendingUp className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">5.8%</div>
                <p className="text-xs text-gray-400">
                  <span className="text-green-400 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +0.3%
                  </span>{" "}
                  last 30 days
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">BTC Locked</CardTitle>
                <Bitcoin className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">127.45 BTC</div>
                <p className="text-xs text-gray-400">
                  <span className="text-green-400 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.3%
                  </span>{" "}
                  last 30 days
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">Active Strategies</CardTitle>
                <Percent className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">
                  Ekubo, Vesu, Custom
                </div>
                <p className="text-xs text-gray-400">Community and protocol strategies live</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">Users</CardTitle>
                <Bitcoin className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">4,400+</div>
                <p className="text-xs text-gray-400">Active users on Numo</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">Bond Yields</CardTitle>
                <Percent className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">Up to 8.2%</div>
                <p className="text-xs text-gray-400">Depending on lock duration</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="group p-[3px] rounded-lg animate-bitcoin-gradient hover:shadow-bitcoin-gold transition-all duration-300"
            variants={staggerItem}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
              <Card className="h-full border-orange-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-bitcoin" style={{ backgroundColor: '#0f1114' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-white">Forecasts Simulated</CardTitle>
                <Percent className="w-4 h-4 text-bitcoin transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bitcoin-gold transition-all duration-300 group-hover:scale-105">12,000+</div>
                <p className="text-xs text-gray-400">Yield simulations run by users</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
