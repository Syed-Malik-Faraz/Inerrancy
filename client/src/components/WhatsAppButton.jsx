import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/918287791303" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] group"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 scale-150" />
      <div className="relative bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-300 group-hover:scale-110">
        <MessageCircle size={28} fill="white" />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black-2 border border-gold/20 px-4 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-2xl">
          <p className="text-ivory font-body text-xs font-semibold tracking-wider uppercase">Chat with an Expert</p>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
