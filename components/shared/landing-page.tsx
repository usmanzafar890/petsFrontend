"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Cta } from "./cta"
import { FAQ } from "./faq"
import { Features } from "./features"
import { Hero } from "./hero"
import { HowItWorks } from "./how-it-works"
import { Testimonials } from "./testimonials"

export function LandingPage() {
  const router = useRouter()
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  const handleScrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 text-gray-800">
      <Hero
        onGetStarted={handleGetStarted}
        onSeeHowItWorks={handleScrollToHowItWorks}
      />
      <Features />
      <HowItWorks ref={howItWorksRef} />
      <Testimonials />
      <FAQ />
      <Cta onGetStarted={handleGetStarted} />
    </div>
  )
}
