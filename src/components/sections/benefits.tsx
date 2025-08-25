'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle, 
  Zap,
  Target
} from 'lucide-react';

const benefits = [
  {
    icon: CheckCircle,
    title: 'Evite reprovação em laudos de SPDA',
    description: 'Conhecimento técnico essencial para engenheiros',
    gradient: 'gradient-primary',
    glow: 'glow-primary',
    number: '01'
  },
  {
    icon: Shield,
    title: 'Checklist completo baseado na NBR 5419',
    description: 'Para garantir conformidade técnica',
    gradient: 'gradient-accent',
    glow: 'shadow-accent',
    number: '02'
  },
  {
    icon: Clock,
    title: 'Ganhe tempo automatizando cálculos',
    description: 'Métodos práticos para acelerar análises e dimensionamentos',
    gradient: 'bg-success/20 border border-success/30',
    glow: 'glow-primary',
    number: '03'
  },
  {
    icon: Zap,
    title: 'Memorial descritivo pronto em minutos',
    description: 'Templates e estruturas prontas para documentação profissional',
    gradient: 'gradient-cyber',
    glow: 'shadow-deep',
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
    <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
            filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.2))'
          }}
        />
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.03) 50%, transparent 100%)',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.02) 60%, transparent 100%)',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animation: 'pulse 8s ease-in-out infinite reverse'
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

        {/* Floating Energy Particles */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary rounded-full animate-bounce shadow-[0_0_3px_rgba(0,229,255,1)]"
              style={{
                left: `${10 + (i * 20)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${5 + (i % 2)}s`
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
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-slate-800/80 border-2 border-primary/60 rounded-2xl backdrop-blur-lg shadow-[0_0_30px_rgba(0,229,255,0.4)] max-w-[90vw]">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide text-center">CONHECIMENTO TÉCNICO ESSENCIAL</span>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
            </div>
          </div>

          {/* Título Cinematográfico */}
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter px-4">
            <span className="block text-white/60 text-xl xs:text-2xl sm:text-2xl md:text-4xl font-light">O QUE VOCÊ VAI</span>
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">DESCOBRIR</span>
            <span className="block text-white text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl">NO E-BOOK</span>
          </h2>
          
          {/* Subtitle Editorial */}
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed font-light text-center">
              <span className="text-primary font-bold glow-text">Conhecimento técnico essencial</span> para engenheiros que trabalham com SPDA
            </p>
          </div>
        </div>

        {/* Cards Grid Moderno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="group hover:scale-105 transition-all duration-300">
              
              {/* Card Principal */}
              <Card className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all duration-500 overflow-hidden h-full">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                
                <CardContent className="p-6 relative h-full flex flex-col">
                  
                  {/* Header com Número */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-black text-white/30">{benefit.number}</div>
                  </div>
                  
                  {/* Ícone */}
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/40">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                  
                  {/* Linha Decorativa */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Elementos Decorativos Cinematográficos */}
      <div className="absolute top-20 left-6 w-2 h-32 gradient-accent opacity-50 rotate-12" />
      <div className="absolute bottom-20 right-8 w-1 h-24 gradient-primary opacity-40 -rotate-12" />
      <div className="absolute top-1/2 right-4 w-0.5 h-20 bg-warning opacity-30" />
      
      {/* Grid Lines Decorativas */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/3 w-px h-full bg-accent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-primary" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-accent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-primary" />
      </div>
    </section>
  );
}