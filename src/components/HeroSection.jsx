import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import slide1 from '../assets/slides/slide-1.png';
import slide2 from '../assets/slides/slide-2.png';
import slide3 from '../assets/slides/slide-3.png';
import slide4 from '../assets/slides/slide-4.png';
import heroTitle from '../assets/hero-title.png';

const slides = [slide1, slide2, slide3, slide4];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900">
            {/* Background Slider */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[currentSlide]}
                        alt={`Slide ${currentSlide + 1}`}
                        className="h-full w-full object-cover"
                    />
                    {/* Grey Transparent Filter */}
                    <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
                    {/* Bottom Green Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h1 className="sr-only">Live in Phnom Penh - Life at R&amp;F City</h1>
                    <img
                        src={heroTitle}
                        alt="Live in Phnom Penh - Life at R&F City"
                        className="mx-auto mb-6 h-auto w-[260px] md:w-[500px] lg:w-[620px] drop-shadow-2xl"
                    />

                    <div className="flex items-center justify-center space-x-4 my-8 text-gray-200 text-sm md:text-lg font-light tracking-wide">
                        <span className="hidden md:inline-block w-8 h-[1px] bg-gray-400"></span>
                        <p>560,000m² International Community, The Largest Natural Garden</p>
                        <span className="hidden md:inline-block w-8 h-[1px] bg-gray-400"></span>
                    </div>


                </motion.div>
            </div>

            {/* CTA Button */}
            <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center">
                <motion.a
                    href="#PropertyShowcase"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="px-8 py-3 border border-white text-white text-sm tracking-widest hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase rounded-xl"
                >
                    Explore Our Properties
                </motion.a>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-12 bg-white' : 'w-8 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
