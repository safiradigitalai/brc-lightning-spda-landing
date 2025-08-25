'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, CheckCircle } from 'lucide-react';

export function Credibility() {
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
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
            filter: 'drop-shadow(0 0 4px rgba(0, 229, 255, 0.2))'
          }}
        />
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, rgba(0, 229, 255, 0.02) 50%, transparent 100%)',
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`,
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />

        {/* Floating Energy Particles */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary rounded-full animate-bounce shadow-[0_0_3px_rgba(0,229,255,1)]"
              style={{
                left: `${20 + (i * 30)}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${6 + (i % 2)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Editorial */}
        <div className={`text-center mb-20 space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Badge Exclusivo */}
          <div className="inline-block">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-slate-800/80 border-2 border-primary/60 rounded-2xl backdrop-blur-lg shadow-[0_0_30px_rgba(0,229,255,0.4)] max-w-[90vw]">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide text-center">BRC LIGHTNING • ENGENHARIA SPDA</span>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Layout Dividido */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center max-w-7xl mx-auto px-4">
          
          {/* Left Column - Testemunho */}
          <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            <Card className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl border border-primary/30 rounded-3xl shadow-[0_0_40px_rgba(0,229,255,0.3)] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)] transition-all duration-500 overflow-hidden">
              
              {/* Energy Corners */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-pulse" style={{animationDelay: '1s'}} />
              
              <CardContent className="p-10 relative">
                
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/40 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">"</div>
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed text-center mb-6 sm:mb-8">
                  De <span className="text-primary font-semibold glow-text">engenheiro para engenheiro</span>: criamos a BRC Lightning para devolver 
                  <span className="text-primary font-semibold glow-text"> segurança e produtividade</span> aos profissionais de SPDA.
                </blockquote>
                
                {/* Description */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-center">
                  Nossa plataforma já ajudou <span className="text-white font-semibold">centenas de engenheiros</span> a otimizar seus projetos de proteção contra descargas atmosféricas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Trust Badges */}
          <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            <div className="space-y-8">
              
              {/* Main Trust Badge */}
              <Card className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_45px_rgba(0,229,255,0.4)] transition-all duration-500 overflow-hidden">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] animate-pulse" />
                
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/15 rounded-2xl flex items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(0,229,255,0.4)] flex-shrink-0">
                      <Shield className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Conformidade NBR 5419</h3>
                      <p className="text-slate-300 leading-relaxed">Baseado nas normas mais atualizadas e validado por especialistas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Secondary Trust Badges */}
              <div className="grid gap-6">
                
                <Card className="relative bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-800/40 backdrop-blur-xl border border-primary/20 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/25 to-primary/10 rounded-xl flex items-center justify-center border border-primary/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex-shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">Validação Técnica</h4>
                        <p className="text-sm text-slate-300">Conteúdo desenvolvido por engenheiros especialistas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="relative bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-800/40 backdrop-blur-xl border border-primary/20 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/25 to-primary/10 rounded-xl flex items-center justify-center border border-primary/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">Suporte Especializado</h4>
                        <p className="text-sm text-slate-300">Acompanhamento técnico contínuo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos Decorativos */}
      <div className="absolute top-20 right-8 w-1 h-20 gradient-primary opacity-30 rotate-12" />
      <div className="absolute bottom-20 left-6 w-0.5 h-16 gradient-accent opacity-25 -rotate-12" />
    </section>
  );
}