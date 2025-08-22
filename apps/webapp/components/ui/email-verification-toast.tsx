"use client"

import { CheckCircle, Mail, X } from 'lucide-react'
import { Button } from './button'

interface EmailVerificationToastProps {
  email: string
  onClose: () => void
}

export function EmailVerificationToast({ email, onClose }: EmailVerificationToastProps) {
  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Account Created Successfully!
          </h3>
          
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 text-green-500" />
              <span>Verification email sent to:</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {email}
            </p>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Please check your inbox and click the verification link to activate your account.
          </p>
          
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8 px-3"
              onClick={() => {
                // You can add logic to resend verification email here
                console.log('Resend verification email')
              }}
            >
              Resend Email
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 px-3 bg-green-600 hover:bg-green-700"
              onClick={onClose}
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
