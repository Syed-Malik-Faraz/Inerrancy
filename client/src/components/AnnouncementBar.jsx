import React from 'react';

const AnnouncementBar = () => {
  const announcements = [
    "India's Official Destination for Middle Eastern Excellence",
    "Shop for ₹1999 and Receive a Fragrance, Complimentary",
    "Get 5% Cashback on Every Order — Instantly!",
  ];

  return (
    <div className="h-10 bg-gold text-black flex items-center overflow-hidden fixed top-0 w-full z-50">
      <div className="animate-marquee whitespace-nowrap flex font-body text-[10px] font-bold uppercase tracking-[2px]">
        {[...announcements, ...announcements].map((text, i) => (
          <span key={i} className="mx-12 shrink-0">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
