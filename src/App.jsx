import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VideoSection from './components/VideoSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import AboutSection from './components/AboutSection';
import PropertyShowcase from './components/PropertyShowcase';
import WhyChooseSection from './components/WhyChooseSection';
import Footer from './components/Footer';


function App() {
  return (
    <div id="top" className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PropertyShowcase />
      <WhyChooseSection />
      <VideoSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
