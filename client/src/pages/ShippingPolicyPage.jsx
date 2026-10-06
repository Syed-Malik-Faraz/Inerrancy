import React, { useState } from 'react';
import { Truck, Clock, MapPin, CreditCard, Package, AlertTriangle, RefreshCw, ChevronDown, Mail } from 'lucide-react';

const sections = [
  {
    num: '01',
    Icon: Truck,
    title: 'Shipping Within India',
    body: 'We currently ship orders to most serviceable locations across India through reliable courier and logistics partners. Delivery availability may vary depending on the delivery PIN code and courier serviceability.',
  },
  {
    num: '02',
    Icon: Clock,
    title: 'Order Processing',
    body: null,
    bullets: [
      'Orders are generally processed within 1–2 business days after payment confirmation.',
      'Orders placed on Sundays or public holidays will be processed on the next business day.',
      'During sales, product launches, festive periods, or other high-volume periods, processing may take slightly longer.',
    ],
  },
  {
    num: '03',
    Icon: MapPin,
    title: 'Delivery Time',
    body: 'Once your order has been dispatched, estimated delivery times are:',
    bullets: [
      'Metro & major cities: 2–5 business days',
      'Other locations: 4–7 business days',
      'Remote areas: 5–10 business days',
    ],
    note: 'These are estimated timelines and may vary due to courier delays, weather conditions, public holidays, serviceability, or circumstances beyond our control.',
  },
  {
    num: '04',
    Icon: CreditCard,
    title: 'Shipping Charges',
    body: null,
    bullets: [
      'Shipping charges, if applicable, will be displayed at checkout before you complete your purchase.',
      'Any applicable free-shipping offer will be clearly mentioned on the website or at checkout.',
    ],
  },
  {
    num: '05',
    Icon: Package,
    title: 'Tracking Your Order',
    body: null,
    bullets: [
      'Once your order has been dispatched, you will receive a shipping confirmation with tracking details through the contact information provided during checkout.',
      'You can use the tracking information to follow the status of your shipment.',
    ],
  },
  {
    num: '06',
    Icon: AlertTriangle,
    title: 'Delayed Deliveries',
    body: 'While we make every effort to deliver orders within the estimated timeframe, delays may occasionally occur due to:',
    bullets: [
      'Weather or natural events',
      'Courier or logistics disruptions',
      'Public holidays',
      'Incorrect or incomplete address information',
      'Remote or hard-to-reach delivery locations',
      'Unforeseen operational circumstances',
    ],
    note: 'If your order is significantly delayed, please contact our customer support team with your order number.',
  },
  {
    num: '07',
    Icon: MapPin,
    title: 'Incorrect Address',
    body: null,
    bullets: [
      'Please ensure that your shipping address, PIN code, phone number, and other delivery details are accurate before placing your order.',
      'If an order is returned to us because of an incorrect or incomplete address, the order may be reshipped subject to applicable additional shipping charges.',
    ],
  },
  {
    num: '08',
    Icon: Package,
    title: 'Damaged or Tampered Packages',
    body: null,
    bullets: [
      'Please inspect your package at the time of delivery.',
      'If the package appears visibly damaged, opened, or tampered with, please document the condition of the package and contact us as soon as possible.',
      'For damage or shortage claims, we may request photographs, an unboxing video, or other relevant information to help us investigate the issue with our logistics partner.',
    ],
  },
  {
    num: '09',
    Icon: Truck,
    title: 'Delivery Attempts',
    body: null,
    bullets: [
      'Our courier partner may make multiple delivery attempts before returning an undelivered package to us.',
      'Please ensure that someone is available at the provided delivery address to receive the order.',
    ],
  },
  {
    num: '10',
    Icon: RefreshCw,
    title: 'Non-Delivery or Returned Shipments',
    body: null,
    bullets: [
      'If a shipment is returned to us because the recipient is unavailable, the address is incorrect, the delivery is refused, or the courier cannot complete delivery, we may contact you regarding further delivery arrangements.',
      'Additional shipping charges may apply for re-shipping such orders.',
    ],
  },
  {
    num: '11',
    Icon: CreditCard,
    title: 'Cash on Delivery',
    body: null,
    bullets: [
      'If Cash on Delivery (COD) is available for your PIN code, the option will be displayed at checkout.',
      'COD availability may be subject to order value, PIN code, and courier serviceability.',
    ],
  },
];

const SectionBlock = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 group">
      <button
        id={`shipping-section-${section.num}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-6 p-7 text-left"
      >
        <span className="font-heading text-4xl text-gold/15 group-hover:text-gold/35 transition-colors duration-300 flex-shrink-0 leading-none w-10">
          {section.num}
        </span>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-black transition-all duration-300">
            <section.Icon size={15} />
          </div>
          <h3 className="font-heading text-lg lg:text-xl text-ivory tracking-wide">{section.title}</h3>
        </div>
        <ChevronDown
          size={16}
          className={`text-gold/50 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-7 pb-8 border-t border-gold/10 pt-5 space-y-3">
          {section.body && (
            <p className="text-ivory/50 text-sm leading-relaxed font-light">{section.body}</p>
          )}
          {section.bullets && (
            <ul className="space-y-2">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-ivory/50 text-sm leading-relaxed font-light">
                  <span className="text-gold mt-1.5 flex-shrink-0 text-xs">◆</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {section.note && (
            <p className="text-ivory/30 text-xs leading-relaxed font-light italic border-l-2 border-gold/20 pl-4 mt-4">
              {section.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ShippingPolicyPage = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">INERRANCY</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Shipping Policy
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mb-10" />
          <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            At Inerrancy, we are committed to delivering your order safely and promptly across India.
          </p>
        </section>

        {/* Delivery Time Quick Reference */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { location: 'Metro & Major Cities', time: '2–5 Business Days' },
            { location: 'Other Locations', time: '4–7 Business Days' },
            { location: 'Remote Areas', time: '5–10 Business Days' },
          ].map((item, i) => (
            <div key={i} className="bg-black-2 border border-gold/10 rounded-2xl p-8 text-center hover:border-gold/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold mx-auto mb-5 group-hover:bg-gold group-hover:text-black transition-all duration-300">
                <Truck size={16} />
              </div>
              <p className="font-heading text-2xl text-gold mb-2">{item.time}</p>
              <p className="text-ivory/30 text-xs uppercase tracking-[2px]">{item.location}</p>
            </div>
          ))}
        </section>

        {/* Policy Sections */}
        <section className="space-y-3 mb-20">
          <div className="text-center mb-12">
            <span className="section-label">POLICY DETAILS</span>
            <h2 className="section-title">Shipping Terms</h2>
            <div className="gold-divider mx-auto" />
          </div>
          {sections.map((section) => (
            <SectionBlock key={section.num} section={section} />
          ))}
        </section>

        {/* Contact */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">SECTION 12 · CONTACT US</span>
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-5 tracking-wide">
            Questions about your shipment?
          </h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            If you have questions about your shipment or delivery, please contact us with your order number. We will be happy to assist you.
          </p>
          <a
            href="mailto:care@inerrancy.in"
            id="shipping-contact-link"
            className="btn btn-outline inline-flex items-center gap-3"
          >
            <Mail size={15} /> care@inerrancy.in
          </a>
          <div className="gold-divider mx-auto mt-10" />
          <p className="text-ivory/20 text-xs tracking-[3px] uppercase mt-6">
            Inerrancy · The Discipline of Perfection
          </p>
        </section>

      </div>
    </div>
  );
};

export default ShippingPolicyPage;
