"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const access_token = searchParams.get("access_token") ?? ""
  const refresh_token = searchParams.get("refresh_token") ?? ""

  useEffect(() => {
    const supabase = createClient()
    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (error) {
            console.error("Session error:", error)
            setError("Invalid or expired reset token.")
          } else {
            console.log("Session established successfully")
          }
        })
        .catch((err) => {
          console.error("Session error:", err)
          setError("Invalid or expired reset token.")
        })
    } else {
      setError("Missing reset token.")
    }
  }, [access_token, refresh_token])

  const handleResetPassword = async () => {
    setError("")
    setSuccess("")

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.")
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.")
    }

    setLoading(true)
    const supabase = createClient()

         const { error } = await supabase.auth.updateUser({ password })
     setLoading(false)

     if (error) {
       console.error("Password update error:", error)
       return setError(error.message)
     }

    setSuccess("Password updated successfully. Redirecting to login...")
    setTimeout(() => router.push("/login"), 2500)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
        Reset Your Password
      </h1>

      {error && <p className="text-red-500 mb-4 flex items-center"><AlertCircle className="mr-2" /> {error}</p>}
      {success && <p className="text-green-600 mb-4 flex items-center"><CheckCircle className="mr-2" /> {success}</p>}

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleResetPassword}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? "Updating..." : "Reset Password"}
             </button>
     </div>
   )
 }

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
