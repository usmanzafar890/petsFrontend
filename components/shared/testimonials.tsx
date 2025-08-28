import Image from "next/image"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Dog Owner",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    petImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    petName: "Max",
    petType: "Golden Retriever",
    rating: 5,
    content:
      "This platform has been a game-changer for managing my dog's health. The medication reminders alone have saved me so much stress! I've been able to track Max's allergies and share the data with our vet, which helped us find the right treatment much faster.",
  },
  {
    name: "Michael Chen",
    role: "Cat Owner",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    petImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1686&q=80",
    petName: "Luna",
    petType: "Siamese Cat",
    rating: 5,
    content:
      "I love how easy it is to share my cat's medical history with new vets. It's made moving to a new city so much easier for both of us. The digital vaccination records have been incredibly convenient, and the reminders ensure Luna never misses her preventative treatments.",
  },
  {
    name: "Emma Rodriguez",
    role: "Multiple Pet Owner",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    petImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    petName: "Bella, Rocky & Leo",
    petType: "Mixed Breeds",
    rating: 5,
    content:
      "Managing three pets used to be a logistical nightmare. Now I have everything organized in one place, and I never miss an appointment. The family sharing feature lets my husband and our pet sitter access important information when I'm traveling. It's been a lifesaver!",
  },
  {
    name: "David Wilson",
    role: "Dog Owner",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    petImage: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    petName: "Cooper",
    petType: "Border Collie",
    rating: 4,
    content:
      "The ability to track symptoms over time has helped my vet diagnose my dog's chronic condition. I can't imagine pet care without this tool now. The interface is intuitive, and the customer support team was incredibly helpful when I had questions about setting up Cooper's profile.",
  },
  {
    name: "Jennifer Lee",
    role: "Exotic Pet Owner",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
    petImage: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    petName: "Ziggy",
    petType: "Bearded Dragon",
    rating: 5,
    content:
      "Finding care resources for exotic pets can be challenging, but this platform has specialized information that's been invaluable. I can track Ziggy's feeding schedule, temperature requirements, and growth patterns. The community forum connected me with other reptile owners too!",
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const next = () => {
    if (animating) return;
    setAnimating(true);
    const nextIndex = activeIndex === testimonialsData.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const previous = () => {
    if (animating) return;
    setAnimating(true);
    const nextIndex = activeIndex === 0 ? testimonialsData.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
    setTimeout(() => setAnimating(false), 500);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Pet Parents Everywhere
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what pet owners like you have
            to say about our platform.
          </p>
        </div>

        {/* Featured testimonial - carousel style */}
        <div className="relative mb-20 overflow-hidden">
          <div className="absolute top-10 left-10 -z-10 w-72 h-72 bg-orange-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 -z-10 w-72 h-72 bg-amber-100 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
            <div className="grid md:grid-cols-5 items-stretch">
              {/* Left column with image */}
              <div className="md:col-span-2 relative min-h-[300px] md:min-h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 to-transparent z-10"></div>
                <Image 
                  src={testimonialsData[activeIndex].petImage} 
                  alt={`${testimonialsData[activeIndex].petName} - ${testimonialsData[activeIndex].petType}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg z-20">
                  <p className="font-medium text-sm">{testimonialsData[activeIndex].petName}</p>
                  <p className="text-xs text-gray-500">{testimonialsData[activeIndex].petType}</p>
                </div>
              </div>
              
              {/* Right column with testimonial */}
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-white shadow-md">
                        <AvatarImage src={testimonialsData[activeIndex].image} alt={testimonialsData[activeIndex].name} />
                        <AvatarFallback>{testimonialsData[activeIndex].name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{testimonialsData[activeIndex].name}</p>
                        <p className="text-sm text-gray-500">{testimonialsData[activeIndex].role} • {testimonialsData[activeIndex].location}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center">
                      {renderStars(testimonialsData[activeIndex].rating)}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <Quote className="h-8 w-8 text-orange-200 mb-4" />
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      "{testimonialsData[activeIndex].content}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center md:hidden">
                    {renderStars(testimonialsData[activeIndex].rating)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-gray-200 hover:bg-orange-50 hover:border-orange-200"
                      onClick={previous}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-gray-200 hover:bg-orange-50 hover:border-orange-200"
                      onClick={next}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4 border-2 border-white shadow-sm">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-4">"{testimonial.content}"</p>
                </div>
                
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image 
                      src={testimonial.petImage} 
                      alt={testimonial.petName}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.petName}</p>
                    <p className="text-xs text-gray-500">{testimonial.petType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            View All Testimonials
          </Button>
        </div>
      </div>
    </section>
  )
}
