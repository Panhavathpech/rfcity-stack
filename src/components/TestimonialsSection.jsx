import React, { useState } from 'react';
import { motion } from 'framer-motion';
import testimonial1 from '../assets/testimonials/testimonial-1.jpg';
import testimonial2 from '../assets/testimonials/testimonial-2.jpg';
import testimonial3 from '../assets/testimonials/testimonial-3.jpg';
import testimonial4 from '../assets/testimonials/testimonial-4.jpg';
import testimonial5 from '../assets/testimonials/testimonial-5.jpg';

const testimonials = [
  {
    name: 'David Tep',
    role: 'Homeowner',
    quote:
      "I originally chose R&F City for its location and quality, but what truly surprised me was the sense of community. Neighbors are friendly, and there's always something happening that brings everyone together.",
    image: testimonial1,
  },
  {
    name: 'Sophea Leng',
    role: 'Resident',
    quote:
      'The amenities here are beyond my expectations. Mornings start with a walk through the gardens and evenings end by the pool. It feels like living in a resort every day.',
    image: testimonial2,
  },
  {
    name: 'Socheata Neang',
    role: 'Property Investor',
    quote:
      'As an investor, I appreciate the balance of beautiful design with long-term potential. R&F City delivers steady appreciation and happy tenants - rare to find elsewhere.',
    image: testimonial3,
  },
  {
    name: 'Chanra Vath',
    role: 'Young Professional',
    quote:
      'My commute is effortless and the onsite amenities mean I can recharge without leaving home. It strikes the perfect balance between work and lifestyle.',
    image: testimonial4,
  },
  {
    name: 'Lim Dara',
    role: 'Entrepreneur',
    quote:
      'Hosting clients here always impresses. The surroundings feel premium, and the community events help me build meaningful connections with other residents.',
    image: testimonial5,
  },
];

const cardOffsets = [-1, 0, 1];

const StarIcon = ({ filled = true }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${filled ? 'fill-current text-yellow-300' : 'fill-transparent stroke-current text-yellow-300'}`}
  >
    <path
      d="M12 3.5l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </svg>
);

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const getTestimonialByOffset = (offset) => {
    const index = (activeIndex + offset + testimonials.length) % testimonials.length;
    return testimonials[index];
  };

  const goToNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goToPrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-[#273D39] px-4 sm:px-6 lg:px-10 xl:px-9 py-24 text-white" id="TestimonialsSection">
      <div className="w-full text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-[#AD7D51]">Testimonial</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl lg:text-5xl">
          What Our Residents Love About Living at R&amp;F City
        </h2>
      </div>

      <div className="mt-16 flex w-full flex-col items-center gap-10">
        <motion.div
          layout
          className="flex w-full flex-col gap-4 md:flex-row md:flex-nowrap md:items-center md:justify-between"
          transition={{ type: 'spring', stiffness: 200, damping: 35 }}
        >
          {cardOffsets.map((offset) => {
            const isActive = offset === 0;
            const testimonial = getTestimonialByOffset(offset);

            return (
              <motion.article
                key={testimonial.name}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                animate={{ scale: isActive ? 1.05 : 0.9 }}
                className={`${
                  isActive ? 'flex' : 'hidden md:flex'
                } flex-1 flex-col items-center justify-center rounded-3xl border border-white/10 text-center ${
                  isActive
                    ? 'gap-1 bg-[#AD7D51] text-white shadow-2xl px-8 py-8 md:min-h-[383px] md:w-[600px]'
                    : 'gap-1 bg-white text-slate-900 shadow-lg px-6 py-4 md:min-h-[220px] md:w-[540px]'
                }`}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={`rounded-full border-4 object-cover ${
                    isActive
                      ? 'h-20 w-20 border-white/60'
                      : 'h-16 w-16 border-[#AD7D51]/40'
                  }`}
                />
                <h3
                  className={`font-semibold ${
                    isActive ? 'text-xl text-white' : 'text-lg text-[#273D39]'
                  }`}
                >
                  {testimonial.name}
                </h3>
                <p
                  className={`mt-0.5 uppercase tracking-wider ${
                    isActive ? 'text-sm text-white/80' : 'text-xs text-slate-500'
                  }`}
                >
                  {testimonial.role}
                </p>
                <div className={`mt-2 flex items-center justify-center gap-1 ${isActive ? '' : 'scale-90'}`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} />
                  ))}
                </div>
                <p
                  className={`mt-5 leading-relaxed ${
                    isActive ? 'text-base text-white/90' : 'text-sm text-slate-600'
                  }`}
                >
                  "{testimonial.quote}"
                </p>
              </motion.article>
              );
            })}
        </motion.div>

        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrev}
              aria-label="Show previous testimonial"
              className="rounded-full border border-white/40 p-3 text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 6l-6 6 6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              aria-label="Show next testimonial"
              className="rounded-full border border-white/40 p-3 text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {testimonials.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-8 bg-[#AD7D51]' : 'w-3 bg-white/40 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

