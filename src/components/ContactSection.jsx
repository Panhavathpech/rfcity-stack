import React, { useState } from 'react';
import contactPrimary from '../assets/contact/contact-1.png';
import contactSecondary from '../assets/contact/contact-2.png';

const infoBlocks = [
  {
    title: 'Sales Gallery',
    detail: 'R&F City Showroom, Hun Sen Boulevard, Phnom Penh',
  },
  {
    title: 'Open Daily',
    detail: '9 AM - 6 PM',
  },
  {
    title: 'Email',
    detail: 'rfcambodia@163.com',
  },
  {
    title: 'Contact Number',
    detail: '018 888 2777',
  },
];

const CONTACT_API_BASE = (import.meta.env.VITE_CONTACT_API || '/api').replace(/\/$/, '');
const CONTACT_ENDPOINT = `${CONTACT_API_BASE}/contact`;

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
};

const ContactSection = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formState.fullName,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Unable to send message');
      }

      setFormState(initialFormState);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="ContactSection" className="bg-white py-20 text-slate-900 max-[1650px]:px-6">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-900/70">Connect</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-emerald-950 md:text-4xl lg:text-[42px]">
            Get in Touch with R&amp;F City
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            We are here to help you find your ideal home. Contact us to schedule a visit or learn more about
            our properties and community.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            {[
              { label: 'Full Name', type: 'text', placeholder: 'Enter your full name', name: 'fullName' },
              { label: 'Email', type: 'email', placeholder: 'Enter your email', name: 'email' },
              { label: 'Phone Number', type: 'tel', placeholder: 'Enter Your Phone Number', name: 'phone' },
            ].map(({ label, type, placeholder, name }) => (
              <label key={name} className="block text-sm font-medium tracking-wide text-emerald-950/90">
                {label}
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formState[name]}
                  onChange={handleChange}
                  className="mt-2 w-full border-0 border-b border-slate-300 bg-transparent pb-2 pt-1 text-base text-slate-900 placeholder-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-0"
                />
              </label>
            ))}

            <label className="block text-sm font-medium tracking-wide text-emerald-950/90">
              Message
              <textarea
                name="message"
                rows="4"
                placeholder="Tell us what you'd like to know..."
                value={formState.message}
                onChange={handleChange}
                className="mt-2 w-full resize-none border-0 border-b border-slate-300 bg-transparent pb-2 pt-1 text-base text-slate-900 placeholder-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-0"
              />
            </label>

            {status === 'success' && (
              <p className="text-sm text-emerald-700">
                Thanks for reaching out! Our team will respond shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-full border border-emerald-950 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-950 transition hover:bg-emerald-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/70"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="space-y-10 lg:flex lg:flex-col lg:justify-end">
          <div className="grid gap-8 text-base text-slate-600 sm:grid-cols-2">
            {infoBlocks.map(({ title, detail }) => (
              <div key={title}>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{title}</p>
                <p className="mt-3 text-lg text-emerald-950">{detail}</p>
              </div>
            ))}
          </div>

          <div className="group relative overflow-hidden rounded-[32px] border border-slate-100 shadow-xl">
            <img
              src={contactPrimary}
              alt="R&F City living room"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <img
              src={contactSecondary}
              alt="Alternate view of R&F City living room"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

