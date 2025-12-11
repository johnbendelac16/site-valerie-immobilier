"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"

interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  city?: string
  budget?: string
  message?: string
  source?: string
  projectType?: string
  timeline?: string
  cities?: string
  createdAt?: string
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ même logique que sur /admin-login : clé "valerie-admin-ok"
  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      window.localStorage.getItem("valerie-admin-ok") === "1"

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
        if (!res.ok) throw new Error("Erreur API")
        const data = await res.json()
        setLeads(data)
      } catch (err) {
        console.error("Erreur fetch leads:", err)
        setError("Impossible de charger les leads")
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [authChecked])

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-600">Vérification de l&apos;accès admin...</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-600">Chargement des leads...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Leads (admin)</h1>
      <p className="text-sm text-gray-600 mb-4">Total : {leads.length} leads</p>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Villes</th>
              <th className="px-3 py-2">Budget</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-gray-100 align-top">
                <td className="px-3 py-2 text-xs text-gray-500">
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString("fr-FR")
                    : "-"}
                </td>
                <td className="px-3 py-2 font-medium text-gray-900">
                  {lead.name}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {lead.phone && <div>📱 {lead.phone}</div>}
                  {lead.email && <div>✉️ {lead.email}</div>}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {lead.projectType || "-"}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {lead.cities || lead.city || "-"}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {lead.budget || "-"}
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {lead.source || "-"}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700 max-w-xs">
                  <div className="line-clamp-3 whitespace-pre-line">
                    {lead.message || "-"}
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-4 text-center text-sm text-gray-500"
                >
                  Aucun lead pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
