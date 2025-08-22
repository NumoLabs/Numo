"use client"

import { useState, useEffect } from 'react'
import { useCavosAuthContext } from '@/components/cavos-auth-provider'
import { useToast } from '@/hooks/use-toast'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Alert, AlertDescription } from './alert'
import { Eye, EyeOff, Mail, Lock, Loader2, Check, X } from 'lucide-react'

interface CavosAuthModalProps {
  onSuccess?: (user: unknown) => void
  trigger?: React.ReactNode
}

// Password validation requirements
const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
}

export function CavosAuthModal({ onSuccess, trigger }: CavosAuthModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { signIn, isLoading, error, isAuthenticated, user } = useCavosAuthContext()
  const { toast } = useToast()

  // Password validation
  const getPasswordValidation = (password: string) => {
    return {
      minLength: password.length >= passwordRequirements.minLength,
      hasUppercase: passwordRequirements.hasUppercase.test(password),
      hasLowercase: passwordRequirements.hasLowercase.test(password),
      hasNumber: passwordRequirements.hasNumber.test(password),
      hasSpecialChar: passwordRequirements.hasSpecialChar.test(password)
    }
  }

  const passwordValidation = getPasswordValidation(formData.password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  // Close modal when authentication is successful
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsOpen(false)
      onSuccess?.(user)
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [isAuthenticated, user, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      return
    }

    if (isSignUp && !isPasswordValid) {
      toast({
        title: "Password Requirements Not Met",
        description: "Please ensure your password meets all the requirements listed below.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      await signIn(formData.email, formData.password)
      
      // Show verification email notification for new registrations
      if (isSignUp) {
        toast({
          title: "Account Created Successfully!",
          description: (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4 text-green-500" />
                <span>Verification email sent to:</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formData.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
          ),
          duration: 10000, // Show for 10 seconds
          className: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
        })
      }
      
      // The modal will close automatically via the useEffect above
    } catch {
      // Don't close modal on error - let user try again
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    if (isSignUp) {
      return formData.email && 
             formData.password && 
             formData.password === formData.confirmPassword && 
             isPasswordValid
    }
    return formData.email && formData.password
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSignUp ? 'Register with Cavos' : 'Sign In with Cavos'}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password requirements */}
            {isSignUp && formData.password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Password requirements:
                </p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {passwordValidation.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {passwordValidation.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {passwordValidation.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    One lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {passwordValidation.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    One number
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {passwordValidation.hasSpecialChar ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    One special character (!@#$%^&*)
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-white hover:text-orange-500 underline"
            disabled={isLoading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
