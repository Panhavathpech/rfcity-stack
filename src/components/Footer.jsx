import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import blackLogo from '../assets/logo/rf-city-blacklogo.png';

const navLinks = [
  { label: 'ABOUT US', href: '#AboutSection' },
  { label: 'RESIDENCES', href: '#PropertyShowcase' },
  { label: 'HIGHLIGHTS', href: '#WhyChooseSection' },
  { label: 'SHOWCASE', href: '#VideoSection' },
  { label: 'TESTIMONIALS', href: '#TestimonialsSection' },
];

const contactDetails = [
  { label: 'Phone', value: '018 888 2777', href: 'tel:0188882777', Icon: Phone },
  { label: 'Email', value: 'rfcambodia@163.com', href: 'mailto:rfcambodia@163.com', Icon: Mail },
  {
    label: 'Address',
    value: ['R&F City Showroom, Hun Sen Boulevard,', 'Phnom Penh'],
    href: 'https://maps.app.goo.gl/',
    Icon: MapPin,
  },
];

const socialLinks = [
  { label: 'Facebook', Icon: Facebook, href: '#' },
  { label: 'Instagram', Icon: Instagram, href: '#' },
  { label: 'Telegram', Icon: Send, href: '#' },
  { label: 'LinkedIn', Icon: Linkedin, href: '#' },
];

const Footer = () => {
  return (
    <footer className="bg-[#f5f6f4] text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-16 py-14 space-y-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <img src={blackLogo} alt="R&F City black logo" className="h-14 w-auto" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              R&amp;F City is a modern residential community designed for comfort, connection, and lasting value in the
              heart of Phnom Penh.
            </p>
          </div>

          <div className="flex flex-col gap-8 text-slate-700 lg:items-end">
            <ul className="w-full max-w-md space-y-5 text-sm leading-relaxed lg:text-right">
              {contactDetails.map(({ label, value, href, Icon }) => (
                <li key={label} className="flex gap-4 lg:justify-end">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-900/20 text-emerald-950">
                    <Icon size={20} />
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
                    {href ? (
                      <a href={href} className="mt-2 block text-base font-medium text-slate-900 hover:text-emerald-800">
                        {Array.isArray(value)
                          ? value.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))
                          : value}
                      </a>
                    ) : (
                      <p className="mt-2 text-base font-medium text-slate-900">
                        {Array.isArray(value)
                          ? value.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))
                          : value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {socialLinks.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/20 text-emerald-900 transition-colors hover:bg-emerald-900 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200" />

        <div className="flex flex-col gap-6 text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="hover:text-emerald-800">
                {label}
              </a>
            ))}
          </div>
          <p className="text-base text-slate-700">© 2025 R&F City. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

