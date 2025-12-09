"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ContactFinal from "./components/ContactFinal"

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = "https://site-immo-backend.onrender.com"



interface Property {
  id: number | string
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

const CITIES = [
  "Tous",
  "Tel aviv",
  "Jerusalem",
  "Netanya",
  "Herzliya",
  "Raanana",
  "Ashdod",
  "Haifa",
]

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [cityFilter, setCityFilter] = useState<string>("Tous")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  useEffect(() => {
    console.log("API_BASE =", API_BASE)
    fetch(`${API_BASE}/api/proprietes`)
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setProperties(data) : setProperties([])))
      .catch((err) => console.error("Erreur fetch propriétés:", err))
  }, [])

  // filtres: min/max en millions, prix stocké affiché complet (1.600.000 ₪)
  const filtered = useMemo(() => {
    return properties.filter((prop) => {
      const numericString = prop.price
        .toString()
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(/,/g, "")
        .replace(/[^\d]/g, "")
      const priceNum = Number(numericString) || 0
      const priceMillions = priceNum / 1_000_000

      if (cityFilter !== "Tous" && prop.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false
      }
      if (minPrice && priceMillions < Number(minPrice)) return false
      if (maxPrice && priceMillions > Number(maxPrice)) return false
      return true
    })
  }, [properties, cityFilter, minPrice, maxPrice])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Valérie Invest
              <br />
              Immobilier pour olim français
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Appartements sélectionnés à Tel Aviv, Jérusalem et centre d&apos;Israël, avec
              accompagnement complet en français.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#proprietes"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                Voir mes exclusivités
              </a>
              <a
                href="https://wa.me/972XXXXXXXXX"
                className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition"
              >
                Parler sur WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 shadow-xl">
              <p className="text-sm uppercase tracking-wide text-blue-100 mb-3">
                Agent licencié • Rishion tivuch
              </p>
              <p className="text-lg">
                • Recherche de biens sur mesure pour familles francophones
                <br />
                • Négociation en hébreu et suivi avec avocat israélien
                <br />
                • Accompagnement avant, pendant et après l&apos;achat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres + propriétés */}
      <section id="proprietes" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Mes exclusivités
              </h2>
              <p className="text-gray-600">
                {properties.length} biens enregistrés, filtrez par ville et budget.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-4 items-center">
              {/* Filtres ville */}
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border ${
                      cityFilter === c
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {c === "Tous" ? "Toutes les villes" : c}
                  </button>
                ))}
              </div>
              {/* Filtres prix (en millions) */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min (M ₪)"
                  className="w-28 px-3 py-2 border rounded-lg text-sm"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max (M ₪)"
                  className="w-28 px-3 py-2 border rounded-lg text-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">
                Aucun bien disponible pour le moment
              </p>
              <p className="text-gray-400">Contactez-moi pour une recherche sur mesure.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">
                Aucun bien ne correspond à ces filtres.
              </p>
              <button
                onClick={() => {
                  setCityFilter("Tous")
                  setMinPrice("")
                  setMaxPrice("")
                }}
                className="text-blue-600 font-semibold underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((prop, index) => (
                <Link
                  key={prop.id.toString()}
                  href={`/propriete/${prop.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    {prop.image ? (
                      <img
                        src={prop.image.startsWith("/") ? prop.image : `/${prop.image}`}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">Pas d&apos;image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Exclusivité
                      </span>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          Nouveau
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6 md:p-7 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
                      {prop.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">{prop.city}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      {prop.rooms ? <span>{prop.rooms} pièces</span> : null}
                      {prop.area ? <span>• {prop.area} m²</span> : null}
                      {prop.floor ? <span>• {prop.floor}ᵉ étage</span> : null}
                      {prop.hasParking ? (
                        <span className="text-green-600">• Parking</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {prop.description && prop.description.trim().length > 0
                        ? prop.description
                        : "Appartement pour clientèle francophone, idéal pour investissement ou résidence principale."}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 leading-tight">
                      {prop.price}
                    </p>
                    <div className="mt-auto space-y-2">
                      <span className="block w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg text-center group-hover:bg-blue-700 group-hover:shadow-lg transition-all duration-200">
                        Voir le bien et contacter
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* À propos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">À propos de Valérie Invest</h2>
            <p className="text-gray-600 mb-4">
              Agent immobilier licencié en Israël, spécialisé dans l&apos;accompagnement des olim
              français pour l&apos;achat et la vente de biens à Tel Aviv, Jérusalem et dans tout
              le centre du pays.
            </p>
            <p className="text-gray-600">
              De la première visite jusqu&apos;à la signature chez l&apos;avocat, chaque étape est
              expliquée en français, avec un suivi personnalisé et transparent.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Pourquoi travailler avec moi ?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Sélection de biens adaptés aux profils francophones</li>
              <li>• Négociation en hébreu avec les vendeurs et agences locales</li>
              <li>• Réseau d&apos;avocats, banquiers et experts francophones</li>
              <li>• Disponibilité WhatsApp avant et après la transaction</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact final */}
      <ContactFinal/>
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Prêt à visiter ou à vendre ?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Décrivez votre projet (achat, vente, budget, ville) et recevez une réponse
            personnalisée rapidement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
            <a
              href="https://wa.me/972XXXXXXXXX"
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 shadow-lg w-full sm:w-auto text-center"
            >
              Écrire sur WhatsApp
            </a>
            <a
              href="tel:+972XXXXXXXXX"
              className="bg-white text-blue-700 border border-blue-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 shadow w-full sm:w-auto text-center"
            >
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
