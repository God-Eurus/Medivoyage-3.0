import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PatientJourney } from './components/PatientJourney';
import { Features } from './components/Features';
import { GlobalNetwork } from './components/GlobalNetwork'; // <-- NEW IMPORT
import { Doctors } from './components/Doctors';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FAQ'; // <-- NEW IMPORT
import { BottomInquiry } from './components/BottomInquiry'; 
import { Footer } from './components/Footer';
import { StickyCTA } from './components/StickyCTA';
import { PopupForm } from './components/PopupForm';
import Treatment from './components/Treatment';
import AboutUs from './components/AboutUs';
import Wellness from './components/Wellness';
import './index.css';


function App() {
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
            onWellnessClick={navigateToWellness}
          />
          <PopupForm /> 
          
          {/* --- THE EDITORIAL FLOW --- */}
          <Hero />
          <PatientJourney />
          <Features />
          
          <GlobalNetwork /> {/* 1. Builds desire for the destinations */}
          <Doctors />       {/* 2. Proves clinical authority */}
          <Testimonials />  {/* 3. Provides social proof */}
          <FaqSection />    {/* 4. Eliminates logistical anxiety */}
          
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
          onWellnessClick={navigateToWellness}
        />
      )}

      {/* ABOUT VIEW */}
      {currentView === 'about' && (
        <AboutUs 
          onHomeClick={navigateToHome}
          onTreatmentClick={navigateToTreatments}
          onAboutClick={navigateToAbout}
          onWellnessClick={navigateToWellness}
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