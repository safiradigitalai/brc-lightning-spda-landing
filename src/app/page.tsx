'use client';

import { useState, useRef } from 'react';
import { Hero } from '@/components/sections/hero';
import { Benefits } from '@/components/sections/benefits';
import { PainSolution } from '@/components/sections/pain-solution';
import { LeadCapture } from '@/components/forms/lead-capture';
import { Credibility } from '@/components/sections/credibility';
import { Footer } from '@/components/layout/footer';
import { SuccessModal } from '@/components/sections/success-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [leadData, setLeadData] = useState({ email: '', name: '' });
  const [formKey, setFormKey] = useState(0); // Key para forçar reset do form
  const leadCaptureRef = useRef<HTMLDivElement>(null);

  const handleCtaClick = () => {
    leadCaptureRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleLeadCapture = (email: string, name: string) => {
    setLeadData({ email, name });
    setShowSuccessModal(true);
    
    // Enviar dados para seu sistema de email marketing
    // Exemplo: sendToMailchimp(email, name);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Reset o formulário incrementando a key
    setFormKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero onCtaClick={handleCtaClick} />
      <Benefits />
      <PainSolution />
      <Credibility />
      
      <div ref={leadCaptureRef}>
        <LeadCapture key={formKey} onSuccess={handleLeadCapture} />
      </div>
      
      <Footer />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        email={leadData.email}
        name={leadData.name}
      />
    </div>
  );
}
