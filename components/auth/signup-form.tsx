"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/stores/auth"
import { Eye, EyeOff, Loader2, PawPrint, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeInput, setActiveInput] = useState<string | null>(null)

  const signUp = useAuthStore((state) => state.signUp)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await signUp({ name, email, password })
      router.push("/dashboard")
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Signup failed. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid gap-2 text-center"
          >
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 opacity-75 blur-sm"></div>
                <div className="relative bg-white rounded-full p-2">
                  <PawPrint className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">PetCare</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Join Our Pack!</h1>
            <p className="text-balance text-gray-600">
              Create your account to start your pet care journey
            </p>
          </motion.div>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="grid gap-5">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <div className={`relative rounded-md border ${activeInput === 'name' ? 'ring-2 ring-orange-200 border-orange-300' : 'border-gray-200'} transition-all duration-200`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${activeInput === 'name' ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setActiveInput('name')}
                      onBlur={() => setActiveInput(null)}
                      className="border-0 pl-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className={`relative rounded-md border ${activeInput === 'email' ? 'ring-2 ring-orange-200 border-orange-300' : 'border-gray-200'} transition-all duration-200`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${activeInput === 'email' ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setActiveInput('email')}
                      onBlur={() => setActiveInput(null)}
                      className="border-0 pl-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className={`relative rounded-md border ${activeInput === 'password' ? 'ring-2 ring-orange-200 border-orange-300' : 'border-gray-200'} transition-all duration-200`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${activeInput === 'password' ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActiveInput('password')}
                      onBlur={() => setActiveInput(null)}
                      className="border-0 pl-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <div className={`relative rounded-md border ${activeInput === 'confirmPassword' ? 'ring-2 ring-orange-200 border-orange-300' : 'border-gray-200'} transition-all duration-200`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${activeInput === 'confirmPassword' ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setActiveInput('confirmPassword')}
                      onBlur={() => setActiveInput(null)}
                      className="border-0 pl-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-100"
                  >
                    {error}
                  </motion.p>
                )}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2 shadow-md hover:shadow-lg transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
                
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500 hover:underline transition-colors">
              Sign in
            </Link>
          </div>
          
          <div className="flex justify-center space-x-4">
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-8 h-8"
            >
              <Image 
                src="https://em-content.zobj.net/source/microsoft-teams/363/dog-face_1f436.png" 
                width={32} 
                height={32} 
                alt="Dog emoji" 
              />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="w-8 h-8"
            >
              <Image 
                src="https://em-content.zobj.net/source/microsoft-teams/363/cat-face_1f431.png" 
                width={32} 
                height={32} 
                alt="Cat emoji" 
              />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              className="w-8 h-8"
            >
              <Image 
                src="https://em-content.zobj.net/source/microsoft-teams/363/rabbit-face_1f430.png" 
                width={32} 
                height={32} 
                alt="Rabbit emoji" 
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 to-amber-500/90 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80" 
            alt="Cute puppy"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full p-12 text-white">
          <div className="max-w-md text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <PawPrint className="h-16 w-16" />
              </div>
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Join Our Pet-Loving Community
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-lg md:text-xl opacity-90 mb-8"
            >
              Connect with other pet owners, share experiences, and access premium pet care resources.
            </motion.p>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 max-w-xs mx-auto"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-sm">Pet Care Support</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <h3 className="text-2xl font-bold">100%</h3>
                <p className="text-sm">Pet Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
