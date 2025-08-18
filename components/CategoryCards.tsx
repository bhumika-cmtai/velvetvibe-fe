"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CategoryCardProps {
  title: string
  description: string
  image: string
  href: string
  index: number
}

function CategoryCard({ title, description, image, href, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      <Link href={href}>
        <div className="relative h-80 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 opacity-0"
            style={{
              background: `linear-gradient(135deg, var(--theme-primary), transparent)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <motion.h3 whileHover={{ x: 10 }} className="text-2xl font-serif font-bold mb-2">
              {title}
            </motion.h3>
            <p className="text-white/90 mb-4">{description}</p>
            <Button
              variant="secondary"
              className="w-fit bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface CategoryCardsProps {
  gender: "women" | "men"
}

export function CategoryCards({ gender }: CategoryCardsProps) {
  const categories = [
    {
      title: "Silver Jewellery",
      description: "Elegant sterling silver pieces for every occasion",
      image: "/silver-women-necklace.jpg",
      href: `/collections/${gender}?category=silver`,
    },
    {
      title: "Artificial Jewellery",
      description: "Trendy and affordable fashion jewelry",
      image: "/artificial-women-earing.jpg",
      href: `/collections/${gender}?category=artificial`,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {categories.map((category, index) => (
        <CategoryCard key={category.title} {...category} index={index} />
      ))}
    </div>
  )
}
