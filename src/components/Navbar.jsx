import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/logo/rf-city-whitelogo.png';

const showAdminLink = import.meta.env.VITE_SHOW_ADMIN_LINK === 'true';
const adminPortalUrl = import.meta.env.VITE_ADMIN_PORTAL_URL || 'https://admin.example.com';

const Navbar = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const navLinks = [
        { href: '#AboutSection', label: 'About Us' },
        { href: '#PropertyShowcase', label: 'Residences' },
        { href: '#WhyChooseSection', label: 'Highlights' },
        { href: '#VideoSection', label: 'Showcase' },
        { href: '#TestimonialsSection', label: 'Testimonials' },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let ticking = false;

        const updateScroll = () => {
            const currentScroll = window.scrollY;
            const scrolledDown = currentScroll > lastScrollY.current;
            const passedThreshold = currentScroll > 80;

            setIsHidden(scrolledDown && passedThreshold);
            lastScrollY.current = currentScroll;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={`fixed top-6 left-0 right-0 z-50 px-2 sm:px-4 transform-gpu will-change-transform will-change-opacity transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.26,0.08,0.25,1)] ${
                isHidden
                    ? '-translate-y-32 opacity-0 scale-95 pointer-events-none'
                    : 'translate-y-0 opacity-100 scale-100'
            }`}
        >
            <nav className="relative flex items-center justify-between w-full px-5 sm:px-6 py-3 bg-slate-900/20 backdrop-blur-lg backdrop-saturate-150 text-white rounded-2xl shadow-2xl border border-white/20">
                {/* Logo */}
                <a href="#top" className="flex items-center" aria-label="Back to top">
                    <img src={logo} alt="R&F City" className="h-8 w-auto" />
                </a>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center space-x-6 text-xs font-medium tracking-wider">
                    {navLinks.map(({ href, label }) => (
                        <a key={href} href={href} className="hover:text-[#273D39] transition-colors uppercase">
                            {label}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Language */}
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-emerald-400 transition-colors border-l border-white/20 pl-4">
                        <span className="text-xs font-medium">ENG</span>
                        <ChevronDown size={12} />
                    </div>

                    {showAdminLink && (
                        <a
                            href={adminPortalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden lg:inline-flex items-center rounded-md border border-white/30 px-4 py-1.5 text-xs font-bold tracking-wide text-white transition hover:border-emerald-300 hover:text-emerald-200"
                        >
                            ADMIN PORTAL
                        </a>
                    )}

                    {/* Contact Button */}
                    <a href="#ContactSection" className="bg-white text-slate-900 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#273D39] hover:text-white transition-all duration-300 shadow-lg tracking-wide">
                        CONTACT US
                    </a>
                    <button
                        type="button"
                        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md border border-white/30 hover:border-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <div
                    className={`lg:hidden absolute top-full left-2 right-2 sm:left-4 sm:right-4 mt-3 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 origin-top ${
                        isMenuOpen ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-95 opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="flex flex-col divide-y divide-white/10 text-sm">
                        {navLinks.map(({ href, label }) => (
                            <a
                                key={`mobile-${href}`}
                                href={href}
                                className="px-5 py-3 uppercase tracking-wide hover:bg-white/5 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <a
                            href="#ContactSection"
                            className="px-5 py-3 text-center font-semibold bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            CONTACT US
                        </a>
                        {showAdminLink && (
                            <a
                                href={adminPortalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-3 text-center font-semibold text-emerald-200 hover:bg-white/5 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ADMIN PORTAL
                            </a>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
