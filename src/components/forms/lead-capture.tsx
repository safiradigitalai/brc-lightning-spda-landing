'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Mail, 
  User, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  Users,
  Shield,
  Target,
  Zap,
  Phone,
  Briefcase
} from 'lucide-react';

interface LeadCaptureProps {
  onSuccess: (email: string, name: string) => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    role: '',
    lgpdConsent: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; whatsapp?: string; role?: string; lgpdConsent?: string}>({});
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

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; whatsapp?: string; role?: string; lgpdConsent?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.lgpdConsent) {
      newErrors.lgpdConsent = 'Você deve aceitar os termos para continuar';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simular envio (substituir por integração real)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onSuccess(formData.email, formData.name);
  };

  const handleInputChange = (field: 'name' | 'email' | 'whatsapp' | 'role', value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (field: 'lgpdConsent', value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário clica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px)`,
            filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.3))'
          }}
        />
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.05) 50%, transparent 100%)',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            animation: 'pulse 5s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, rgba(0, 229, 255, 0.03) 70%, transparent 100%)',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animation: 'pulse 7s ease-in-out infinite reverse'
          }}
        />

        {/* Lightning Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`
          }}
        >
          <div className="absolute top-20 right-1/3 w-px h-32 bg-gradient-to-b from-primary via-primary to-transparent animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
          <div className="absolute bottom-32 left-1/5 w-24 h-px bg-gradient-to-r from-primary via-primary to-transparent animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
        </div>

        {/* Floating Energy Particles */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary rounded-full animate-bounce shadow-[0_0_4px_rgba(0,229,255,1)]"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${25 + (i % 4) * 15}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Título Editorial Premium */}
        <div className={`text-center mb-16 sm:mb-20 space-y-6 sm:space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Badge Exclusivo */}
          <div className="inline-block">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-8 py-2 sm:py-4 bg-slate-800/80 border-2 border-primary/60 rounded-2xl backdrop-blur-lg shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_45px_rgba(0,229,255,0.6)] transition-all duration-300 max-w-[calc(100vw-32px)]">
              <Download className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-[0_0_4px_rgba(0,0,0,1)] text-center">ACESSO EXCLUSIVO • DOWNLOAD IMEDIATO</span>
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0" />
            </div>
          </div>

          {/* Título Cinematográfico */}
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.8] tracking-tight px-4">
            <span className="block text-white/60 text-xl xs:text-2xl sm:text-3xl md:text-5xl font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">RECEBA SEU</span>
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,229,255,0.8)]">E-BOOK</span>
            <span className="block text-white/80 text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">GRATUITO</span>
          </h2>
          
          {/* Subtitle Editorial */}
          <div className="max-w-4xl mx-auto pt-4 sm:pt-6 px-4">
            <p className="text-base sm:text-xl md:text-2xl text-slate-300 leading-relaxed font-light text-center">
              Preencha os dados abaixo para <span className="text-primary font-bold glow-text">download instantâneo</span>
            </p>
          </div>
        </div>

        {/* Layout Editorial Premium */}
        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-start px-4 sm:px-0">
          
          {/* Formulário Premium - 2 colunas (maior prioridade) */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <Card className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl border border-primary/30 rounded-3xl shadow-[0_0_40px_rgba(0,229,255,0.3)] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)] transition-all duration-500 overflow-hidden">
              
              {/* Energy Corners */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* Header Premium */}
              <CardHeader className="relative p-4 sm:p-8 pb-4 sm:pb-6">
                <CardTitle className="relative text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/30 to-primary/15 rounded-2xl flex items-center justify-center mx-auto border border-primary/50 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <Download className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]">ACESSO EXCLUSIVO</h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-light">Download imediato após o cadastro</p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-8 pt-0 space-y-6 sm:space-y-8">
                
                {/* Formulário Premium */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Campo Nome Premium */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white tracking-wide">
                      NOME COMPLETO <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="João Silva"
                        className={`pl-14 h-12 text-base bg-slate-900/80 border ${errors.name ? 'border-red-400' : 'border-slate-700 focus:border-primary hover:border-slate-600'} rounded-lg font-medium text-white placeholder:text-slate-500 focus:bg-slate-900 transition-all duration-200`}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Campo Email Premium */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white tracking-wide">
                      E-MAIL PROFISSIONAL <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <Input
                        type="email"
                        placeholder="joao.silva@empresa.com"
                        className={`pl-14 h-12 text-base bg-slate-900/80 border ${errors.email ? 'border-red-400' : 'border-slate-700 focus:border-primary hover:border-slate-600'} rounded-lg font-medium text-white placeholder:text-slate-500 focus:bg-slate-900 transition-all duration-200`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Campo WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white tracking-wide">
                      WHATSAPP
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <Input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        className="pl-14 h-12 text-base bg-slate-900/80 border border-slate-700 focus:border-primary hover:border-slate-600 rounded-lg font-medium text-white placeholder:text-slate-500 focus:bg-slate-900 transition-all duration-200"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Campo Cargo/Atuação */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white tracking-wide">
                      CARGO/ATUAÇÃO
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Engenheiro Eletricista"
                        className="pl-14 h-12 text-base bg-slate-900/80 border border-slate-700 focus:border-primary hover:border-slate-600 rounded-lg font-medium text-white placeholder:text-slate-500 focus:bg-slate-900 transition-all duration-200"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* LGPD Consent */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                      <input
                        type="checkbox"
                        id="lgpd-consent"
                        checked={formData.lgpdConsent}
                        onChange={(e) => handleCheckboxChange('lgpdConsent', e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary bg-slate-800 border-slate-600 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <label htmlFor="lgpd-consent" className="text-sm text-slate-300 leading-relaxed cursor-pointer">
                          <span className="text-red-400 font-semibold">*</span> Ao preencher este formulário, você autoriza a BRC Lightning a armazenar e processar seus dados pessoais para envio do e-book e comunicações técnicas relacionadas. Seus dados não serão compartilhados com terceiros e você pode solicitar sua remoção a qualquer momento.
                        </label>
                      </div>
                    </div>
                    {errors.lgpdConsent && (
                      <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.lgpdConsent}
                      </p>
                    )}
                  </div>

                  {/* CTA Button Premium */}
                  <Button 
                    type="submit" 
                    size="lg"
                    className="group w-full h-12 sm:h-16 text-sm sm:text-lg font-black bg-gradient-to-r from-primary via-cyan-400 to-primary text-white hover:from-cyan-400 hover:via-primary hover:to-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white animate-spin flex-shrink-0" />
                    ) : (
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white group-hover:animate-bounce drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap">{isLoading ? 'PROCESSANDO...' : 'BAIXAR E-BOOK GRATUITO'}</span>
                  </Button>
                </form>

                {/* Trust Indicators Premium */}
                <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl p-4 border border-primary/20">
                  <div className="flex flex-col space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Download instantâneo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">Sem spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Conteúdo técnico validado pela NBR 5419</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Premium - 1 coluna */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            {/* E-book Preview Premium */}
            <Card className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_45px_rgba(0,229,255,0.4)] transition-all duration-500 overflow-hidden">
              
              {/* Energy Corners */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.6)] animate-pulse" style={{animationDelay: '1s'}} />
              
              <CardContent className="p-4 sm:p-8 relative">
                
                {/* Header Premium */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex-shrink-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">O QUE VOCÊ VAI DESCOBRIR</h3>
                      <p className="text-sm sm:text-base text-white font-light">Conteúdo exclusivo e prático</p>
                    </div>
                  </div>
                </div>
                
                {/* Lista Premium */}
                <ul className="space-y-4 sm:space-y-6 lg:space-y-7 relative">
                  {[
                    {
                      title: 'Evite reprovação em laudos de SPDA',
                      description: 'Conhecimento técnico essencial para engenheiros'
                    },
                    {
                      title: 'Checklist completo baseado na NBR 5419',
                      description: 'Garanta conformidade técnica em todos os projetos'
                    },
                    {
                      title: 'Ganhe tempo automatizando cálculos',
                      description: 'Métodos práticos para acelerar análises'
                    },
                    {
                      title: 'Memorial descritivo pronto em minutos',
                      description: 'Templates e estruturas prontas para documentação'
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4 lg:gap-5 group hover:bg-slate-800/30 p-2 sm:p-3 lg:p-4 rounded-lg transition-all duration-200">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/40 mt-0.5 sm:mt-1">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-base lg:text-lg font-semibold text-white leading-tight block mb-1">
                          {item.title}
                        </span>
                        <span className="text-xs sm:text-sm lg:text-base text-white font-light">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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