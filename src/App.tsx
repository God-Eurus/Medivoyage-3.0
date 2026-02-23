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
import Wellness from './components/Wellness';

function App() {
  // 1. Added 'wellness' to the allowed state types
  const [currentView, setCurrentView] = useState<'home' | 'treatments' | 'about' | 'wellness'>('home');

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

  // 2. Added navigation function for Wellness
  const navigateToWellness = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('wellness');
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
            onWellnessClick={navigateToWellness} // Passed down
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

      {/* TREATMENTS VIEW */}
      {currentView === 'treatments' && (
        <Treatment 
          onHomeClick={navigateToHome}
          onTreatmentClick={navigateToTreatments}
          onAboutClick={navigateToAbout}
          onWellnessClick={navigateToWellness} // Passed down
        />
      )}

      {/* ABOUT VIEW */}
      {currentView === 'about' && (
        <AboutUs 
          onHomeClick={navigateToHome}
          onTreatmentClick={navigateToTreatments}
          onAboutClick={navigateToAbout}
          onWellnessClick={navigateToWellness} // Passed down
        />
      )}

      {/* WELLNESS VIEW */}
      {currentView === 'wellness' && (
        <>
          <Navbar 
            onHomeClick={navigateToHome}
            onTreatmentClick={navigateToTreatments} 
            onAboutClick={navigateToAbout}
            onWellnessClick={navigateToWellness}
          />
          <Wellness />
          <BottomInquiry /> 
          <Footer />
          <StickyCTA />
        </>
      )}

    </div>
  );
}

export default App;