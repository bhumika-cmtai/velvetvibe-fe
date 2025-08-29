import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactForm } from "@/components/ContactForm"
import { SectionTitle } from "@/components/SectionTitle"
import { Gem, MapPin } from "lucide-react"

export default function CustomizePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="py-10">
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Your Vision, Our Craftsmanship"
            subtitle="Let's bring your unique jewelry idea to life. Fill out the form with your concept, and our artisans will get in touch to begin the creation process."
            className="mb-12 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* The informational card, moved from the homepage */}
            <div className="space-y-4 text-center bg-gray-50 p-12 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <Gem className="h-12 w-12 text-[#A77C38]" strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-bold font-serif text-[#A77C38]">
                Commission Your Masterpiece
              </h3>
              <p className="text-lg leading-relaxed text-gray-600 max-w-md mx-auto">
                From a simple sketch to a cherished idea, our artisans will bring your unique vision to life.
              </p>
              <p className="text-lg font-medium text-gray-800 pt-2">
                Describe your ideal piece in the form to begin.
              </p>
            </div>
            
            {/* The contact form, moved from the homepage */}
            <div>
              <ContactForm />
            </div>

          </div>

          {/* Address */}
          <div className="mt-10">
            <div className="max-w-3xl mx-auto space-y-4 text-center bg-gray-50 p-12 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <MapPin className="h-12 w-12 text-[#A77C38]" strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-bold font-serif text-[#A77C38]">
                Visit Our Showroom
              </h3>
              <p className="text-xl leading-relaxed text-gray-700">
                Shop No. 12, MC NO.181/2225, Shri Ram Market, Gali Kunj,<br />
                Dariba Kalan, Chandni Chowk, Delhi - 110006
              </p>
            </div>
          </div>


        </section>
      </main>

      <Footer />
    </div>
  )
}