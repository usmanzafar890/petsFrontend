"use client"

import { forwardRef } from "react"
import { UserPlus, BellRing, HeartPulse } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Register Your Pet",
    description:
      "Create a comprehensive profile for your pet in minutes. Add photos, medical history, and important details.",
  },
  {
    icon: BellRing,
    title: "Set Care Reminders",
    description:
      "Schedule and receive notifications for appointments, medications, and other important events.",
  },
  {
    icon: HeartPulse,
    title: "Monitor Their Health",
    description:
      "Keep track of your pet's well-being with our easy-to-use health logging and symptom tracking features.",
  },
]

export const HowItWorks = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section ref={ref} id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Started in Three Easy Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform is designed to be intuitive and easy to use. Follow
            these simple steps to start managing your pet's care like a pro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

HowItWorks.displayName = "HowItWorks"
