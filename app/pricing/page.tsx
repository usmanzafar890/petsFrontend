import Image from 'next/image';
import Link from 'next/link';
import { PawPrint, Check, Star } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-white to-orange-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-amber-600/70 z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')] 
          bg-cover bg-center"
        />
        <div className="container relative z-20 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Choose Your Perfect Plan</h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center">
            Affordable care solutions for your furry friends
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 container">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 border-2 border-orange-100 relative">
              <div className="absolute top-0 right-0 h-24 w-24">
                <div className="absolute transform rotate-45 bg-orange-100 text-center text-orange-600 font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
                  Popular
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-orange-50 to-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <PawPrint className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Basic Care</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-center text-gray-600 mb-6">Perfect for individual pet owners getting started</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic health tracking</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Vaccination reminders</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Community forum access</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 pet profile</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 user account</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href="/signup" className="block w-full py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium rounded-lg text-center transition-colors">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-orange-500 transform scale-105 z-10">
              <div className="p-6 bg-gradient-to-b from-orange-500 to-amber-500">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-white mb-2">Premium Care</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">$19.99</span>
                  <span className="text-white/80 ml-2">/month</span>
                </div>
                <p className="text-center text-white/80 mb-6">Most popular choice for families with pets</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced health tracking</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited vaccination reminders</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority community support</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Up to 5 pet profiles</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Family access (up to 4 members)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">24/7 vet chat assistance</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Personalized care plans</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href="/signup" className="block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-center transition-colors">
                  Get Premium
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 border-2 border-amber-100">
              <div className="p-6 bg-gradient-to-b from-amber-50 to-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Professional</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">$39.99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-center text-gray-600 mb-6">For breeders, professionals, and large families</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Premium</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited pet profiles</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited family members</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Breeding tracking tools</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority vet consultations</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href="/signup" className="block w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-600 font-medium rounded-lg text-center transition-colors">
                  Go Professional
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all new users. You can explore all the features of the Basic plan before making a commitment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">How do family memberships work?</h3>
              <p className="text-gray-600">
                With Premium and Professional plans, you can add family members who will have their own login credentials but share access to your pet profiles. Each family member can contribute to pet care records, receive notifications, and participate in vet chats. The main account holder manages family member permissions and access.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">How does the vet chat assistance work?</h3>
              <p className="text-gray-600">
                Premium and Professional plan members get access to our network of licensed veterinarians for quick questions and advice. This is not a replacement for emergency care but can help with general questions and minor concerns.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed and your information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to give your pets the family care they deserve?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy families who trust Pet-Care for their furry friends' health and happiness. Perfect for the whole family!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">What Our Customers Say</h2>
          <p className="text-center text-gray-600 mb-12">Pet owners love our subscription plans</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute top-6 left-8 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="h-12 w-12 text-orange-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div className="relative ml-10">
                <p className="text-gray-600 italic mb-4">
                  "The Premium plan has been a game-changer for our family. With three dogs and a cat, the multiple pet profiles and family access have saved us so much time and worry. My husband and kids all have their own accounts, and we can all contribute to our pets' care. Worth every penny!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden relative mr-3">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80')] bg-cover bg-center" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Premium Plan Member</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute top-6 left-8 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="h-12 w-12 text-orange-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div className="relative ml-10">
                <p className="text-gray-600 italic mb-4">
                  "As a professional breeder, the Professional plan gives me all the tools I need to track my dogs' health, breeding cycles, and pedigrees. The analytics help me make better decisions for my business."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden relative mr-3">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')] bg-cover bg-center" />
                  </div>
                  <div>
                    <p className="font-medium">Michael Rodriguez</p>
                    <p className="text-sm text-gray-500">Professional Plan Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
