"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  cta: string
  ctaLink: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  interval?: number
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
}

export function HeroCarousel({ slides, autoPlay = true, interval = 5000 }: HeroCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const currentSlide = (page % slides.length + slides.length) % slides.length

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      paginate(1)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, page])

  const nextSlide = () => {
    paginate(1)
  }

  const prevSlide = () => {
    paginate(-1)
  }

  const goToSlide = (slideIndex: number) => {
    const newDirection = slideIndex > currentSlide ? 1 : -1
    setPage([slideIndex, newDirection])
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <Link href={slides[currentSlide].ctaLink}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          // --- MODIFICATION START ---
          // Switched from a fast 'spring' to a 'tween' with a longer duration
          // for a slower, smoother slide.
          transition={{
            x: { type: "tween", ease: "easeInOut", duration: 0.8 },
            opacity: { duration: 0.5 },
          }}
          // --- MODIFICATION END ---
          className="absolute inset-0"
          >
          {/* Background Image with Next.js <Image> component */}
          <Image
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
            />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0" />
          
          {/* Content layout and styling */}
          {/* <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
            <div className="max-w-2xl">
            <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
            {slides[currentSlide].title}
            </motion.h1>
            
            <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 font-body"
            >
            {slides[currentSlide].subtitle}
            </motion.p>
            
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            >
            <Link href={slides[currentSlide].ctaLink}>
            <Button size="lg" className="btn-luxury text-white font-semibold">
            {slides[currentSlide].cta}
            </Button>
            </Link>
            </motion.div>
            </div>
            </div>
            </div> */}
        </motion.div>
      </AnimatePresence>
            </Link>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
        onClick={prevSlide}
        >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}