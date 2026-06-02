import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import AnnouncementBar from '../components/AnnouncementBar';
import api from '../api/axios';
import { ShieldCheck, Zap, Globe, ArrowRight, Quote } from 'lucide-react';
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

  const brands = ['Lattafa', 'Ahmed Al Maghribi', 'Afnan', 'Khadlaj', 'Sapil', 'Swiss Arabian'];
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

      {/* Brands Scrolling Band */}
      {/* <section className="py-20 border-y border-gold/10 bg-black-2">
        <div className="flex overflow-hidden relative">
          <div className="flex animate-marquee hover:pause whitespace-nowrap py-4">
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <Link 
                key={i} 
                to={`/shop?brand=${brand}`}
                className="mx-20 text-sm lg:text-md tracking-[6px] uppercase font-bold text-ivory/10 hover:text-gold transition-all duration-500"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="section container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
            {/* <span className="section-label">THE SHARAYA DROP</span> */}
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
      <section className="section bg-black-2">
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
      </section>

      {/* Brand Value Section */}
      <section className="section bg-black border-y border-gold/10">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-24 lg:gap-12">
          {[
            { Icon: ShieldCheck, title: 'Auth Verified', desc: 'Leading exclusive supplier for Lattafa and Rasasi. Factory-sealed excellence.' },
            { Icon: Zap, title: 'Extreme Longevity', desc: 'High-concentration Arabian oils known for incredible sillage and 24h+ trails.' },
            { Icon: Globe, title: 'Global Selection', desc: 'The largest portfolio in India. Access the scent of Dubai from your doorstep.' }
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

      {/* Testimonials */}
      {/* <section className="section-sm bg-black-2 overflow-hidden border-t border-gold/10">
        <div className="container">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            className="pb-16"
          >
            {[
              { name: 'Sana Mishra', text: 'Finally, a reliable source in India for genuine Arabian oils. As the official supplier, Inerrancy delivers excellence every time.' },
              { name: 'Aryan Malik', text: 'The largest portfolio I\'ve seen under one roof. From viral Lattafa hits to niche Ahmed masterpieces, this is the destination.' },
              { name: 'Aditya S.', text: '100% authentic and they have everything. Even the rare stuff that\'s impossible to find elsewhere. Fast shipping.' }
            ].map((t, i) => (
              <SwiperSlide key={i} className="flex flex-col items-center text-center px-4">
                <Quote className="text-gold/20 mb-8" size={64} />
                <p className="font-heading text-2xl lg:text-3xl italic text-ivory/80 leading-relaxed max-w-3xl mb-10 translate-up">
                  {t.text}
                </p>
                <div className="flex flex-col items-center">
                  <div className="h-px w-12 bg-gold mb-4" />
                  <span className="text-gold text-xs font-bold tracking-[4px] uppercase">{t.name}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section> */}

    </div>
  );
};

export default HomePage;
