"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"


// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = "https://site-immo-backend.onrender.com"


interface Property {
  id: string
  title: string
  price: string
  city: string
  image?: string
  rooms?: number
  area?: number
  floor?: number
  hasParking?: boolean
  description?: string
}

export default function PropertyPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`${API_BASE}/api/proprietes`)
      .then((res) => res.json())
      .then((data) => {
        const prop = Array.isArray(data) ? data.find((p: any) => p.id === id) : null
        setProperty(prop || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Bien introuvable</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <a href="/" className="text-blue-600 text-sm font-medium mb-4 inline-block">
          ← Retour aux exclusivités
        </a>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {property.image && (
            <div className="h-80 w-full overflow-hidden">
              <img
                src={property.image.startsWith("/") ? property.image : `/${property.image}`}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900"></h1>
            <p className="text-gray-700 mb-2">{property.city}</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">{property.price}</p>
            <div className="flex flex-wrap gap-3 text-gray-700 mb-6">
              {property.rooms ? <span>{property.rooms} pièces</span> : null}
              {property.area ? <span>• {property.area} m²</span> : null}
              {property.floor ? <span>• {property.floor}ᵉ étage</span> : null}
              {property.hasParking ? <span>• Parking</span> : null}
            </div>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {property.description && property.description.trim().length > 0
                ? property.description
                : "Appartement idéal pour olim français, proche des services et transports. Personnalisez cette description dans l'admin."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/972537081641"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-center hover:bg-blue-700"
              >
                Contacter sur WhatsApp
              </a>
              <a
                href="tel:+972537081641"
                className="bg-white text-blue-700 border border-blue-400 px-6 py-3 rounded-xl font-bold text-center hover:bg-blue-50"
              >
                Appeler
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
