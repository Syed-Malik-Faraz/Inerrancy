import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import AnnouncementBar from '../components/AnnouncementBar';
import api from '../api/axios';
import { ShieldCheck, Zap, Globe, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newArrivalsRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products?sort=-createdAt&limit=4')
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setNewArrivals(newArrivalsRes.data.products);
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const brands = ['Lattafa', 'Ahmed Al Maghribi', 'Afnan', 'Khadlaj', 'Sapil', 'Swiss Essences'];
  const fragranceFamilies = [
    { name: 'Sweet', img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80' },
    { name: 'Fresh', img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80' },
    { name: 'Woody', img: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=400&q=80' },
    { name: 'Floral', img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80' },
    { name: 'Fruity', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80' },
    { name: 'Aqua', img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80' },
  ];

  const categories = [
    { name: 'FOR HIM', link: '/shop?category=Men', bg: '/men-perfume.jpg' },
    { name: 'FOR HER', link: '/shop?category=Women', bg: '/woman-spraying-perfume.jpg' },
    { name: 'FOR BOTH', link: '/shop?category=Unisex', bg: '/men-women-perfume.jpg' },
  ];

  return (
    <div className="bg-black text-ivory">
      <HeroCarousel />

      {/* Brand Manifesto Section */}
      <section className="py-24 bg-gradient-to-b from-black via-black-2 to-black border-b border-gold/10">
        <div className="container max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <span className="section-label tracking-[6px] text-gold/80 flex items-center gap-2">
              <Sparkles size={18} className="text-gold" />
              THE PHILOSOPHY OF INERRANCY
              <Sparkles size={18} className="text-gold" />
            </span>
          </div>

          <h2 className="font-heading text-4xl lg:text-6xl text-ivory mb-8 tracking-wide leading-tight">
            Perfection is Not Abundance — <span className="italic text-gold">It is Precision.</span>
          </h2>

          <div className="h-0.5 w-16 bg-gold/40 mx-auto mb-10" />

          <p className="font-heading text-xl lg:text-2xl text-ivory/80 italic font-light leading-relaxed mb-12">
            "Inerrancy is conceived from an uncompromising pursuit of olfactory precision—where every material has a purpose, every accord has a place, and every detail exists in exact proportion."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gold/10">
            <div className="p-10 bg-black-2/50 border border-gold/10 rounded-sm mt-10">
              <span className="text-gold font-bold text-xs uppercase tracking-[3px] block mb-2">Nothing Accidental</span>
              <p className="text-ivory/60 text-xs leading-relaxed font-light">Rare ingredients and considered contrasts in immaculate balance.</p>
            </div>

            <div className="p-10 bg-black-2/50 border border-gold/10 rounded-sm mt-10">
              <span className="text-gold font-bold text-xs uppercase tracking-[3px] block mb-2">Nothing Excessive</span>
              <p className="text-ivory/60 text-xs leading-relaxed font-light">Elegance that reveals itself gradually, intimately, and with unmistakable presence.</p>
            </div>

            <div className="p-10 bg-black-2/50 border border-gold/10 rounded-sm mt-10">
              <span className="text-gold font-bold text-xs uppercase tracking-[3px] block mb-2">Nothing Less Than Exact</span>
              <p className="text-ivory/60 text-xs leading-relaxed font-light">A scent composed with conviction. A signature that is remembered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Gender Selection */}
      <section className="section-lg overflow-hidden !py-10">
        <div className="container lg:px-0 grid grid-cols-1 md:grid-cols-3 h-[600px] md:h-[650px]">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.link}
              className="group relative flex items-center justify-center overflow-hidden border-r border-gold/10 last:border-0"
            >
              <img src={cat.bg} alt={cat.name} className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale transition-all duration-[2000ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75" />
              <div className="relative z-10 text-center animate-fade-in transition-transform duration-500 group-hover:scale-110">
                <span className="section-label mb-2 block">{cat.name}</span>
                <h3 className="font-heading text-4xl lg:text-5xl tracking-widest group-hover:text-gold transition-colors">THE ESSENCE</h3>
              </div>
              <div className="absolute inset-0 border-[40px] border-black/0 group-hover:border-black/20 transition-all duration-700 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            <h2 className="section-title">The House of Luxury Perfumes</h2>
            <div className="gold-divider" />
          </div>
          <Link to="/shop" className="btn btn-outline flex items-center gap-4 group h-14 px-8">
            DISCOVER ALL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[3/4] skeleton rounded-lg" />
                <div className="h-6 skeleton w-3/4 mx-auto" />
                <div className="h-4 skeleton w-1/2 mx-auto" />
              </div>
            ))
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Fragrance Family Tiles */}
      {/* <section className="section bg-black-2">
        <div className="container mb-24 text-center">
          <span className="section-label">OLFACTORY JOURNEYS</span>
          <h2 className="section-title">Fragrance Families</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {fragranceFamilies.map((fam, i) => (
            <Link
              key={i}
              to={`/shop?fragranceFamily=${fam.name}`}
              className="group relative h-64 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-500 hover:shadow-gold"
            >
              <img src={fam.img} alt={fam.name} className="absolute inset-0 w-full h-full object-cover brightness-50 transition-transform duration-700 group-hover:scale-110" />
              <div className="relative z-10 text-center">
                <span className="text-ivory font-heading text-2xl tracking-widest group-hover:text-gold transition-colors">{fam.name}</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </Link>
          ))}
        </div>
      </section> */}

      {/* Brand Value Section */}
      <section className="section bg-black border-y border-gold/10">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-24 lg:gap-12">
          {[
            { Icon: ShieldCheck, title: 'Auth Verified', desc: 'Leading exclusive supplier for luxury perfume houses. Factory-sealed excellence.' },
            { Icon: Zap, title: 'Extreme Longevity', desc: 'High-concentration luxury fragrances known for incredible sillage and 24h+ trails — the discipline of perfection in every bottle.' },
            { Icon: Globe, title: 'Global Selection', desc: 'The largest portfolio in India. Access world-class luxury perfumes right from your doorstep.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center text-gold mb-8 transition-all duration-500 group-hover:bg-gold-muted group-hover:border-gold">
                <item.Icon size={32} />
              </div>
              <h4 className="font-heading text-2xl text-ivory mb-4 tracking-wide uppercase">{item.title}</h4>
              <p className="text-ivory/60 text-sm leading-relaxed max-w-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
