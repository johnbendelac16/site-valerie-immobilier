"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function Admin() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  const [properties, setProperties] = useState<Property[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [city, setCity] = useState("")
  const [image, setImage] = useState("")
  const [rooms, setRooms] = useState("")
  const [area, setArea] = useState("")
  const [floor, setFloor] = useState("")
  const [hasParking, setHasParking] = useState(false)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // Protection simple: redirige vers /admin-login si pas "loggé"
  useEffect(() => {
    if (typeof window === "undefined") return
    const ok = localStorage.getItem("valerie-admin-ok") === "1"
    if (!ok) {
      router.replace("/admin-login")
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // Charge les biens seulement après vérification d'accès
  useEffect(() => {
    if (!authChecked) return
    console.log("API_BASE =", API_BASE)
    fetch(`${API_BASE}/api/proprietes`)
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setProperties(data) : setProperties([])))
      .catch((err) => console.error("Erreur fetch propriétés:", err))
  }, [authChecked])

  const addProperty = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/proprietes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          price: price.trim(),
          city: city.trim(),
          image: image.trim(),
          rooms: rooms ? Number(rooms) : undefined,
          area: area ? Number(area) : undefined,
          floor: floor ? Number(floor) : undefined,
          hasParking,
          description: description.trim(),
        }),
      })
      const property: Property = await res.json()
      setProperties((prev) => [property, ...prev])

      setTitle("")
      setPrice("")
      setCity("")
      setImage("")
      setRooms("")
      setArea("")
      setFloor("")
      setHasParking(false)
      setDescription("")
    } catch (err) {
      console.error("Erreur ajout bien:", err)
      alert("Erreur lors de l'ajout du bien")
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id: string) => {
    const prop = properties.find((p) => p.id === id)
    if (!prop) return
    if (!confirm(`Supprimer "${prop.title}" ?`)) return

    try {
      await fetch(`${API_BASE}/api/proprietes/${id}`, {
        method: "DELETE",
      })
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Erreur suppression bien:", err)
      alert("Erreur lors de la suppression")
    }
  }

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
        <h1 className="text-4xl font-bold">Admin Valérie Invest</h1>
            <div className="flex gap-3">
             <button
                onClick={() => router.push("/admin/leads")}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
             >
              Voir les leads
            </button>
            <button
                onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("valerie-admin-ok")
                }
                router.replace("/admin-login")
                }}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
         Se déconnecter
    </button>
  </div>
</div>


        {/* Formulaire ajout */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">➕ Ajouter un bien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Titre (ex: Neve Tzedek 3ch Luxe)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Prix (ex: 1.600.000 ₪)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Ville (ex: Tel aviv)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Image (ex: /uploads/neve-david.png)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Pièces (ex: 4)"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Surface (m²)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <input
              className="bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Étage"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={hasParking}
                onChange={(e) => setHasParking(e.target.checked)}
              />
              Parking
            </label>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full bg-white text-gray-900 border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              rows={3}
              placeholder="Description du bien (visible sur la carte et la page détail)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            onClick={addProperty}
            disabled={loading || !title.trim()}
            className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transition-all w-full md:w-auto"
          >
            {loading ? "Enregistrement..." : "✅ + Ajouter bien"}
          </button>
        </div>

        {/* Liste des biens */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🏠 Mes biens ({properties.length})
            </h2>
          </div>
          <div className="p-6">
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-xl font-semibold text-gray-700 mb-2">Aucun bien</p>
                <p className="text-gray-500">Ajoutez votre premier bien ci-dessus.</p>
              </div>
            ) : (
              properties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                      {prop.title}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      📍 {prop.city} •{" "}
                      <span className="font-bold text-xl text-blue-600">{prop.price}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {prop.rooms ? `${prop.rooms} pièces` : ""}{" "}
                      {prop.area ? `• ${prop.area} m²` : ""}{" "}
                      {prop.floor ? `• {prop.floor}ᵉ étage` : ""}{" "}
                      {prop.hasParking ? "• Parking" : ""}
                    </p>
                    {prop.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {prop.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteProperty(prop.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md ml-4"
                  >
                    Supprimer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
