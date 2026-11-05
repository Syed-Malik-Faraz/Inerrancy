
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bell,
  ShieldCheck
} from 'lucide-react';

const UpcomingCategoryPage = ({
  categoryName,
  categorySubtitle,
  categoryDesc,
  tag,
  image
}) => {
  return (
    <div className="bg-black min-h-[85vh] flex items-center justify-center relative overflow-hidden py-20 md:py-24">

      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container max-w-5xl text-center relative z-10 px-5 md:px-6">

        {/* Category Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/20 bg-black-2/60 backdrop-blur-md mb-8">
          <Sparkles size={14} className="text-gold" />
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold">
            INERRANCY — {tag || 'CURATED DIVISION'}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl text-ivory tracking-wide mb-6">
          {categoryName}
        </h1>

        <p className="font-heading text-lg md:text-2xl text-gold italic font-light tracking-wider mb-6">
          "{categorySubtitle}"
        </p>

        <div className="h-0.5 w-16 bg-gold/40 mx-auto mb-10" />

        {/* Description */}
        <p className="text-ivory/60 text-sm md:text-base font-body leading-relaxed max-w-2xl mx-auto mb-12">
          {categoryDesc}
        </p>

        {/* Promotional Image */}
        {image && (
          <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="rounded-xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/5">
              <img
                src={image}
                alt="Inerrancy Greece 2027 Seasonal Work Program"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="max-w-md mx-auto bg-black-2/80 border border-gold/20 rounded-lg p-8 backdrop-blur-md mb-12 shadow-2xl">
          <span className="text-[11px] font-bold tracking-[5px] text-gold uppercase block mb-3 animate-pulse">
            ✦ {image ? 'REGISTRATIONS OPEN' : 'LAUNCHING SOON'} ✦
          </span>

          <p className="text-ivory/70 text-xs tracking-widest uppercase font-light">
            {image
              ? 'Explore international opportunities with Inerrancy Consultancy. Contact our team for more information.'
              : 'Inerrancy is currently curating this collection under our strict discipline of perfection.'
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

          <Link
            to="/contact"
            className="btn btn-primary px-10 h-14 group"
          >
            {image ? 'CONTACT CONSULTANCY' : 'EXPLORE FRAGRANCES'}
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* <Link
            to="/shop?category=Fragrance"
            className="btn btn-outline px-10 h-14 text-ivory/80 hover:text-gold"
          >
            EXPLORE FRAGRANCES
          </Link> */}

        </div>
      </div>
    </div>
  );
};


// SPORTS PAGE
export const SportsCategoryPage = () => (
  <UpcomingCategoryPage
    categoryName="Sports & Memorabilia"
    categorySubtitle="Precision in Athletics. Authentic Legacy."
    categoryDesc="An exclusive vault of rare, authenticated sports collectibles and athletic memorabilia. Crafted for collectors who demand provenance and perfection."
    tag="SPORTS DIVISION"
  />
);


// MULTIMEDIA PAGE
export const MultimediaCategoryPage = () => (
  <UpcomingCategoryPage
    categoryName="Multimedia & Technology"
    categorySubtitle="Design Print. Digital Media. Chatbot Tech."
    categoryDesc="Empowering modern expression with bespoke print designs, interactive digital media experiences, and next-generation luxury Chatbot AI interfaces."
    tag="MULTIMEDIA DIVISION"
  />
);


// CONSULTANCY PAGE
export const ConsultancyCategoryPage = () => (
  <UpcomingCategoryPage
    categoryName="Consultancy"
    categorySubtitle="Global Opportunities. A Better Tomorrow."
    categoryDesc="Your gateway to international opportunities. Explore overseas employment programs, professional guidance, and global career pathways with Inerrancy Consultancy."
    tag="GLOBAL CONSULTANCY"
    image="/consultancy-greece-2027.jpeg"
  />
);
