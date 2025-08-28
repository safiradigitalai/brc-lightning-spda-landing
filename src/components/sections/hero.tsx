'use client';

import { Button } from '@/components/ui/button';
import { Download, Users, CheckCircle, Zap, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="bg-hero relative min-h-screen overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-10 effect-grid"
          style={{
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
            filter: 'drop-shadow(0 0 8px var(--primary))'
          }}
        />
        
        {/* Energy Orbs Glassmorphism */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full orb-coral-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`,
            animation: 'float 10s ease-in-out infinite reverse',
            animationDelay: '2s'
          }}
        />

        {/* Orb adicional menor */}
        <div 
          className="absolute top-1/2 right-12 w-32 h-32 rounded-full orb-cyan-light animate-glow"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animationDelay: '1s'
          }}
        />

        {/* Lightning Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        >
          <div className="absolute top-20 right-1/3 w-px h-40 bg-gradient-to-b from-primary via-primary to-transparent animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
          <div className="absolute bottom-32 left-1/4 w-32 h-px bg-gradient-to-r from-primary via-primary to-transparent animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
          <div className="absolute top-1/2 right-10 w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
        </div>

        {/* Floating Energy Particles Premium */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 3 === 0 ? 'particle-coral' : 'particle-cyan'
              }`}
              style={{
                left: `${15 + (i * 7)}%`,
                top: `${25 + (i % 4) * 18}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center">
            
            {/* Main Content */}
            <div className={`space-y-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              
              {/* Glass Badge Premium */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 surface-glass-strong border border-glass rounded-full shadow-cyan-lg glass-hover max-w-[90vw]">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gradient-cyan animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gradient-cyan tracking-wide truncate">GUIA DE SOBREVIVÊNCIA • VOLUME 1</span>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gradient-cyan flex-shrink-0" />
              </div>

              {/* Cinematic Title */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                  <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent font-black">
                    GUIA DE SOBREVIVÊNCIA
                  </span>
                  <span className="block text-secondary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light">
                    DO ENGENHEIRO
                  </span>
                  <span className="block text-primary font-black">
                    SPDA
                  </span>
                  <span className="block text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mt-2">
                    Volume 1: Fundamentos da Proteção contra Descargas Atmosféricas
                  </span>
                </h1>
                
                {/* Subtitle */}
                <div className="max-w-3xl mx-auto pt-8 px-4">
                  <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed font-light text-center">
                    Aprenda a <span className="text-accent font-semibold">evitar erros fatais na NBR 5419</span> e proteja sua 
                    <span className="text-accent font-semibold"> ART e reputação profissional</span> com segurança técnica.
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="group h-12 sm:h-16 px-6 sm:px-12 text-sm sm:text-lg font-bold bg-gradient-to-r from-primary via-cyan-400 to-primary text-white hover:from-cyan-400 hover:via-primary hover:to-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer max-w-[90vw]"
                  onClick={onCtaClick}
                >
                  <Download className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white group-hover:animate-bounce drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] flex-shrink-0" />
                  <span className="text-center leading-tight">QUERO MEU E-BOOK E PROTEGER MINHA ART</span>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-8 px-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-600 font-medium">Download instantâneo</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                  <span className="text-accent font-medium">Sem spam</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="text-primary font-medium">Conteúdo validado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}