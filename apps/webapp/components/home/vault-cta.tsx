"use client"

import { useState } from "react"
import { Mail, User, CheckCircle2, Sparkles, ArrowRight, Star } from "lucide-react"

export function VaultCTA() {
  const [status, setStatus] = useState("")

  return (
    <section className="w-full py-12 md:py-20 bg-gray-100 dark:bg-gray-900/20 relative overflow-hidden">
      {/* Background decorative elements */}

      <div className="container px-4 md:px-6 flex flex-col items-center relative z-10">
        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse mb-6">
              Limited Beta Access
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
              Join the Future of BTC DeFi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
              Be among the first to experience modular Bitcoin finance on Starknet. Get exclusive early access to our
              beta platform.
            </p>
          </div>

          <div className="relative">
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-sm opacity-75 animate-gradient-x"></div>

            <form
              className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 md:p-6 flex flex-col gap-6"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const email = form.email.value.trim()
                const handle = form.handle.value.trim()
                if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                  setStatus("Please enter a valid email.")
                  return
                }
                setStatus("Submitting...")
                setTimeout(() => setStatus("You are on the whitelist! 🚀"), 1200)
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 pl-12 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 group-focus-within:border-blue-500"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 transition-transform group-focus-within:scale-110" />
                  </div>
                </div>
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Social Handle
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="handle"
                      placeholder="@username (Twitter/X)"
                      className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 pl-12 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400 group-focus-within:border-purple-500"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 transition-transform group-focus-within:scale-110" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  className="group relative w-full sm:flex-1 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl py-4 px-8 text-lg shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 bg-size-200 hover:bg-pos-100 animate-gradient-x"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Join Beta Waitlist
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <div className="text-center sm:text-left">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-green-600 dark:text-green-400">2,847</span> already joined
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Trusted by users</span>
                  </div>
                </div>
              </div>

              {status && (
                <div className="flex items-center justify-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 animate-fade-in">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 animate-bounce-in" />
                  <span className="text-green-700 dark:text-green-300 font-medium text-lg">{status}</span>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By joining, you agree to receive updates about Numo. Unsubscribe anytime.
                </p>
              </div>
            </form>
          </div>

          {/* Benefits section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Early Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Be the first to try new features and strategies
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Exclusive Rewards</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Special bonuses and higher yields for beta users
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Priority Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Direct access to our team and community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
