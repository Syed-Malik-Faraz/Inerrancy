import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay, Parallax } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: '/Arabian-perfume-home.jpg',
    subtitle: 'THE ART OF ARABIAN PERFUMERY',
    title: 'Middle Eastern Excellence',
    desc: 'Discover original factory-sealed masterpieces from the most prestigious houses of Dubai.',
    cta: 'EXPLORE COLLECTION',
    link: '/shop?category=Men',
  },
  {
    image: '/Oud-perfume-home.jpg',
    subtitle: 'NIGHTTIME SEDUCTION',
    title: 'The Oud Collection',
    desc: 'Deep, mysterious, and profoundly luxurious. Experience the primitive power of pure oud.',
    cta: 'SHOP THE DROP',
    link: '/shop?fragranceFamily=Woody',
  },
  {
    image: '/Gift-set-home.jpg',
    subtitle: 'GIFTING PERFECTION',
    title: 'Ethereal Gift Sets',
    desc: 'Celebrate your loved ones with curated olfactory journeys. Elegance in every bottle.',
    cta: 'VIEW ALL SETS',
    link: '/shop?collection=Gift Sets',
  },
];

const HeroCarousel = () => {
  return (
    <div className="h-[85vh] lg:h-screen w-full relative group overflow-hidden ">
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay, Parallax]}
        effect="fade"
        speed={1000}
        parallax={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, renderBullet: (idx, cls) => `<span class="${cls}"></span>` }}
        navigation={{
          nextEl: '.swiper-btn-next',
          prevEl: '.swiper-btn-prev',
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-black">
            {/* Image Layer */}
            <div 
              className="absolute inset-0 z-0 brightness-75 transition-transform duration-[4000ms] group-[.swiper-slide-active]:scale-110"
              data-swiper-parallax="20%"
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            </div>

            {/* Content Layer */}
            <div className="container relative h-full flex items-center z-20">
              <div className="max-w-2xl">
                <p 
                  className="section-label text-gold drop-shadow-lg mb-6 leading-none"
                  data-swiper-parallax="-300"
                >{slide.subtitle}</p>
                <h2 
                  className="font-heading text-5xl lg:text-8xl text-ivory mb-8 leading-[1.1]"
                  data-swiper-parallax="-500"
                >{slide.title}</h2>
                <div 
                  className="h-1 w-24 bg-gold mb-10 transition-all duration-1000 origin-left"
                  data-swiper-parallax="-400"
                />
                <p 
                  className="text-ivory/80 text-lg lg:text-xl max-w-lg mb-12 font-light leading-relaxed font-body"
                  data-swiper-parallax="-600"
                >{slide.desc}</p>
                <Link 
                  to={slide.link} 
                  className="btn btn-primary btn-lg inline-flex items-center gap-3 transition-all duration-500 hover:gap-6"
                  data-swiper-parallax="-700"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <button className="swiper-btn-prev absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-gold/20 flex items-center justify-center text-ivory hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100 hidden lg:flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="swiper-btn-next absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-gold/20 flex items-center justify-center text-ivory hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100 hidden lg:flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </Swiper>

      {/* CSS for custom pagination bullets in Swiper */}
      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.3);
          opacity: 1;
          margin: 0 8px !important;
          transition: all 0.3s;
          border-radius: 0;
          transform: rotate(45deg);
        }
        .swiper-pagination-bullet-active {
          background: #C9A84C;
          width: 12px;
          height: 12px;
          box-shadow: 0 0 10px #C9A84C;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
