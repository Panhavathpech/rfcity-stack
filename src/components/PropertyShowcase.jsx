import React from 'react';
import { Building, Dumbbell, Trees, Trophy, Waves } from 'lucide-react';
import propertyOne from '../assets/properties/property-1.png';
import propertyTwo from '../assets/properties/property-2.png';

const properties = [
    {
        id: 'miro',
        image: propertyTwo,
        label: 'Featured Developments',
        title: 'R&F City Miro',
        details: [
            'Smart Home Living Concept',
            'Unit Size: 38–39 sqm (Studio/1BR)',
            'Completion: 2023',
            'Modern interior with digital smart controls',
        ],
        footer: null,
    },
    {
        id: 'phnom-penh',
        image: propertyOne,
        label: 'Featured Developments',
        title: 'R&F City Phnom Penh',
        details: [
            'Location: Hun Sen Boulevard, Chak Angrae Leu',
            'Completion: 2021 | Units: 5,236',
            'Unit Types: 1–3 Bedrooms',
            'Starting Price: From $62,000 • Ownership: Freehold',
        ],
        amenities: [
            { label: 'Olympic-sized Pool', icon: Waves },
            { label: 'Tennis Courts', icon: Trophy },
            { label: 'Clubhouse', icon: Building },
            { label: 'Fitness Center', icon: Dumbbell },
            { label: '30,000 sqm Green Garden Spaces', icon: Trees },
        ],
        footer: null,
    },
];

const PropertyShowcase = () => {
    return (
        <section id="PropertyShowcase" className="bg-[#E7E6E5] py-16 md:py-24">
            <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">
                        Live Where Every Day Feels Exceptional
                    </h2>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                        R&amp;F City is a premium residential development by Guangzhou R&amp;F Properties Group.
                        We are committed to build modern, sustainable communities designed for comfort,
                        convenience, and long-term value.
                    </p>
                </div>

                <div className="-mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {properties.map((property, index) => (
                            <article
                                key={property.id}
                                className="group relative h-[420px] sm:h-[500px] lg:h-[560px] w-full overflow-hidden shadow-xl"
                            >
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-900/20 transition-colors duration-300 group-hover:bg-slate-900/70" />
                                <div className="absolute inset-0 flex h-full flex-col gap-4 p-5 text-white opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 sm:gap-5 sm:p-8">
                                    <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
                                        <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-200 mb-3 sm:text-xs sm:mb-4">
                                            {property.label}
                                        </p>
                                        <h3 className="text-xl font-semibold mb-3 sm:text-3xl sm:mb-5">{property.title}</h3>
                                        <ul className="space-y-2 text-sm sm:space-y-2.5 sm:text-base">
                                            {property.details.map((detail) => (
                                                <li key={detail} className="flex gap-3">
                                                    <span className="text-emerald-300 mt-1 text-lg leading-none">•</span>
                                                    <span className="leading-snug">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {property.amenities && (
                                            <div className="mt-4 max-h-32 overflow-y-auto pr-1 sm:mt-6 sm:max-h-[180px] sm:overflow-y-auto sm:pr-0">
                                                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-200 mb-2 sm:text-xs sm:mb-3">
                                                    Amenities
                                                </p>
                                                <ul className="grid gap-2 text-xs sm:grid-cols-2 sm:gap-2.5 sm:text-sm">
                                                    {property.amenities.map((amenity) => {
                                                        const Icon = amenity.icon;
                                                        return (
                                                            <li
                                                                key={amenity.label}
                                                                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-3 sm:py-1.5"
                                                            >
                                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-emerald-200 sm:h-7 sm:w-7">
                                                                    <Icon className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" strokeWidth={1.4} />
                                                                </span>
                                                                <span className="leading-snug">{amenity.label}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-1 sm:pt-3">
                                        <a href="#ContactSection" className="inline-flex items-center justify-center rounded-full border border-white px-5 py-2 text-xs font-semibold tracking-[0.4em] uppercase hover:bg-white hover:text-slate-900 transition-all duration-300 sm:px-6 sm:text-sm">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyShowcase;

