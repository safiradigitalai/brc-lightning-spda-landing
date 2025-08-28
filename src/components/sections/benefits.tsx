'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap } from 'lucide-react';

const benefits = [
  {
    title: 'Quando o SPDA é obrigatório segundo normas e legislação',
    description: 'Entenda exatamente quando aplicar proteção contra descargas',
    number: '01'
  },
  {
    title: 'As diferenças entre os métodos de proteção',
    description: 'Gaiola de Faraday, Franklin e Esfera Rolante explicados',
    number: '02'
  },
  {
    title: 'Os principais erros que levam à reprovação de laudos',
    description: 'E como evitá-los de forma prática e segura',
    number: '03'
  },
  {
    title: 'Como garantir conformidade 100% com a NBR 5419',
    description: 'Transforme complexidade em clareza e proteja sua ART',
    number: '04'
  }
];

export function Benefits() {
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
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full orb-coral-light animate-float"
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
          <div className="absolute top-1/2 right-0 w-px h-40 bg-gradient-to-b from-primary via-primary to-transparent animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.5)]" />
          <div className="absolute bottom-20 left-1/6 w-20 h-px bg-gradient-to-r from-primary via-primary to-transparent animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.5)]" />
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
        
        {/* Título Editorial Premium */}
        <div className="text-center mb-24 space-y-8">
          
          {/* Badge Exclusivo */}
          <div className="inline-block">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 surface-glass-strong border border-glass rounded-full shadow-cyan-lg glass-hover max-w-[90vw]">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gradient-cyan animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-gradient-cyan tracking-wide text-center">NESTE E-BOOK GRATUITO</span>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gradient-cyan flex-shrink-0" />
            </div>
          </div>

          {/* Título Cinematográfico */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter px-4">
            <span className="block text-secondary text-2xl sm:text-2xl md:text-4xl font-light">VOCÊ VAI</span>
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">DESCOBRIR</span>
          </h2>
        </div>

        {/* Cards Grid Moderno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="group hover:scale-105 transition-all duration-300">
              
              {/* Card Principal */}
              <Card className="card-glass-strong rounded-2xl shadow-cyan-lg hover:shadow-glow glass-hover transition-all duration-500 overflow-hidden h-full group">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-primary rounded-full shadow-cyan animate-pulse" />
                
                <CardContent className="p-6 relative h-full flex flex-col">
                  
                  {/* Header com Número */}
                  <div className="mb-6">
                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                      {benefit.number}
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                  
                  {/* Linha Decorativa */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Elementos Decorativos Cinematográficos */}
      <div className="absolute top-20 left-6 w-2 h-32 bg-gradient-to-b from-accent to-transparent opacity-30 rotate-12" />
      <div className="absolute bottom-20 right-8 w-1 h-24 bg-gradient-to-t from-primary to-transparent opacity-25 -rotate-12" />
      <div className="absolute top-1/2 right-4 w-0.5 h-20 bg-primary opacity-20" />
      
      {/* Grid Lines Decorativas */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/3 w-px h-full bg-accent opacity-10" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-primary opacity-10" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-accent opacity-10" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-primary opacity-10" />
      </div>
    </section>
  );
}