"use client"

import { useState, useRef } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Linkedin,
  Sparkles,
  Copy,
  Check,
  Users,
} from "lucide-react"

// Auto-compress and resize image on the client using HTML5 Canvas (only if > 1MB)
function compressImageFile(file: File, maxDim = 1000, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    // If already under 1MB, keep original directly
    if (file.size <= 1024 * 1024) {
      resolve(file)
      return
    }

    const timeout = setTimeout(() => {
      resolve(file)
    }, 2500)

    try {
      const objectUrl = URL.createObjectURL(file)
      const img = document.createElement("img")

      img.onload = () => {
        clearTimeout(timeout)
        try {
          let width = img.naturalWidth || img.width
          let height = img.naturalHeight || img.height

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            URL.revokeObjectURL(objectUrl)
            resolve(file)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl)
              if (!blob) {
                resolve(file)
                return
              }
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"
              const compressed = new File([blob], cleanName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressed)
            },
            "image/jpeg",
            quality
          )
        } catch {
          URL.revokeObjectURL(objectUrl)
          resolve(file)
        }
      }

      img.onerror = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(objectUrl)
        resolve(file)
      }

      img.src = objectUrl
    } catch {
      clearTimeout(timeout)
      resolve(file)
    }
  })
}

export default function CampusAmbassadorRegisterPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [college, setCollege] = useState("")
  const [address, setAddress] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

  // UI state
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<{ refNo: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Photo must be JPEG, PNG, or WebP format")
      return
    }

    // Allow files up to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("Photo file is too large (max 10MB). Please choose a photo under 1MB for best results.")
      return
    }

    setError(null)

    // Revoke previous blob preview if any
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview)
    }

    // Instant photo preview
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)

    // If already under 1MB, use directly with ZERO optimization delay!
    if (file.size <= 1024 * 1024) {
      setPhoto(file)
      setCompressing(false)
      return
    }

    // If larger than 1MB, optimize in background with safety timeout
    setCompressing(true)
    try {
      const compressed = await compressImageFile(file)
      setPhoto(compressed)
    } catch {
      setPhoto(file)
    } finally {
      setCompressing(false)
    }
  }

  const removePhoto = () => {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("college", college)
      formData.append("address", address)
      formData.append("linkedin_url", linkedinUrl)

      if (photo) {
        let fileToSend = photo
        if (fileToSend.size > 1024 * 1024) {
          fileToSend = await compressImageFile(fileToSend)
        }
        formData.append("photo", fileToSend)
      }

      const res = await fetch("/api/campus-ambassador/register", {
        method: "POST",
        body: formData,
      })

      let data: any = null
      const rawText = await res.text()
      try {
        data = JSON.parse(rawText)
      } catch {
        // Body is not JSON
      }

      if (!res.ok) {
        if (res.status === 413 || rawText.toLowerCase().includes("too large") || rawText.toLowerCase().includes("entity")) {
          throw new Error("The uploaded photo is too large for the server. Please select a different or smaller photo.")
        }
        throw new Error(data?.error || rawText || `Server error (${res.status}). Please try again.`)
      }

      setSuccess({ refNo: data.ref_no })
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const copyRefNo = () => {
    if (success?.refNo) {
      navigator.clipboard.writeText(success.refNo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background */}
      <div
        className="ambient-glow w-[500px] h-[500px] -top-20 -left-20"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)" }}
      />
      <div
        className="ambient-glow w-[500px] h-[500px] top-1/2 -right-20"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)" }}
      />

      <Header onAuth={handleAuth} />

      <section className="relative pt-36 pb-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Back button */}
          <div className="max-w-6xl mx-auto mb-8">
            <Link
              href="/campus-ambassadors"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 transition-all w-fit"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Campus Ambassadors</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 max-w-6xl mx-auto">
            {/* Left: Heading & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-5/12"
            >
              <div className="mono-badge mb-6">
                <span className="dot" style={{ background: "#a855f7" }} />
                Registration
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Become a <span className="gradient-text-purple">Campus Ambassador</span>
              </h1>
              <p className="text-base text-white/40 leading-relaxed mb-8">
                Fill out your details below and upload your best photo. Once submitted,
                your profile will be reviewed by our team. Upon approval, your profile
                will be featured on our Campus Ambassadors page!
              </p>

              {/* What you get */}
              <div className="space-y-3">
                {[
                  "Unique Campus Ambassador ID",
                  "Profile featured on CodeNeuraX website",
                  "Certificate of Leadership & LOR",
                  "Direct mentorship from the core team",
                  "Networking with industry experts",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400/80 shrink-0" />
                    <span className="text-white/50 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form or Success */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:w-7/12"
            >
              {success ? (
                /* Success Screen */
                <div className="mac-window">
                  <div className="p-8 sm:p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-9 h-9 text-green-400" />
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-white mb-3"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Registration Successful!
                    </h2>
                    <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                      Your profile has been submitted for review. You'll be featured on
                      the Campus Ambassadors page once approved by our team.
                    </p>

                    {/* Ref No Card */}
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8 max-w-sm mx-auto">
                      <p
                        className="text-[0.65rem] text-white/30 uppercase tracking-wider font-semibold mb-3"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Your Campus Ambassador ID
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <span
                          className="text-2xl sm:text-3xl font-bold text-purple-400 tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {success.refNo}
                        </span>
                        <button
                          onClick={copyRefNo}
                          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white"
                          title="Copy ID"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[0.6rem] text-white/20 mt-3" style={{ fontFamily: "var(--font-mono)" }}>
                        Save this ID for your records
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/campus-ambassadors" className="btn-premium text-sm">
                        <Users className="w-4 h-4" />
                        View All Ambassadors
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <div className="mac-window">
                  <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    {error && (
                      <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold text-center">
                        {error}
                      </div>
                    )}

                    {/* Photo Upload */}
                    <div className="mb-6">
                      <label
                        className="block text-white/40 text-xs font-medium mb-3 uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Profile Photo <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center gap-5">
                        {/* Preview */}
                        <div className="relative shrink-0">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/[0.08] bg-white/[0.02]">
                            {photoPreview ? (
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white/20" />
                              </div>
                            )}
                          </div>
                          {photoPreview && (
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Upload Button */}
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.08] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {compressing ? "Optimizing..." : photo ? "Change Photo" : "Upload Photo"}
                          </label>
                          <p className="text-[0.6rem] text-white/20 mt-2" style={{ fontFamily: "var(--font-mono)" }}>
                            JPEG, PNG or WebP • Under 1MB recommended
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Name */}
                      <div>
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-name"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            Full Name <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          className="input-mac"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          maxLength={100}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-email"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Email Address <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          className="input-mac"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          maxLength={100}
                        />
                      </div>

                      {/* College */}
                      <div>
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-college"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3" />
                            College / University <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-college"
                          type="text"
                          className="input-mac"
                          placeholder="IIT Delhi"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          required
                          maxLength={200}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-phone"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            Phone Number <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-phone"
                          type="tel"
                          className="input-mac"
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          maxLength={20}
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-address"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            Address <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-address"
                          type="text"
                          className="input-mac"
                          placeholder="City, State, Country"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          maxLength={500}
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="sm:col-span-2">
                        <label
                          className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                          htmlFor="reg-linkedin"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Linkedin className="w-3 h-3" />
                            LinkedIn Profile URL <span className="text-red-400">*</span>
                          </span>
                        </label>
                        <input
                          id="reg-linkedin"
                          type="url"
                          className="input-mac"
                          placeholder="https://linkedin.com/in/johndoe"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          required
                          maxLength={300}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full btn-premium justify-center mt-4"
                      disabled={sending || !photo}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Register as Campus Ambassador</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {!photo && (
                      <p className="text-center text-[0.65rem] text-white/20 mt-3" style={{ fontFamily: "var(--font-mono)" }}>
                        Please upload a profile photo to enable submission
                      </p>
                    )}
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
            Team CodeNeuraX 💙
          </p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
