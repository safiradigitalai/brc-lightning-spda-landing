'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const painPoints = [
  {
    text: 'A NBR 5419 é extensa e difícil de aplicar.',
    icon: AlertTriangle
  },
  {
    text: 'Um erro no cálculo pode custar seu cliente, sua reputação – e até ações civis.',
    icon: AlertTriangle
  },
  {
    text: 'Planilhas manuais consomem tempo e aumentam o risco de falhas.',
    icon: AlertTriangle
  }
];

export function PainSolution() {
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
    <section className="bg-section-1 relative py-32 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-5 effect-grid"
          style={{
            transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
            filter: 'drop-shadow(0 0 6px var(--primary))'
          }}
        />
        
        {/* Energy Orbs Glassmorphism */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full orb-coral-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animation: 'float 8s ease-in-out infinite reverse',
            animationDelay: '2s'
          }}
        />

        {/* Lightning Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x * 0.006}px, ${mousePosition.y * 0.006}px)`
          }}
        >
          <div className="absolute top-1/2 left-0 w-px h-40 bg-gradient-to-b from-primary via-primary to-transparent animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.5)]" />
          <div className="absolute bottom-20 right-1/6 w-20 h-px bg-gradient-to-r from-primary via-primary to-transparent animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.5)]" />
        </div>

        {/* Floating Energy Particles Premium */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 3 === 0 ? 'particle-coral' : 'particle-cyan'
              }`}
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${20 + (i % 4) * 15}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Editorial */}
        <div className={`text-center mb-20 space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Título Cinematográfico */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter px-4">
            <span className="block text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl font-light">SE VOCÊ É ENGENHEIRO ELETRICISTA</span>
            <span className="block text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl font-light">OU PROJETISTA,</span>
            <span className="block text-brc-primary font-bold">SABE QUE</span>
          </h2>
        </div>

        {/* Pain Points Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid gap-6 px-4">
            {painPoints.map((pain, index) => (
              <div key={index} className={`transition-all duration-1000 delay-${(index + 1) * 200} ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <Card className="card-glass rounded-2xl shadow-coral hover:shadow-coral-lg glass-hover transition-all duration-300 border-l-4 border-l-red-400">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-red-400/30">
                        <pain.icon className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-primary leading-relaxed">
                          {pain.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="card-glass-strong rounded-3xl shadow-glow hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden">
            
            {/* Energy Corners */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-primary rounded-full shadow-cyan animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-tl from-primary to-primary rounded-full shadow-cyan animate-pulse" style={{animationDelay: '1s'}} />
            
            <CardContent className="p-8 sm:p-12 relative text-center">
              
              {/* Solution Icon */}
              <div className="w-20 h-20 surface-glass rounded-2xl flex items-center justify-center mx-auto mb-8 border border-glass shadow-cyan">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              
              {/* Solution Text */}
              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  Este guia foi criado de <span className="text-accent">engenheiro para engenheiro</span>
                </h3>
                <p className="text-lg sm:text-xl text-muted leading-relaxed font-light">
                  Para te ajudar a trabalhar com mais <span className="text-accent font-semibold">segurança, clareza e confiança</span> em seus projetos.
                </p>
                
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-3 surface-glass border border-glass rounded-full shadow-cyan-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-primary">Conteúdo prático e aplicável</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Elementos Decorativos Cinematográficos */}
      <div className="absolute top-20 right-6 w-2 h-32 bg-gradient-to-b from-accent to-transparent opacity-30 rotate-12" />
      <div className="absolute bottom-20 left-8 w-1 h-24 bg-gradient-to-t from-primary to-transparent opacity-25 -rotate-12" />
      <div className="absolute top-1/2 left-4 w-0.5 h-20 bg-primary opacity-20" />
    </section>
  );
}