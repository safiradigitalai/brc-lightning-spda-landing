'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Save,
  Loader2,
  AlertTriangle,
  Edit,
  Zap,
  CheckCircle
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  role?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
  updated_at: string;
}

interface EditLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSave: (leadId: string, updates: Partial<Lead>) => Promise<void>;
}

export function EditLeadModal({ isOpen, lead, onClose, onSave }: EditLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        whatsapp: lead.whatsapp || '',
        role: lead.role || '',
      });
      setErrors({});
    }
  }, [isOpen, lead]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isOpen || !lead) return null;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
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
    
    if (formData.whatsapp && !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp deve ter formato válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSave(lead.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
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

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full orb-cyan-light opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full orb-coral-light opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animation: 'float 8s ease-in-out infinite reverse',
            animationDelay: '2s'
          }}
        />
      </div>

      <Card className="w-full max-w-2xl card-glass-strong rounded-3xl shadow-glow border border-glass relative animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden">
        
        {/* Energy Corners */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" style={{animationDelay: '1s'}} />
        
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 p-2 hover:surface-glass rounded-full transition-colors border border-glass hover:border-primary/40 disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <CardHeader className="text-center pb-6 relative">
          <div className="mx-auto w-16 h-16 surface-glass-strong rounded-2xl flex items-center justify-center mb-4 border border-glass shadow-cyan">
            <Edit className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 surface-glass border border-glass rounded-full shadow-cyan-lg">
              <Zap className="w-4 h-4 text-gradient-cyan animate-pulse" />
              <span className="text-sm font-bold text-gradient-cyan tracking-wide">EDITAR LEAD</span>
              <CheckCircle className="w-4 h-4 text-gradient-cyan" />
            </div>
            
            <div className="text-2xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
              {lead.name}
            </div>
            <p className="text-muted font-light text-sm">
              Cadastrado em {new Date(lead.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary tracking-wide">
                NOME COMPLETO *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-muted" />
                </div>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  className={`pl-14 h-12 text-base surface-glass border ${errors.name ? 'border-red-400' : 'border-glass focus:border-primary hover:border-primary/60'} rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200`}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary tracking-wide">
                E-MAIL *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-muted" />
                </div>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  className={`pl-14 h-12 text-base surface-glass border ${errors.email ? 'border-red-400' : 'border-glass focus:border-primary hover:border-primary/60'} rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* WhatsApp Field */}
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
                  className={`pl-14 h-12 text-base surface-glass border ${errors.whatsapp ? 'border-red-400' : 'border-glass focus:border-primary hover:border-primary/60'} rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200`}
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', formatWhatsApp(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              {errors.whatsapp && (
                <p className="text-red-400 text-sm flex items-center gap-1 ml-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary tracking-wide">
                CARGO/FUNÇÃO
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Briefcase className="w-5 h-5 text-muted" />
                </div>
                <Input
                  type="text"
                  placeholder="Engenheiro, Arquiteto..."
                  className="pl-14 h-12 text-base surface-glass border border-glass focus:border-primary hover:border-primary/60 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* UTM Info (Read Only) */}
            {lead.utm_source && (
              <div className="surface-glass rounded-xl p-4 border border-glass">
                <h3 className="text-sm font-bold text-primary mb-2">ORIGEM DO LEAD</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted">Fonte:</span>
                    <span className="text-primary font-medium ml-2">{lead.utm_source}</span>
                  </div>
                  {lead.utm_medium && (
                    <div>
                      <span className="text-muted">Mídia:</span>
                      <span className="text-primary font-medium ml-2">{lead.utm_medium}</span>
                    </div>
                  )}
                  {lead.utm_campaign && (
                    <div className="col-span-2">
                      <span className="text-muted">Campanha:</span>
                      <span className="text-primary font-medium ml-2">{lead.utm_campaign}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-12 surface-glass border-glass hover:border-primary/60 text-primary hover:surface-glass-strong transition-all duration-200 cursor-pointer"
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-primary via-cyan-400 to-primary text-white hover:from-cyan-400 hover:via-primary hover:to-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}