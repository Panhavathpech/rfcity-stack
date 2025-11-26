import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import missionImage from '../assets/about-us/mission.png';
import visionImage from '../assets/about-us/vision.png';
import valuesImage from '../assets/about-us/values.png';

const slides = [
    {
        id: 'mission',
        title: 'Mission',
        headline: 'To create well-designed urban living spaces that elevate everyday life.',
        image: missionImage,
    },
    {
        id: 'vision',
        title: 'Vision',
        headline: 'To become a leading lifestyle community in Cambodia, where families and individuals thrive.',
        image: visionImage,
    },
    {
        id: 'values',
        title: 'Values',
        headline: '',
        points: [
            'Community & Sustainability',
            'Quality Living',
            'Trust & Integrity',
        ],
        image: valuesImage,
    },
];

const MVVSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeSlide = slides[activeIndex];
    const previewSlide = useMemo(() => slides[(activeIndex + 1) % slides.length], [activeIndex]);

    const cycleSlide = (direction) => {
        setActiveIndex((prev) => {
            if (direction === 'next') {
                return (prev + 1) % slides.length;
            }
            return (prev - 1 + slides.length) % slides.length;
        });
    };

    return (
        <section className="w-full rounded-[16px] sm:rounded-[56px] bg-[#102c25] px-4 sm:px-6 lg:px-10 xl:px-16 py-16 text-white">
            <div className="mx-auto w-full space-y-12">
                {/* Top Band */}
                <div className="text-left md:px-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-emerald-100">
                        {activeSlide.title}
                    </p>
                    <div className="mt-6 max-w-3xl space-y-6">
                        {activeSlide.headline && (
                            <h3 className="font-serif text-2xl sm:text-3xl leading-snug md:text-4xl">
                                {activeSlide.headline}
                            </h3>
                        )}
                        {activeSlide.points && (
                            <ul className="space-y-1 text-2xl sm:text-3xl font-light font-serif leading-relaxed">
                                {activeSlide.points.map((point) => (
                                    <li key={point} className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Lower Grid */}
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1.08fr)] lg:items-end">
                    {/* Key Achievements */}
                    <div className="flex flex-col gap-4 text-left lg:h-full lg:justify-end">
                        <p className="text-[1.1rem] leading-relaxed text-white/85">
                            Over 5,000 units delivered in Phnom Penh with world-class standards.
                        </p>
                        <button
                            type="button"
                            className="text-left text-xs font-semibold uppercase tracking-[0.4em] text-amber-200 hover:text-amber-100"
                        >
                            Key Achievements
                        </button>
                    </div>

                    {/* Slider */}
                    <div className="w-full overflow-visible">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:-mr-6 lg:-mr-10 xl:-mr-16">
                            <div className="w-full overflow-hidden rounded-[16px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:flex-[0.62] sm:h-[340px] lg:h-[380px]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeSlide.image}
                                        src={activeSlide.image}
                                        alt={`${activeSlide.title} visual`}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.6 }}
                                        className="h-full w-full object-cover"
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="hidden w-full overflow-hidden rounded-l-[16px] rounded-tr-none rounded-br-none border border-white/15 bg-slate-900/30 shadow-[0_15px_45px_rgba(0,0,0,0.35)] sm:block sm:flex-[0.38] sm:h-[340px] lg:h-[380px]">
                                <img
                                    src={previewSlide.image}
                                    alt={`${previewSlide.title} preview`}
                                    className="h-full w-full object-cover opacity-40 brightness-75"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => cycleSlide('prev')}
                                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition hover:border-white hover:bg-white/15"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="transition group-hover:-translate-x-0.5" size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => cycleSlide('next')}
                                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition hover:border-white hover:bg-white/15"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="transition group-hover:translate-x-0.5" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MVVSlider;

