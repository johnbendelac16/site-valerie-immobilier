"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "change-me-in-env"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      localStorage.getItem("valerie-admin-ok") === "1"
    if (ok) {
      router.replace("/admin")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("valerie-admin-ok", "1")
      }
      router.replace("/admin")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Accès administrateur
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Cette zone est réservée pour la gestion des biens et des contacts.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            Entrer dans l&apos;admin
          </button>
        </form>
      </div>
    </main>
  )
}
