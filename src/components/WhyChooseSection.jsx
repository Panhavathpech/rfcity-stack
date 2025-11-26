import React, { useState } from 'react';
import cardOne from '../assets/why-choose/card-1.png';
import cardTwo from '../assets/why-choose/card-2.png';
import cardThree from '../assets/why-choose/card-3.png';
import cardFour from '../assets/why-choose/card-4.png';

const cards = [
    {
        title: 'Strategic Locations',
        description: 'Proximity to key city areas and amenities',
        image: cardOne,
        highlight: true,
    },
    {
        title: 'Comprehensive Amenities',
        description: 'Pools, fitness centers, gardens, clubhouses',
        image: cardTwo,
    },
    {
        title: 'Trusted Developer',
        description: 'Backed by Guangzhou R&F Properties Group',
        image: cardThree,
    },
    {
        title: 'Investment Potential',
        description: 'High appreciation in rapidly developing districts',
        image: cardFour,
    },
];

const highlightIndex = cards.findIndex((card) => card.highlight);
const defaultActiveIndex = highlightIndex === -1 ? 0 : highlightIndex;

const WhyChooseSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const activeIndex = hoveredIndex ?? defaultActiveIndex;

    return (
        <section id="WhyChooseSection" className="bg-white py-16 md:py-24">
            <div className="mx-auto w-full max-w-[108rem] px-4 sm:px-8 lg:px-12">
                <div className="text-center mb-12">
                    <div className="inline-block bg-emerald-900 text-white px-10 py-3">
                        <h2 className="text-lg md:text-xl tracking-[0.3em] font-medium">
                            WHY CHOOSE R&F CITY
                        </h2>
                    </div>
                    <p className="mt-8 text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                        R&F City is a premium residential development by Guangzhou R&F Properties Group. We are
                        committed to build modern, sustainable communities designed for comfort, convenience, and
                        long-term value.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap 2xl:flex-nowrap justify-center overflow-visible pb-4">
                    {cards.map((card, index) => {
                        const isActive = index === activeIndex;
                        const widthClass = isActive
                            ? 'w-full lg:basis-[calc(50%-0.75rem)] 2xl:basis-auto 2xl:w-[720px]'
                            : 'w-full lg:basis-[calc(50%-0.75rem)] 2xl:basis-auto 2xl:w-[280px]';

                        return (
                            <article
                                key={card.title}
                                className={`relative isolate w-full h-[540px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out flex-shrink-0 ${widthClass} ${
                                    isActive ? 'sm:z-10' : 'sm:hover:z-10'
                                }`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30" />
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                                    <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
                                    <p className="text-sm sm:text-base text-slate-100/90">{card.description}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;