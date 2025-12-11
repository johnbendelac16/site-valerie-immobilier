"use client"

import { useState } from "react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"


export default function ContactFinal() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [budget, setBudget] = useState("")
  const [projectType, setProjectType] = useState("achat")
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const emailTrim = email.trim()
    const phoneTrim = phone.trim()

    if (!emailTrim && !phoneTrim) {
      alert("Merci d'indiquer au moins un moyen de contact : email ou téléphone.")
      return
    }

    setSending(true)
    setSent(false)
    try {
      await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: emailTrim,
          phone: phoneTrim,
          city: city.trim(),        // compat ancien schéma
          budget: budget.trim(),
          message: message.trim(),
          // nouveaux champs enrichis
          cities: city.trim(),      // texte libre "Tel Aviv, Jérusalem"
          projectType,              // "achat", "location", etc.
          timeline: timeline.trim(),// "urgent", "3 mois", date...
          source: "contact-final-home",
        }),
      })
      setName("")
      setEmail("")
      setPhone("")
      setCity("")
      setBudget("")
      setProjectType("achat")
      setTimeline("")
      setMessage("")
      setSent(true)
    } catch (err) {
      console.error("Erreur envoi contact:", err)
      alert("Erreur lors de l'envoi du formulaire")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact-final" className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-center">
          Prêt à visiter ou à vendre ?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto text-center">
          Laissez vos coordonnées et quelques détails sur votre projet. Vous recevrez une réponse
          personnalisée rapidement.
        </p>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nom complet *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Téléphone / WhatsApp *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="achat">Projet d&apos;achat</option>
              <option value="location">Projet de location</option>
              <option value="achat_location">Achat + location</option>
              <option value="vente">Vente d&apos;un bien</option>
              <option value="mise_en_location">Mise en location (propriétaire)</option>
            </select>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Ville(s) souhaitée(s)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Budget (ex: 2.500.000 ₪ ou 8 000 ₪ / mois)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2"
              placeholder="Délai / date d'entrée souhaitée"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Parlez-moi de votre projet (profil, type de bien, questions...)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {sent && (
            <p className="text-sm text-green-600">
              Merci, votre message a bien été envoyé. Vous serez contacté rapidement.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <button
              type="submit"
              disabled={
                sending ||
                !name.trim() ||
                (!email.trim() && !phone.trim())
              }
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg w-full sm:w-auto text-center"
            >
              {sending ? "Envoi..." : "Envoyer mon projet"}
            </button>
            <div className="flex gap-3">
              <a
                href="https://wa.me/972537081641"
                className="bg-green-500 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 shadow w-full sm:w-auto text-center"
              >
                WhatsApp direct
              </a>
              <a
                href="tel:+972537081641"
                className="bg-white text-blue-700 border border-blue-400 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 shadow w-full sm:w-auto text-center"
              >
                Appeler
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
