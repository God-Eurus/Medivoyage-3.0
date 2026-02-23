import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PatientJourney } from './components/PatientJourney';
import { Features } from './components/Features';
import { Doctors } from './components/Doctors';
import { Testimonials } from './components/Testimonials';
import { BottomInquiry } from './components/BottomInquiry'; 
import { Footer } from './components/Footer';
import { StickyCTA } from './components/StickyCTA';
import { PopupForm } from './components/PopupForm';
import Treatment from './components/Treatment';
import AboutUs from './components/AboutUs';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'treatments' | 'about'>('home');

  // --- NAVIGATION FUNCTIONS ---
  const navigateToHome = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('home');
  };

  const navigateToTreatments = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('treatments');
  };

  const navigateToAbout = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('about');
  };

  return (
    <div className="min-h-screen bg-white"> 
      
      {/* HOME VIEW */}
      {currentView === 'home' && (
        <>
          <Navbar 
            onHomeClick={navigateToHome}
            onTreatmentClick={navigateToTreatments} 
            onAboutClick={navigateToAbout}
          />
          <PopupForm /> 
          <Hero />
          <PatientJourney />
          <Features />
          <Doctors />
          <Testimonials />
          <BottomInquiry /> 
          <Footer />
          <StickyCTA />
        </>
      )}

      {/* TREATMENTS VIEW - Now passing all nav props */}
      {currentView === 'treatments' && (
        <Treatment 
          onHomeClick={navigateToHome}
          onTreatmentClick={navigateToTreatments}
          onAboutClick={navigateToAbout}
        />
      )}

      {/* ABOUT VIEW - Now passing all nav props */}
      {currentView === 'about' && (
        <AboutUs 
          onHomeClick={navigateToHome}
          onTreatmentClick={navigateToTreatments}
          onAboutClick={navigateToAbout}
        />
      )}

    </div>
  );
}

export default App;