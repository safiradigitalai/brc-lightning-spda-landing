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
import { leadApi, type LeadData, type ApiResponse, type LeadResponse, handleApiError } from '@/lib/api';

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
  const [errors, setErrors] = useState<{name?: string; email?: string; whatsapp?: string; role?: string; lgpdConsent?: string; api?: string}>({});
  const [isExistingUser, setIsExistingUser] = useState(false);
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

  // Funções de formatação
  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (xx) xxxxx-xxxx ou (xx) xxxx-xxxx
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      const hasNinth = numbers.length > 10;
      if (hasNinth) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
      } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
      }
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Validação melhorada de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const commonDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'uol.com.br', 'terra.com.br'];
    
    if (!emailRegex.test(email)) {
      return 'Email deve ter um formato válido';
    }
    
    // Verificar se o domínio parece válido
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && domain.length < 3) {
      return 'Domínio do email muito curto';
    }
    
    return null;
  };

  // Validação de WhatsApp
  const validateWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return null;
    
    const numbers = whatsapp.replace(/\D/g, '');
    if (numbers.length < 10 || numbers.length > 11) {
      return 'WhatsApp deve ter 10 ou 11 dígitos';
    }
    
    // Verificar se o DDD é válido (11 a 99)
    const ddd = parseInt(numbers.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      return 'DDD inválido';
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; whatsapp?: string; role?: string; lgpdConsent?: string} = {};
    
    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Por favor, informe nome completo';
    }
    
    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailError = validateEmail(formData.email.trim());
      if (emailError) {
        newErrors.email = emailError;
      }
    }
    
    // Validação do WhatsApp
    const whatsappError = validateWhatsApp(formData.whatsapp);
    if (whatsappError) {
      newErrors.whatsapp = whatsappError;
    }
    
    // Validação do LGPD
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
    setErrors(prev => ({ ...prev, api: undefined }));
    
    try {
      // Preparar dados para envio
      const leadData: LeadData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        whatsapp: formData.whatsapp.trim() || undefined,
        role: formData.role.trim() || undefined,
        lgpd_consent: formData.lgpdConsent,
      };

      // Enviar para API
      const response = await leadApi.create(leadData);
      
      if (response.success && response.data) {
        // Sucesso - usuário novo ou existente
        setIsExistingUser(response.data.isExisting);
        onSuccess(response.data.email, response.data.name);
      } else {
        // Erro da API
        const errorMessage = handleApiError(response);
        
        // Verificar se é email ou WhatsApp duplicado
        if (response.code === 'DUPLICATE_DATA' || response.message?.includes('já cadastrado')) {
          // Se for WhatsApp duplicado, mostrar erro específico
          if (response.data?.field === 'whatsapp') {
            setErrors(prev => ({ 
              ...prev, 
              whatsapp: `Este WhatsApp já está cadastrado com o email: ${response.data?.existingEmail || 'email não informado'}`
            }));
          } else {
            // Email duplicado - permitir prosseguir
            setIsExistingUser(true);
            onSuccess(formData.email, formData.name);
          }
        } else {
          setErrors(prev => ({ ...prev, api: errorMessage }));
        }
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors(prev => ({ 
        ...prev, 
        api: 'Erro de conexão. Verifique sua internet e tente novamente.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'name' | 'email' | 'whatsapp' | 'role', value: string | boolean) => {
    let processedValue = value as string;
    
    // Aplicar formatação específica por campo
    if (field === 'whatsapp' && typeof value === 'string') {
      processedValue = formatWhatsApp(value);
    } else if (field === 'email' && typeof value === 'string') {
      processedValue = value.toLowerCase().trim();
    } else if (field === 'name' && typeof value === 'string') {
      // Capitalizar primeira letra de cada palavra
      processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
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
    <section className="bg-section-3 relative py-32 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-8 effect-grid"
          style={{
            transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px)`,
            filter: 'drop-shadow(0 0 8px var(--primary))'
          }}
        />
        
        {/* Energy Orbs Glassmorphism */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            animation: 'float 5s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full orb-coral-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animation: 'float 7s ease-in-out infinite reverse',
            animationDelay: '2s'
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

        {/* Floating Energy Particles Premium */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 3 === 0 ? 'particle-coral' : 'particle-cyan'
              }`}
              style={{
                left: `${15 + (i * 8)}%`,
                top: `${25 + (i % 5) * 12}%`,
                animationDelay: `${i * 0.6}s`,
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
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-8 py-2 sm:py-4 surface-glass-strong border border-glass rounded-full shadow-cyan-lg glass-hover max-w-[calc(100vw-32px)]">
              <Download className="w-4 h-4 sm:w-6 sm:h-6 text-gradient-cyan animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-gradient-cyan tracking-wide text-center">ACESSO EXCLUSIVO • DOWNLOAD IMEDIATO</span>
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-gradient-cyan flex-shrink-0" />
            </div>
          </div>

          {/* Título Cinematográfico */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight px-4">
            <span className="block text-secondary text-xl sm:text-2xl md:text-3xl font-light">BAIXE AGORA GRATUITAMENTE</span>
            <span className="block text-secondary text-xl sm:text-2xl md:text-3xl font-light">O VOLUME 1 DA SÉRIE</span>
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">&quot;GUIA DE SOBREVIVÊNCIA</span>
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">DO ENGENHEIRO SPDA&quot;</span>
          </h2>
          
          {/* Subtitle Editorial */}
          <div className="max-w-4xl mx-auto pt-4 sm:pt-6 px-4">
            <p className="text-base sm:text-xl md:text-2xl text-muted leading-relaxed font-light text-center">
              E receba também os <span className="text-accent font-bold">próximos volumes</span> direto no seu e-mail.
            </p>
          </div>
        </div>

        {/* Formulário Premium - Full Width */}
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="card-glass-strong rounded-3xl shadow-glow hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden">
              
              {/* Energy Corners */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* Header Premium */}
              <CardHeader className="relative p-4 sm:p-8 pb-4 sm:pb-6">
                <CardTitle className="relative text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 surface-glass rounded-2xl flex items-center justify-center mx-auto border border-glass shadow-cyan">
                    <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">ACESSO EXCLUSIVO</h3>
                    <p className="text-xs sm:text-sm text-muted font-light">Download imediato após o cadastro</p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-8 pt-0 space-y-6 sm:space-y-8">
                
                {/* Formulário Premium */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Campo Nome Premium */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary tracking-wide">
                      NOME COMPLETO <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5 text-muted" />
                      </div>
                      <Input
                        type="text"
                        placeholder="João Silva"
                        className={`pl-14 h-12 text-base surface-glass border ${errors.name ? 'border-red-400' : 'border-glass focus:border-primary hover:border-primary/60'} rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200`}
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
                    <label className="text-sm font-semibold text-primary tracking-wide">
                      E-MAIL PROFISSIONAL <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-muted" />
                      </div>
                      <Input
                        type="email"
                        placeholder="joao.silva@empresa.com"
                        className={`pl-14 h-12 text-base surface-glass border ${errors.email ? 'border-red-400' : 'border-glass focus:border-primary hover:border-primary/60'} rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200`}
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
                    <label className="text-sm font-semibold text-primary tracking-wide">
                      WHATSAPP
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5 text-muted" />
                      </div>
                      <Input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        className="pl-14 h-12 text-base surface-glass border border-glass focus:border-primary hover:border-primary/60 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Campo Cargo/Atuação */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary tracking-wide">
                      CARGO/ATUAÇÃO
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Briefcase className="w-5 h-5 text-muted" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Engenheiro Eletricista"
                        className="pl-14 h-12 text-base surface-glass border border-glass focus:border-primary hover:border-primary/60 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* LGPD Consent */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 surface-glass border border-glass rounded-lg">
                      <input
                        type="checkbox"
                        id="lgpd-consent"
                        checked={formData.lgpdConsent}
                        onChange={(e) => handleCheckboxChange('lgpdConsent', e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary surface-glass border-glass rounded focus:ring-primary focus:ring-2 cursor-pointer"
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <label htmlFor="lgpd-consent" className="text-sm text-muted leading-relaxed cursor-pointer">
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

                  {/* Erro da API */}
                  {errors.api && (
                    <div className="p-4 surface-glass border border-red-400/50 rounded-lg">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {errors.api}
                      </p>
                    </div>
                  )}

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
                    <span className="text-center leading-tight">{isLoading ? 'PROCESSANDO...' : 'BAIXAR GRÁTIS E APRENDER A EVITAR ERROS FATAIS'}</span>
                  </Button>
                </form>

                {/* Trust Indicators Premium */}
                <div className="surface-glass rounded-xl p-4 border border-glass">
                  <div className="flex flex-col space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-600 font-medium">Download instantâneo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">Sem spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-primary font-medium">Conteúdo técnico validado pela NBR 5419</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção "O que você vai descobrir" - Abaixo do formulário */}
        <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-0">
          <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Header da seção */}
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary mb-4">
                O QUE VOCÊ VAI DESCOBRIR
              </h3>
              <p className="text-lg text-muted font-light">
                Conteúdo exclusivo e prático para engenheiros especialistas
              </p>
            </div>

            {/* Grid de benefícios - 2 colunas */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
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
                <Card key={index} className="card-glass rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 surface-glass rounded-lg flex items-center justify-center flex-shrink-0 border border-glass shadow-cyan group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-2 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-muted font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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