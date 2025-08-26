'use client';

import { useState, useRef } from 'react';
import { Hero } from '@/components/sections/hero';
import { Benefits } from '@/components/sections/benefits';
import { LeadCapture } from '@/components/forms/lead-capture';
import { Credibility } from '@/components/sections/credibility';
import { SuccessModal } from '@/components/sections/success-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [leadData, setLeadData] = useState({ email: '', name: '' });
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
  };

  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero onCtaClick={handleCtaClick} />
      <Benefits />
      <Credibility />
      
      <div ref={leadCaptureRef}>
        <LeadCapture onSuccess={handleLeadCapture} />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        email={leadData.email}
        name={leadData.name}
      />
    </div>
  );
}
