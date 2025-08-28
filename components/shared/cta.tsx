import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CtaProps {
  onGetStarted: () => void
}

export function Cta({ onGetStarted }: CtaProps) {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-background rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Elevate Your Pet Care?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet parents who are using our platform to
            provide the best possible care for their beloved companions. Get
            started today for free.
          </p>
          <Button onClick={onGetStarted} size="lg" className="text-lg">
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

