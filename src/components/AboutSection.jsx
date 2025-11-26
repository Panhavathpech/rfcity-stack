import React from 'react';
import MVVSlider from './MVVSlider';

const AboutSection = () => {
    return (
        <section id="AboutSection" className="bg-gray-50 py-16 md:py-24">
            <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                <div className="text-center mb-12">
                    <p className="text-xs md:text-sm tracking-widest text-gray-500 font-light mb-6">
                        WELCOME TO R&F CITY PHNOM PENH
                    </p>

                    <div className="inline-block bg-emerald-900 text-white px-8 py-3 mb-8">
                        <h2 className="text-xl md:text-2xl font-medium tracking-wide">
                            ABOUT US
                        </h2>
                    </div>

                    <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                        R&F City is a premium residential development by Guangzhou R&F Properties Group.
                        We are committed to build modern, sustainable communities designed for comfort,
                        convenience, and long-term value.
                    </p>
                </div>

                <MVVSlider />
            </div>
        </section>
    );
};

export default AboutSection;
