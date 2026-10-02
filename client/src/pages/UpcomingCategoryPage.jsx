import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bell, ShieldCheck } from 'lucide-react';

const UpcomingCategoryPage = ({ categoryName, categorySubtitle, categoryDesc, tag }) => {
  return (
    <div className="bg-black min-h-[85vh] flex items-center justify-center relative overflow-hidden py-24">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="container max-w-4xl text-center relative z-10 px-6">
        {/* Category Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/20 bg-black-2/60 backdrop-blur-md mb-8">
          <Sparkles size={14} className="text-gold" />
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold">
            INERRANCY — {tag || 'CURATED DIVISION'}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-5xl lg:text-7xl text-ivory tracking-wide mb-6">
          {categoryName}
        </h1>

        <p className="font-heading text-xl lg:text-2xl text-gold italic font-light tracking-wider mb-6">
          "{categorySubtitle}"
        </p>

        <div className="h-0.5 w-16 bg-gold/40 mx-auto mb-10" />

        <p className="text-ivory/60 text-sm lg:text-base font-body leading-relaxed max-w-2xl mx-auto mb-12">
          {categoryDesc}
        </p>

        {/* Status Card */}
        <div className="max-w-md mx-auto bg-black-2/80 border border-gold/20 rounded-lg p-8 backdrop-blur-md mb-12 shadow-2xl">
          <span className="text-[11px] font-bold tracking-[5px] text-gold uppercase block mb-3 animate-pulse">
            ✦ LAUNCHING SOON ✦
          </span>
          <p className="text-ivory/70 text-xs tracking-widest uppercase font-light">
            Inerrancy is currently curating this collection under our strict discipline of perfection.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/shop?category=Fragrance" className="btn btn-primary px-10 h-14 group">
            EXPLORE FRAGRANCES <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="btn btn-outline px-10 h-14 text-ivory/80 hover:text-gold">
            INQUIRE EARLY ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
};

export const SportsCategoryPage = () => (
  <UpcomingCategoryPage
    categoryName="Sports & Memorabilia"
    categorySubtitle="Precision in Athletics. Authentic Legacy."
    categoryDesc="An exclusive vault of rare, authenticated sports collectibles and athletic memorabilia. Crafted for collectors who demand provenance and perfection."
    tag="SPORTS DIVISION"
  />
);

export const MultimediaCategoryPage = () => (
  <UpcomingCategoryPage
    categoryName="Multimedia & Technology"
    categorySubtitle="Design Print. Digital Media. Chatbot Tech."
    categoryDesc="Empowering modern expression with bespoke print designs, interactive digital media experiences, and next-generation luxury Chatbot AI interfaces."
    tag="MULTIMEDIA DIVISION"
  />
);
