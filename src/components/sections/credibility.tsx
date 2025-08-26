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
    <section className="bg-section-2 relative py-32 overflow-hidden">
      {/* Dark Theme - Cinematic Background Effects */}
      <div className="absolute inset-0 hidden dark:block">        
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
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 surface-glass-strong border border-glass rounded-full shadow-cyan-lg glass-hover max-w-[90vw]">
              <span className="text-xs sm:text-sm font-bold text-gradient-cyan tracking-wide text-center">BRC LIGHTNING • ENGENHARIA SPDA</span>
            </div>
          </div>
        </div>

        {/* Layout Dividido */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center max-w-7xl mx-auto px-4">
          
          {/* Left Column - Testemunho */}
          <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            <Card className="card-glass-strong rounded-3xl shadow-glow hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden">
              
              {/* Energy Corners */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-primary rounded-full shadow-cyan animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-tl from-primary to-primary rounded-full shadow-cyan animate-pulse" style={{animationDelay: '1s'}} />
              
              <CardContent className="p-10 relative">
                
                {/* Quote Icon */}
                <div className="w-16 h-16 surface-glass rounded-2xl flex items-center justify-center mx-auto mb-8 border border-glass shadow-cyan">
                  <div className="text-4xl font-black text-primary">"</div>
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-primary leading-relaxed text-center mb-6 sm:mb-8">
                  De <span className="text-accent font-semibold">engenheiro para engenheiro</span>: criamos a BRC Lightning para devolver 
                  <span className="text-accent font-semibold"> segurança e produtividade</span> aos profissionais de SPDA.
                </blockquote>
                
                {/* Description */}
                <p className="text-base sm:text-lg text-muted leading-relaxed text-center">
                  Nossa plataforma já ajudou <span className="text-primary font-semibold">centenas de engenheiros</span> a otimizar seus projetos de proteção contra descargas atmosféricas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Trust Badges */}
          <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            <div className="space-y-8">
              
              {/* Main Trust Badge */}
              <Card className="card-glass rounded-2xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary rounded-full shadow-cyan animate-pulse" />
                
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 surface-glass rounded-2xl flex items-center justify-center border border-glass shadow-cyan flex-shrink-0">
                      <Shield className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2">Conformidade NBR 5419</h3>
                      <p className="text-muted leading-relaxed">Baseado nas normas mais atualizadas e validado por especialistas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Secondary Trust Badges */}
              <div className="grid gap-6">
                
                <Card className="card-glass rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 surface-glass rounded-xl flex items-center justify-center border border-glass shadow-cyan flex-shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-1">Validação Técnica</h4>
                        <p className="text-sm text-muted">Conteúdo desenvolvido por engenheiros especialistas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-glass rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 surface-glass rounded-xl flex items-center justify-center border border-glass shadow-cyan flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-1">Suporte Especializado</h4>
                        <p className="text-sm text-muted">Acompanhamento técnico contínuo</p>
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
      <div className="absolute top-20 right-8 w-1 h-20 bg-gradient-to-t from-primary to-transparent opacity-25 rotate-12" />
      <div className="absolute bottom-20 left-6 w-0.5 h-16 bg-gradient-to-b from-accent to-transparent opacity-20 -rotate-12" />
    </section>
  );
}