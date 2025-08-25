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
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
            filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))'
          }}
        />
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, rgba(0, 229, 255, 0.1) 50%, transparent 100%)',
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.4) 0%, rgba(0, 229, 255, 0.05) 70%, transparent 100%)',
            transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
            animation: 'pulse 6s ease-in-out infinite reverse'
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

        {/* Floating Energy Particles */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-bounce shadow-[0_0_6px_rgba(0,229,255,1)]"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`
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
              
              {/* Electric Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-slate-800/80 border-2 border-primary/60 rounded-full backdrop-blur-lg shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all duration-300 max-w-[90vw]">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-[0_0_4px_rgba(0,0,0,1)] truncate">EBOOK BRC VOLUME 1 • NBR 5419</span>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0" />
              </div>

              {/* Cinematic Title */}
              <div className="space-y-6">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.8] tracking-tight">
                  <span className="block text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">5 ERROS</span>
                  <span className="block text-white/70 text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    QUE REPROVAM
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] hover:drop-shadow-[0_0_30px_rgba(0,229,255,1)] transition-all duration-300">
                    LAUDOS SPDA
                  </span>
                  <span className="block text-white/80 text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    (E COMO EVITÁ-LOS)
                  </span>
                </h1>
                
                {/* Subtitle */}
                <div className="max-w-2xl mx-auto pt-8 px-4">
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-light text-center">
                    <span className="text-primary font-semibold glow-text">Checklist técnico baseado na NBR 5419</span> para proteger sua ART, 
                    evitar reprovações e <span className="text-primary font-semibold glow-text">ganhar tempo</span> em seus projetos de SPDA
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
                  <span className="whitespace-nowrap">BAIXAR E-BOOK GRATUITO</span>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-8 px-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span className="text-green-400 font-medium">Download instantâneo</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="text-primary font-medium">Sem spam</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                  <span className="text-white font-medium">Conteúdo validado</span>
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