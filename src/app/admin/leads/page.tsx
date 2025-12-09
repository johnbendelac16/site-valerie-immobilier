"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE = "https://site-immo-backend.onrender.com"

interface Lead {
  id: string
  name?: string
  email?: string
  phone?: string
  city?: string
  budget?: string
  message?: string
  createdAt?: string
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  // même protection que /admin
  useEffect(() => {
    if (typeof window === "undefined") return
    const ok = localStorage.getItem("valerie-admin-ok") === "1"
    if (!ok) {
      router.replace("/admin-login")
    } else {
      setAuthChecked(true)
    }
  }, [router])

  useEffect(() => {
    if (!authChecked) return
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/contact`)
        const data = await res.json()
        if (Array.isArray(data)) setLeads(data)
        else setLeads([])
      } catch (err) {
        console.error("Erreur fetch contacts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [authChecked])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        Vérification de l&apos;accès...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Leads (contacts)</h1>
          <button
            onClick={() => router.push("/admin")}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            ← Retour aux biens
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Chargement des contacts...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xl font-semibold text-gray-700 mb-2">Aucun contact</p>
            <p className="text-gray-500">
              Les formulaires de contact remplis apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {lead.name || "Sans nom"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {lead.city && <span>{lead.city} • </span>}
                      {lead.budget && <span>Budget: {lead.budget}</span>}
                    </p>
                    {lead.phone && (
                      <p className="text-sm text-gray-700 mt-1">
                        📞 {lead.phone}
                      </p>
                    )}
                    {lead.email && (
                      <p className="text-sm text-gray-700">
                        ✉️ {lead.email}
                      </p>
                    )}
                  </div>
                  {lead.createdAt && (
                    <p className="text-xs text-gray-500">
                      Créé le{" "}
                      {new Date(lead.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                {lead.message && (
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">
                    {lead.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
