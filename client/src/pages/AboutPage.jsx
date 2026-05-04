import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Zap, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">
        
        {/* Hero Section */}
        <section className="mb-32 text-center animate-fade-in">
           <span className="section-label">OUR LEGACY</span>
           <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-12 tracking-wide leading-tight">Authenticity. <br /> Mastery. Excellence.</h1>
           <div className="h-1 w-20 bg-gold mx-auto mb-16" />
           <p className="font-heading text-2xl lg:text-3xl italic text-ivory/60 max-w-4xl mx-auto leading-relaxed font-light">
             "Inerrancy was founded on a singular obsession: to bring the true masterpieces of Middle Eastern perfumery to the Indian connoisseur, untouched and in their purest form."
           </p>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
           <div className="relative group overflow-hidden rounded-2xl border border-gold/10 aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1000&q=80" 
                className="w-full h-full object-cover grayscale transition-transform duration-[5000ms] group-hover:scale-110 group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-gold/5 blur-3xl -z-10 group-hover:bg-gold/10 transition-all duration-500" />
           </div>
           
           <div className="space-y-12 animate-fade-in translate-up">
              <div>
                 <h2 className="font-heading text-4xl text-ivory mb-6 tracking-wide">The House of Inerrancy</h2>
                 <p className="text-ivory/60 leading-loose text-lg font-light italic mb-8">
                    "In an era of dilutions and imitations, we stand as the definitive bastion of the factory-sealed original."
                 </p>
                 <div className="space-y-6 text-ivory/40 leading-loose uppercase tracking-[2px] text-xs">
                    <p>Inerrancy is India's premier destination for original, factory-sealed luxury fragrances from the most prestigious houses of the Middle East, including Lattafa, Ahmed Al Maghribi, Afnan, Rasasi, and Swiss Arabian.</p>
                    <p>Our journey began with a realization: that the fragrance market in India was saturated with unverified 'testers' and decants. We committed ourselves to an entirely different path — one of absolute integrity.</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gold/10">
                 <div>
                    <h4 className="text-gold font-bold text-4xl mb-2">1,500+</h4>
                    <span className="text-[10px] text-ivory/30 tracking-[3px] uppercase">Unique Essences</span>
                 </div>
                 <div>
                    <h4 className="text-gold font-bold text-4xl mb-2">100%</h4>
                    <span className="text-[10px] text-ivory/30 tracking-[3px] uppercase">Factory Sealed</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Values Section */}
        <section className="bg-black-2 border border-gold/10 p-12 lg:p-24 rounded-3xl mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-full bg-gold/5 blur-[120px] rounded-full -z-10" />
           
           <div className="text-center mb-20">
              <span className="section-label">OUR PHILOSOPHY</span>
              <h2 className="section-title">Why the Circle Choose Us</h2>
              <div className="gold-divider" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { 
                  Icon: ShieldCheck, 
                  title: 'Definitively Authentic', 
                  desc: 'Every single bottle in our vault is a factory-sealed original. We strictly refuse testers or unsealed units, ensuring your essence is exactly as the perfumer intended.' 
                },
                { 
                  Icon: Globe, 
                  title: 'Official Partnership', 
                  desc: 'As one of India\'s leading exclusive suppliers, we maintain close relationships with Middle Eastern houses, giving our clients access to the largest and latest portfolio.' 
                },
                { 
                  Icon: Zap, 
                  title: 'Extreme Performance', 
                  desc: 'We specialize in high-concentration Arabian fragrances, curated for their legendary longevity and unmatched sillage that commands attention for 24 hours.' 
                }
              ].map((val, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                   <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold border border-gold/20 mb-10 transition-all group-hover:bg-gold group-hover:text-black">
                      <val.Icon size={32} />
                   </div>
                   <h4 className="font-heading text-2xl text-ivory mb-6 tracking-wide uppercase">{val.title}</h4>
                   <p className="text-ivory/60 text-sm leading-relaxed font-light">{val.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 relative">
           <h2 className="font-heading text-5xl lg:text-7xl text-gold mb-12 italic tracking-wide">Ready to find your <br /> signature masterpiece?</h2>
           <Link to="/shop" className="btn btn-primary btn-lg px-16 group">
              COMMENCE YOUR JOURNEY <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
           </Link>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
