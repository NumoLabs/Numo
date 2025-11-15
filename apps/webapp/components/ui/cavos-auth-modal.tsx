"use client"

import { useState, useEffect, useRef } from 'react'
import { useCavosAuthContext } from '@/components/cavos-auth-provider'
import { useToast } from '@/hooks/use-toast'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Alert, AlertDescription } from './alert'
import { Eye, EyeOff, Mail, Lock, Loader2, Check, X, ArrowLeft } from 'lucide-react'

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

type AuthView = 'signin' | 'signup' | 'forgot-password' | 'reset-password'

export function CavosAuthModal({ onSuccess, trigger }: CavosAuthModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<AuthView>('signin')
  const [isSignUp, setIsSignUp] = useState(false) // Start with Login form
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: ''
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const { 
    signIn, 
    isLoading, 
    error, 
    isAuthenticated, 
    user, 
    clearError,
    passwordReset,
    passwordResetConfirm,
    getGoogleOAuthUrl,
    getAppleOAuthUrl,
    handleOAuthCallback
  } = useCavosAuthContext()
  const { toast } = useToast()
  
  // Reset form and error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        resetToken: ''
      })
      setLocalError(null)
      setResetEmailSent(false)
      clearError()
      setView('signin')
      setIsSignUp(false)
    }
  }, [isOpen, clearError])
  
  // Sync view with isSignUp for backward compatibility
  useEffect(() => {
    if (view === 'signin') {
      setIsSignUp(false)
    } else if (view === 'signup') {
      setIsSignUp(true)
    }
  }, [view])
  
  // Close modal automatically when user becomes authenticated (for mobile redirects)
  useEffect(() => {
    if (isAuthenticated) {
      // Close modal if it's open
      if (isOpen) {
        setIsOpen(false)
      }
      
      // Call success callback if provided
      if (onSuccess && user) {
        onSuccess(user)
      }
    }
  }, [isAuthenticated, isOpen, user, onSuccess])

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
        confirmPassword: '',
        resetToken: ''
      })
      setLocalError(null)
    }
  }, [isAuthenticated, user, onSuccess])
  
  // Clear error when switching views
  useEffect(() => {
    setLocalError(null)
    clearError()
  }, [view, clearError])
  
  // Track previous error to avoid showing duplicate toasts
  const prevErrorRef = useRef<string | null>(null)
  
  useEffect(() => {
    if (error) {
      setLocalError(error)
      
      if (prevErrorRef.current !== error) {
        prevErrorRef.current = error
        toast({
          title: isSignUp ? "Registration Failed" : "Sign In Failed",
          description: error,
          variant: "default",
          duration: 5000,
        })
      }
    } else {
      prevErrorRef.current = null
    }
  }, [error, isSignUp, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all required fields.')
      clearError()
      return
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.')
      clearError()
      return
    }

    if (isSignUp && !isPasswordValid) {
      setLocalError('Password does not meet all requirements. Please check the requirements below.')
      clearError()
      toast({
        title: "Password Requirements Not Met",
        description: "Please ensure your password meets all the requirements listed below.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    // Clear errors before attempting auth
    clearError()
    setLocalError(null)
    
    const action = isSignUp ? 'signup' : 'signin'
    
    try {
      const result = await signIn(formData.email, formData.password, action)
      
      if (!result) {
        return
      }
    } catch (authError: unknown) {
      const errorMessage = authError instanceof Error ? authError.message : 'Authentication failed. Please try again.'
      setLocalError(errorMessage)
      clearError()
      
      toast({
        title: isSignUp ? "Registration Failed" : "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      return
    }
      
    // Clear any errors on success
    setLocalError(null)
    clearError()
    
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
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (localError) {
      setLocalError(null)
    }
    if (error) {
      clearError()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()
    
    if (!formData.email) {
      setLocalError('Please enter your email address.')
      return
    }
    
    try {
      await passwordReset(formData.email)
      setResetEmailSent(true)
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a password reset link has been sent.",
        duration: 5000,
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email'
      setLocalError(errorMessage)
    }
  }

  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()
    
    if (!formData.resetToken || !formData.password) {
      setLocalError('Please enter the reset token and new password.')
      return
    }
    
    if (!isPasswordValid) {
      setLocalError('Password does not meet all requirements.')
      return
    }
    
    try {
      await passwordResetConfirm(formData.resetToken, formData.password)
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now sign in with your new password.",
        duration: 5000,
      })
      // Switch back to sign in view
      setView('signin')
      setFormData(prev => ({
        ...prev,
        password: '',
        resetToken: ''
      }))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password'
      setLocalError(errorMessage)
    }
  }

  // Setup message listener for OAuth callbacks
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data.type === 'OAUTH_CALLBACK') {
        try {
          await handleOAuthCallback(event.data.callbackResult)
          
          // Show success toast
          toast({
            title: "Authentication Successful",
            description: "You have been successfully signed in.",
            duration: 3000,
          })
          
          // Modal will close automatically via useEffect when user is authenticated
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'OAuth authentication failed'
          setLocalError(errorMessage)
          
          // Also show error toast
          toast({
            title: "OAuth Authentication Failed",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          })
        }
      } else if (event.data.type === 'OAUTH_ERROR') {
        const errorMessage = event.data.error || 'OAuth authentication failed'
        setLocalError(errorMessage)
        
        // Show error toast
        toast({
          title: "OAuth Authentication Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleOAuthCallback, toast])

  const handleGoogleSignIn = async () => {
    try {
      setLocalError(null)
      clearError()
      
      // Store provider for callback page
      if (typeof window !== 'undefined') {
        localStorage.setItem('oauth_provider', 'google')
      }
      
      // Get redirect URI (callback page URL)
      const redirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/oauth/callback`
        : ''
      
      // Get Google OAuth URL
      const oauthUrl = await getGoogleOAuthUrl(redirectUri)
      
      // Detect if device is mobile
      const isMobile = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768
      )
      
      if (typeof window !== 'undefined') {
        if (isMobile) {
          // On mobile, redirect directly instead of popup (popups are blocked on mobile)
          window.location.href = oauthUrl
        } else {
          // On desktop, open in popup window
          const width = 500
          const height = 600
          const left = (window.screen.width - width) / 2
          const top = (window.screen.height - height) / 2
          
          window.open(
            oauthUrl,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          )
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google authentication failed'
      setLocalError(errorMessage)
    }
  }

  const handleAppleSignIn = async () => {
    try {
      setLocalError(null)
      clearError()
      
      // Store provider for callback page
      if (typeof window !== 'undefined') {
        localStorage.setItem('oauth_provider', 'apple')
      }
      
      // Get redirect URI (callback page URL)
      const redirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/oauth/callback`
        : ''
      
      // Get Apple OAuth URL
      const oauthUrl = await getAppleOAuthUrl(redirectUri)
      
      // Detect if device is mobile
      const isMobile = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768
      )
      
      if (typeof window !== 'undefined') {
        if (isMobile) {
          // On mobile, redirect directly instead of popup (popups are blocked on mobile)
          window.location.href = oauthUrl
        } else {
          // On desktop, open in popup window
          const width = 500
          const height = 600
          const left = (window.screen.width - width) / 2
          const top = (window.screen.height - height) / 2
          
          window.open(
            oauthUrl,
            'Apple Sign In',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          )
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Apple authentication failed'
      setLocalError(errorMessage)
    }
  }

  const isFormValid = () => {
    if (view === 'signup') {
      return formData.email && 
             formData.password && 
             formData.password === formData.confirmPassword && 
             isPasswordValid
    } else if (view === 'reset-password') {
      return formData.resetToken && 
             formData.password && 
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
            {view === 'signup' && 'Create Account'}
            {view === 'signin' && 'Sign In'}
            {view === 'forgot-password' && 'Reset Password'}
            {view === 'reset-password' && 'Set New Password'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Forgot Password - Email Sent Success */}
        {view === 'forgot-password' && resetEmailSent ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Password reset email sent!</p>
                    <p className="text-sm mt-1">
                      If an account exists for <strong>{formData.email}</strong>, a password reset link has been sent.
                    </p>
                    <p className="text-sm mt-2">
                      Please check your inbox and click the link to reset your password.
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setView('signin')
                setResetEmailSent(false)
              }}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </div>
        ) : view === 'forgot-password' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {(localError || error) && (
              <Alert variant="destructive" className="max-h-40 overflow-y-auto">
                <AlertDescription className="text-sm break-words whitespace-normal leading-relaxed">
                  {localError || error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
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
            
            <Button
              type="submit"
              disabled={!formData.email || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setView('signin')}
              className="w-full"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </form>
        ) : view === 'reset-password' ? (
          <form onSubmit={handlePasswordResetConfirm} className="space-y-4">
            {(localError || error) && (
              <Alert variant="destructive" className="max-h-40 overflow-y-auto">
                <AlertDescription className="text-sm break-words whitespace-normal leading-relaxed">
                  {localError || error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="reset-token">Reset Token</Label>
              <Input
                id="reset-token"
                type="text"
                placeholder="Enter the token from your email"
                value={formData.resetToken}
                onChange={(e) => handleInputChange('resetToken', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
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
              {formData.password && (
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
            
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(localError || error) && (
                <Alert variant="destructive" className="max-h-40 overflow-y-auto">
                  <AlertDescription className="text-sm break-words whitespace-normal leading-relaxed">
                    {localError || error}
                  </AlertDescription>
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
                {view === 'signup' && formData.password && (
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
              
              {view === 'signup' && (
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
                    {view === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  view === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            
            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </Button>
            </div>
            
            {/* Footer Links */}
            <div className="space-y-2 text-center pt-2">
              {view === 'signin' && (
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="text-sm text-muted-foreground hover:text-orange-500 underline transition-colors block w-full"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              )}
              
              <button
                type="button"
                onClick={() => {
                  setView(view === 'signup' ? 'signin' : 'signup')
                  setLocalError(null)
                  // Clear password fields when switching
                  setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                  }))
                }}
                className="text-sm text-muted-foreground hover:text-orange-500 underline transition-colors"
                disabled={isLoading}
              >
                {view === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
