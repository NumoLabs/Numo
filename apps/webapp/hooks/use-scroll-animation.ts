"use client"

import { useEffect, useRef } from "react"
import { useInView, useAnimation } from "framer-motion"

export function useScrollAnimation(threshold = 0.1, once = true) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: threshold, once })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return { ref, controls, isInView }
}

export function useStaggeredAnimation(threshold = 0.1, once = true) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: threshold, once })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return { ref, controls, isInView }
}

export function useParallaxAnimation(speed = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      if (!isInView) return
      
      const rect = element.getBoundingClientRect()
      const scrolled = window.scrollY
      const parallax = scrolled * speed
      
      element.style.transform = `translateY(${parallax}px)`
    }

    if (isInView) {
      window.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isInView, speed])

  return ref
} 