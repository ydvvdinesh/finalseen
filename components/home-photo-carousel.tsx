"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

const carouselImages = [
  "/images/slideshow/auditorium-stage.png",
  "/images/slideshow/slide-1.jpg",
  "/images/slideshow/slide-2.jpg",
  "/images/slideshow/slide-3.jpg",
  "/images/slideshow/slide-4.jpg",
  "/images/slideshow/slide-5.jpg",
  "/images/CodeNeuraX.webp",
  "/images/Founder - CNX -1.webp",
  "/images/From the backstage.webp",
  "/images/Founder - CNX -2.webp",
  "/images/Career Guidance by sonu yadav.webp",
  "/images/mam with cnxx.webp",
  "/images/conxx-team.webp",
  "/images/Thanking Founder.webp",
]

export default function HomePhotoCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <div className="relative h-96 sm:h-[26rem] rounded-2xl overflow-hidden glass-card p-1">
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="h-96 sm:h-[26rem]">
          {carouselImages.map((image, index) => (
            <CarouselItem key={index} className="relative h-96 sm:h-[26rem]">
              <Image
                src={image}
                alt={`CodeNeuraX Community photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-xl"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 bg-black/50 border-white/10 hover:bg-black/80 text-white" />
        <CarouselNext className="right-3 bg-black/50 border-white/10 hover:bg-black/80 text-white" />
      </Carousel>
    </div>
  )
}
