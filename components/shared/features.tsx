"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Calendar, Shield, MapPin, Activity, Share2, Check } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const featuresData = [
  {
    icon: Heart,
    title: "Complete Pet Profile",
    description:
      "A single place for all the important information about your pet, from medical history to dietary needs.",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Medical records", "Diet tracking", "Breed information", "Growth charts"]
  },
  {
    icon: Calendar,
    title: "Care Reminders",
    description:
      "Set up reminders for everything: vet appointments, medications, vaccinations, and more.",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Never miss appointments", "Medication schedules", "Grooming reminders", "Custom alerts"]
  },
  {
    icon: Shield,
    title: "Medical History",
    description:
      "Keep a detailed log of every medical event, including deworming, cleanings, and surgeries.",
    image: "https://images.unsplash.com/photo-1584553421349-3557471bed79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Vaccination records", "Treatment history", "Medication logs", "Health trends"]
  },
  {
    icon: Activity,
    title: "Symptom Tracking",
    description:
      "Monitor your pet's health by logging symptoms and sharing the data with your veterinarian.",
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Early detection", "Health patterns", "Vet communication", "Wellness monitoring"]
  },
  {
    icon: MapPin,
    title: "Find Professionals",
    description:
      "Quickly locate nearby veterinarians, groomers, and other pet care professionals when you need them.",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Verified providers", "Emergency services", "User reviews", "Direct booking"]
  },
  {
    icon: Share2,
    title: "Share Information",
    description:
      "Easily share your pet's information with family members, caregivers, or veterinarians.",
    image: "https://images.unsplash.com/photo-1549221987-25a490f65d34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    benefits: ["Family access", "Vet sharing", "Pet sitter info", "Emergency contacts"]
  },
]

export function Features() {
  const { t } = useLanguage();
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm mb-4">
            {t('features.title') || 'POWERFUL FEATURES'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.heading') || 'A Feature for Every Pet Need'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('features.description') || 'Our platform is packed with powerful features to help you provide the best possible care for your pets. From health records to reminders, we\'ve got you covered.'}
          </p>
        </div>

        {/* Featured highlight */}
        <div className="mb-20 bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-6">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Pet Health Records</h3>
              <p className="text-gray-600 mb-6">
                Keep all your pet's medical information in one secure place. Track vaccinations, 
                medications, surgeries, and regular check-ups. Share records instantly with veterinarians 
                during emergencies or routine visits.
              </p>
              <ul className="space-y-3 mb-8">
                {['Digital vaccination cards', 'Medication history', 'Growth charts', 'Lab results storage'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 md:h-full">
              <Image 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
                alt="Pet health records"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <Card key={index} className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={feature.image} 
                  alt={feature.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">
                  {feature.title === "Complete Pet Profile" ? t('features.petProfile.title') || feature.title : 
                   feature.title === "Care Reminders" ? t('features.careReminders.title') || feature.title : 
                   feature.title === "Medical History" ? t('features.medicalHistory.title') || feature.title : 
                   feature.title === "Symptom Tracking" ? t('features.symptomTracking.title') || feature.title : 
                   feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {feature.title === "Complete Pet Profile" ? t('features.petProfile.description') || feature.description : 
                   feature.title === "Care Reminders" ? t('features.careReminders.description') || feature.description : 
                   feature.title === "Medical History" ? t('features.medicalHistory.description') || feature.description : 
                   feature.title === "Symptom Tracking" ? t('features.symptomTracking.description') || feature.description : 
                   feature.description}
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center">
                        <Check className="h-3 w-3 text-orange-500 mr-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

