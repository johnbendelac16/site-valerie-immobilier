import Image from 'next/image'

export default function Home() {
  const properties = [
    { 
      id: 1,
      title: "Neve Tzedek 3ch",
      price: "4.2M ₪",
      city: "Tel Aviv",
      image: "/images/maison1.webp"
    },
    { id: 2,
      title: "Jérusalem Centre",
      price: "2.8M ₪",
      city: "Jérusalem",
      image: "/images/maison2.jpg"
    }
  ]

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Valérie Invest</h1>
          <p className="text-xl mb-8">Biens exclusifs olim français - Agent licencié</p>
          <a href="#proprietes" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold">Voir exclusivités</a>
        </div>
      </section>

      <section id="proprietes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mes exclusivités</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl">
                <Image src={prop.image} alt={prop.title} width={400} height={300} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                  <p className="text-lg text-gray-600 mb-2">{prop.city}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{prop.price}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Contact WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
