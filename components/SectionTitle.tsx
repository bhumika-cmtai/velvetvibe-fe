"use client"

import { motion } from "framer-motion"

interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`text-center ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: "var(--theme-primary)" }}>
        {title}
      </h2>
      {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 60 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="h-0.5 mx-auto mt-4"
        style={{ backgroundColor: "var(--theme-primary)" }}
      />
    </motion.div>
  )
}
