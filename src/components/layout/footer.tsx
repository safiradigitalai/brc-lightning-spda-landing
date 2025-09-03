'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Instagram, Linkedin, Youtube, Globe } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/brclightning/',
    icon: Instagram,
    description: 'Dicas e conteúdo técnico diário'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/brclightning-servicos-de-software-ltda/',
    icon: Linkedin,
    description: 'Networking profissional'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCSN0Mh82BvOQZMzVzhYbeVQ',
    icon: Youtube,
    description: 'Vídeos técnicos e tutoriais'
  },
  {
    name: 'Site Oficial',
    url: 'https://www.brclightning.com/',
    icon: Globe,
    description: 'Nossa plataforma completa'
  }
];

export function Footer() {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const getTextColor = () => {
    return theme === 'dark' ? '#ffffff' : '#0f172a';
  };

  const getIconColor = () => {
    return theme === 'dark' ? '#ffffff' : '#0f172a';
  };

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
    <footer className="bg-section-2 relative py-20 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-8 effect-grid"
          style={{
            transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
            filter: 'drop-shadow(0 0 6px var(--primary))'
          }}
        />
        
        {/* Energy Orbs Glassmorphism */}
        <div 
          className="absolute top-0 right-1/3 w-64 h-64 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 12s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full orb-coral-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.012}px, ${mousePosition.y * 0.012}px)`,
            animation: 'float 10s ease-in-out infinite reverse',
            animationDelay: '3s'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
            CONECTE-SE COM A BRC LIGHTNING
          </h2>
          <p className="text-lg text-white/80 font-light max-w-2xl mx-auto">
            Acompanhe nosso conteúdo técnico e fique por dentro das novidades em SPDA
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
          {socialLinks.map((social, index) => (
            <div key={index} className={`transition-all duration-1000 delay-${(index + 1) * 200} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Card className="card-glass-strong rounded-2xl shadow-glow hover:shadow-cyan-lg glass-hover transition-all duration-300 group cursor-pointer h-full">
                <a 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                    
                    {/* Icon */}
                    <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                      <div className="w-16 h-16 surface-glass rounded-2xl flex items-center justify-center border border-glass shadow-cyan">
                        <social.icon 
                          className="w-8 h-8" 
                          style={{ color: getIconColor() }}
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-bold mb-2 group-hover:text-primary transition-colors"
                        style={{ color: getTextColor() }}
                      >
                        {social.name}
                      </h3>
                      <p 
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)' }}
                      >
                        {social.description}
                      </p>
                    </div>
                    
                    {/* Link Icon */}
                    <div className="flex justify-center">
                      <div className="w-8 h-8 surface-glass rounded-lg flex items-center justify-center border border-glass shadow-cyan group-hover:scale-110 transition-transform">
                        <ExternalLink 
                          className="w-4 h-4" 
                          style={{ color: getIconColor() }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </a>
              </Card>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className={`text-center mt-16 pt-8 border-t border-white/20 transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-white/60 text-sm font-semibold">
            © 2025 BRC Lightning. Todos os direitos reservados. | Engenharia especializada em SPDA
          </p>
        </div>
      </div>
    </footer>
  );
}