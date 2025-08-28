import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface HeroProps {
  onGetStarted: () => void
  onSeeHowItWorks: () => void
}

export function Hero({ onGetStarted, onSeeHowItWorks }: HeroProps) {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white py-12 lg:py-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-orange-300 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-amber-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-200 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-medium mb-6 animate-pulse">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              {t('hero.title')}
              <span className="block text-orange-600 mt-2">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
              {t('hero.description')}
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <Heart className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">{t('hero.healthTracking')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">{t('hero.smartReminders')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">{t('hero.vetRecords')}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={onGetStarted} size="lg" className="text-lg bg-orange-600 hover:bg-orange-700">
                {t('hero.getStarted')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={onSeeHowItWorks}
                variant="outline"
                size="lg"
                className="text-lg border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                {t('hero.learnMore')}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t('hero.noCredit')}
            </p>
          </div>
          
          <div className="relative">
            {/* Main image */}
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                alt="Happy dog with owner"
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white rounded-lg shadow-xl p-3 transform rotate-3 hidden md:block">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                  alt="Cute dog"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-lg shadow-xl p-3 transform -rotate-6 hidden md:block">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1686&q=80"
                  alt="Cute cat"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            
            {/* Stats badge */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-20">
              <p className="text-xs text-gray-500 font-medium">{t('hero.trustedBy')}</p>
              <p className="text-2xl font-bold text-orange-600">10,000+</p>
              <p className="text-xs text-gray-500 font-medium">{t('hero.petOwners')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

