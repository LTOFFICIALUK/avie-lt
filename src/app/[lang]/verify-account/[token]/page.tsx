'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'

interface ApiResponse {
  status: 'success' | 'error'
  message?: string
  error?: string
}

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
}

export default function VerifyAccountPage() {
  const params = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const lang = params.lang as string || 'en'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const emailToken = params.token as string

        const response = await api.post<ApiResponse>('/api/user/verify-email', {
          emailToken: emailToken
        })

        if (response.data.status === 'success') {
          setStatus('success')
          setMessage(response.data.message || '')
        } else {
          setStatus('error')
          setMessage(response.data.error || 'An error occurred while verifying your email.')
        }
      } catch (err: unknown) {
        const error = err as ApiError
        setStatus('error')
        setMessage(error.response?.data?.error || 'An error occurred while verifying your email.')
      }
    }

    verifyEmail()
  }, [params.token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-6 bg-[#0b0b0f] border border-zinc-800/50 rounded-lg">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">Verifying account...</h1>
              <p className="text-zinc-400">Please wait while we verify your account.</p>
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-[var(--color-brand)] rounded-full animate-spin border-t-transparent"></div>
              </div>
            </>
          )}
          
          {status === 'success' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">Account Verified! ✅</h1>
              <p className="text-zinc-400 mb-6">{message}</p>
              <Link
                href={`/${lang}`}
                className="inline-block px-6 py-2 bg-[var(--color-brand)] text-black font-medium rounded-md hover:bg-[var(--color-brand-darker)] transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}
          
          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">Verification Failed ❌</h1>
              <p className="text-red-500 mb-6">{message}</p>
              <Link
                href={`/${lang}`}
                className="inline-block px-6 py-2 bg-zinc-700 text-white font-medium rounded-md hover:bg-zinc-600 transition-colors"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 