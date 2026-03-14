import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1600" 
            alt="Beldi Heritage" 
            className="w-full h-full object-cover grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-wood/40" />
        </div>
        <div className="relative text-center space-y-6 px-6">
          <span className="text-gold font-bold uppercase tracking-[0.4em] text-[12px] block">A Legacy of Craft</span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-cream font-bold leading-tight max-w-4xl mx-auto">
            The Spirit of <br/> Beldi Concept
          </h1>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-8">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">Since 1984</span>
              <h2 className="font-heading text-4xl md:text-5xl text-wood font-bold leading-tight">ROOTED IN TRADITION. <br/> DESIGNED FOR TODAY.</h2>
              <p className="text-wood/70 text-lg leading-relaxed">
                Beldi Ameublement was born from a passion for Moroccan craftsmanship and a desire to bring its beauty into contemporary homes. Our name—<em>Beldi</em>—evokes the authentic, the handcrafted, and the rooted in tradition.
              </p>
              <p className="text-wood/70 text-lg leading-relaxed">
                What started as a small workshop in the heart of Marrakech has evolved into a global bridge for artisanal excellence. We don't just sell furniture; we preserve a heritage that has been passed down through generations of master woodworkers, metal smiths, and weavers.
              </p>
           </div>
           <div className="flex flex-col gap-8">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-premium">
                 <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800" alt="Workshop Heritage" className="w-full h-full object-cover" />
              </div>
           </div>
        </div>
      </section>

      {/* Craft Values */}
      <section className="bg-beige/30 py-32">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center space-y-4 mb-20">
              <h2 className="font-heading text-4xl text-wood font-bold">Our Commitment to Craft</h2>
              <div className="w-20 h-1 bg-gold mx-auto" />
           </div>
           
           <div className="grid md:grid-cols-3 gap-16">
              {[
                { title: 'Authentic Sourcing', desc: 'Every piece of cedar, oak, and brass is sourced sustainably from local cooperatives.' },
                { title: 'Ancestral Methods', desc: 'No mass production. We use interlocking joinery and hand-carving techniques only.' },
                { title: 'Ethical Partnership', desc: 'Empowering over 50 master artisans with fair wages and safe creative environments.' }
              ].map((v, i) => (
                <div key={i} className="space-y-4 text-center">
                    <div className="text-gold font-bold text-lg italic">Value 0{i+1}</div>
                    <h3 className="font-heading text-2xl text-wood font-bold">{v.title}</h3>
                    <p className="text-wood/60 leading-relaxed">{v.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* The Atelier Section */}
      <section className="max-w-7xl mx-auto px-6 py-40">
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-premium">
                   <img src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=800" alt="Master Artisan" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-10 -right-10 glass-panel p-10 rounded-full w-48 h-48 flex flex-col items-center justify-center text-center shadow-xl">
                   <span className="text-gold text-2xl font-bold">50+</span>
                   <span className="text-wood/60 text-[10px] uppercase font-bold tracking-widest leading-tight">Master <br/> Artisans</span>
                </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
                <h2 className="font-heading text-4xl md:text-5xl text-wood font-bold leading-tight">Where Every Piece Tells a Story</h2>
                <p className="text-wood/70 text-lg leading-relaxed">
                  Our atelier is a sanctuary of silence and precision. Here, raw materials meet centuries-old skill. Each carved motif and hand-forged hinge is a fingerprint of the artisan who created it, ensuring no two pieces are ever identical.
                </p>
                <div className="pt-8">
                   <Link to="/contact" className="premium-button bg-wood text-cream">Visit Our Atelier</Link>
                </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="bg-wood py-24 text-center space-y-10">
         <h2 className="font-heading text-4xl text-cream font-bold">Bring the Legacy Home</h2>
         <Link to="/products" className="premium-button bg-gold text-wood mx-auto px-12">Discover the Collection</Link>
      </section>
    </div>
  );
}
