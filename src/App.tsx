import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PatientJourney } from './components/PatientJourney';
import { PartnerMarquee } from './components/PartnerMarquee';
import { Features } from './components/Features';
import { GlobalNetwork } from './components/GlobalNetwork';
import { Doctors } from './components/Doctors';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FAQ';
import { BottomInquiry } from './components/BottomInquiry';
import { Footer } from './components/Footer';
import { StickyCTA } from './components/StickyCTA';
import { PopupForm } from './components/PopupForm';
import Treatment from './components/Treatment';
import AboutUs from './components/AboutUs';
import Wellness from './components/Wellness';
import MediVoyageAI from './pages/MediVoyageAI';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import { AICta } from './components/AICta';
import HonestSecondOpinion from './pages/HonestSecondOpinion';
import TravelPlanner from './pages/TravelPlanner';
import DoctorsBooking from './pages/DoctorsBooking';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

type View = 'home' | 'treatments' | 'about' | 'wellness' | 'ai' | 'login' | 'payment' | 'second-opinion' | 'travel' | 'doctors';

function AppInner() {
  const { user, loading, hasAccess, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  // Track why the user entered the login flow so we know where to send them after
  const [loginContext, setLoginContext] = useState<'upgrade' | 'general'>('general');

  const nav = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView(view);
  };

  // AI page is now open to everyone — no login required
  const navigateToAI = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('ai');
  };

  // Called from within the AI page when the user clicks an upgrade CTA
  const navigateToUpgrade = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!user) {
      setLoginContext('upgrade');
      setCurrentView('login');
    } else {
      setCurrentView('payment');
    }
  };

  const navProps = {
    onHomeClick:            () => nav('home'),
    onTreatmentClick:       () => nav('treatments'),
    onAboutClick:           () => nav('about'),
    onWellnessClick:        () => nav('wellness'),
    onAIClick:              navigateToAI,
    onSecondOpinionClick:   () => nav('second-opinion'),
    onTravelClick:          () => nav('travel'),
    onDoctorsClick:         () => nav('doctors'),
    onSignOutClick:         user ? signOut : undefined,
    onLoginClick:           !user ? () => { setLoginContext('general'); nav('login'); } : undefined,
    userEmail:              user?.email,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* HOME */}
      {currentView === 'home' && (
        <>
          <Navbar {...navProps} />
          <PopupForm />
          <Hero />
          <PatientJourney />
          <PartnerMarquee />
          {/* <Features /> */}
          {/* <GlobalNetwork /> */}
          {/* <Doctors /> */}
          <Testimonials />
          <FaqSection />
          <AICta onAIClick={navigateToAI} />
          <BottomInquiry />
          <Footer />
          <StickyCTA />
        </>
      )}

      {/* TREATMENTS */}
      {currentView === 'treatments' && (
        <Treatment {...navProps} />
      )}

      {/* ABOUT */}
      {currentView === 'about' && (
        <AboutUs {...navProps} />
      )}

      {/* WELLNESS */}
      {currentView === 'wellness' && (
        <>
          <Navbar {...navProps} />
          <Wellness />
          <BottomInquiry />
          <Footer />
          <StickyCTA />
        </>
      )}

      {/* LOGIN */}
      {currentView === 'login' && (
        <AuthPage
          onSuccess={() => {
            if (hasAccess) { nav('ai'); }
            else if (loginContext === 'upgrade') { nav('payment'); }
            else { nav('home'); }
          }}
          onHomeClick={() => nav('home')}
        />
      )}

      {/* PAYMENT — shown after login but before paying */}
      {currentView === 'payment' && (
        <PaymentPage
          onSuccess={() => nav('ai')}
          onHomeClick={() => nav('home')}
        />
      )}

      {/* MEDIVOYAGE AI — open to all; upgrade unlocks premium features */}
      {currentView === 'ai' && (
        <MediVoyageAI {...navProps} onUpgradeClick={navigateToUpgrade} />
      )}

      {/* HONEST SECOND OPINION */}
      {currentView === 'second-opinion' && (
        <HonestSecondOpinion {...navProps} />
      )}

      {/* TRAVEL PLANNER */}
      {currentView === 'travel' && (
        <TravelPlanner {...navProps} />
      )}

      {/* DOCTORS BOOKING */}
      {currentView === 'doctors' && (
        <DoctorsBooking {...navProps} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
