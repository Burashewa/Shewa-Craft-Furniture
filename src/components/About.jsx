import { ArrowRight } from "lucide-react";

export function About() {
  return (
    <main className="mt-16">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?auto=format&fit=crop&w=1080&q=80"
          alt="ShewaCraft Furniture workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl sm:text-6xl mb-6">About ShewaCraft</h1>
            <p className="text-lg text-white/90">
              Crafting timeless furniture that blends tradition, comfort,
              and modern design.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              ShewaCraft Furniture was founded with a simple belief:
              furniture should be more than functional — it should tell
              a story, create comfort, and last for generations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Inspired by Ethiopian craftsmanship and refined with
              modern design principles, each piece we create reflects
              quality, care, and attention to detail.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?auto=format&fit=crop&w=1080&q=80"
            alt="Furniture craftsmanship"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every ShewaCraft piece is built around values that define
              who we are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Craftsmanship",
                desc: "We use premium materials and skilled artisans to ensure durability and elegance."
              },
              {
                title: "Timeless Design",
                desc: "Our furniture blends modern aesthetics with classic comfort."
              },
              {
                title: "Customer First",
                desc: "Your satisfaction drives every decision we make."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">
            Experience ShewaCraft
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Discover furniture designed to elevate your living and
            working spaces with comfort and character.
          </p>
          <a
            href="../../Products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
