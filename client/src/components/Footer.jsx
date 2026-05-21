import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Collection',
      links: [
        { label: 'Shop All', path: '/shop' },
        { label: 'Best Sellers', path: '/shop?collection=Best Sellers' },
        { label: 'New Arrivals', path: '/shop?collection=New Arrivals' },
        { label: 'Gift Sets', path: '/shop?collection=Gift Sets' },
        { label: 'Our Story', path: '/about' },
      ],
    },
    {
      title: 'Concierge',
      links: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'Shipping Policy', path: '/shipping' },
        { label: 'Return Policy', path: '/returns' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Track Order', path: '/orders' },
      ],
    },
  ];

  return (
    <footer className="bg-black-2 border-t border-gold/10 pt-24 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex flex-col group">
              <img
                src="/Inerrancy-logo.jpeg"
                alt="Inerrancy Logo"
                className="h-[44px] md:h-16 w-auto mb-2 object-contain group-hover:opacity-90 transition-opacity"
              />
              <span className="font-heading text-4xl tracking-[6px] text-gold group-hover:text-gold-light transition-colors">
                INERRANCY
              </span>
              <span className="text-[10px] tracking-[4px] text-gold/40 uppercase font-body mt-2">
                Middle Eastern Excellence
              </span>
            </Link>
            <p className="text-ivory/50 text-sm leading-loose max-w-sm italic font-heading">
              "Witness the majestic journey through the ancient oud trails of the Middle East. Authenticity in every seal."
            </p>
            <div className="flex gap-5">
              {[FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold transition-all duration-500">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading text-2xl text-gold mb-12 tracking-wide font-medium">{section.title}</h4>
              <ul className="flex flex-col gap-5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-ivory/50 text-sm hover:text-gold transition-colors block underline-gold w-fit">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get in Touch */}
          <div>
            <h4 className="font-heading text-2xl text-gold mb-12 tracking-wide font-medium">Liaison</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4 text-ivory/50">
                <MapPin size={18} className="text-gold mt-1 shrink-0" />
                <span className="text-sm leading-relaxed">DLF Cyber City, Tower 10,<br />Gurgaon, HR 122002</span>
              </li>
              <li className="flex items-center gap-4 text-ivory/50">
                <Phone size={18} className="text-gold shrink-0" />
                <span className="text-sm">+91 82877 91303</span>
              </li>
              <li className="flex items-center gap-4 text-ivory/50">
                <Mail size={18} className="text-gold shrink-0" />
                <span className="text-sm tracking-wider">concierge@inerrancy.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter / Divider */}
        <div className="border-y border-gold/5 py-14 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-3 text-center lg:text-left">
            <h5 className="font-heading text-2xl text-ivory tracking-wide">Enter the Inerrancy Vault</h5>
            <p className="text-ivory/30 text-[10px] tracking-[4px] uppercase">Subscribe for olfactory narratives and private releases</p>
          </div>
          <div className="flex w-full lg:w-auto min-w-[320px] max-w-lg relative group">
            <input 
              type="email" 
              placeholder="THE@MAISON.COM" 
              className="bg-transparent border border-gold/10 px-6 py-4 text-[10px] tracking-[4px] outline-none focus:border-gold/40 transition-all grow text-ivory uppercase"
            />
            <button className="bg-gold text-black px-10 py-4 text-[11px] font-bold tracking-[3px] uppercase hover:bg-gold-light transition-all">
              ENGAGE
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] tracking-[5px] text-ivory/20 uppercase text-center md:text-left font-bold">
              © {currentYear} INERRANCY — THE HOUSE OF AUTHENTIC LUXURY.
            </p>
            <p className="text-[8px] tracking-[3px] text-ivory/10 uppercase text-center md:text-left">
              India's Premier Destination for Middle Eastern Fragrances
            </p>
          </div>
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service', 'Cookie Vault'].map((txt) => (
              <a key={txt} href="#" className="text-[10px] tracking-[3px] text-ivory/20 uppercase hover:text-gold transition-colors font-bold">
                {txt}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
