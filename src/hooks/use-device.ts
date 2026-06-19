'use client'

import { useState, useEffect } from 'react'

interface DeviceInfo {
  isDesktop: boolean
  isMobile: boolean
  isTablet: boolean
  hasTouch: boolean
  width: number
}

export function useDevice(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isDesktop: false,
    isMobile: false,
    isTablet: false,
    hasTouch: false,
    width: 0
  })

  useEffect(() => {
    const detect = () => {
      const width = window.innerWidth
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      // ПК: широкий экран (>=1024px) ИЛИ нет тача
      // Планшет: 600-1023px
      // Мобильник: <600px ИЛИ есть тач и экран <1024
      const isDesktop = width >= 1024 && !hasTouch
      const isTablet = width >= 600 && width < 1024
      const isMobile = width < 600 || (hasTouch && width < 1024)

      setDevice({ isDesktop, isMobile, isTablet, hasTouch, width })
    }

    detect()
    window.addEventListener('resize', detect)
    return () => window.removeEventListener('resize', detect)
  }, [])

  return device
}
