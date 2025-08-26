'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  Mail,
  User,
  Calendar,
  Shield
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  role?: string;
  created_at: string;
}

interface DeleteLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onDelete: (leadId: string) => Promise<void>;
}

export function DeleteLeadModal({ isOpen, lead, onClose, onDelete }: DeleteLeadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
    }
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(lead.id);
      onClose();
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full orb-coral-light opacity-40"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full orb-cyan-light opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animation: 'float 8s ease-in-out infinite reverse',
            animationDelay: '2s'
          }}
        />
      </div>

      <Card className="w-full max-w-md card-glass-strong rounded-3xl shadow-glow border border-glass relative animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden">
        
        {/* Energy Corners */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-400 to-orange-400 rounded-full shadow-lg animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-red-400 to-orange-400 rounded-full shadow-lg animate-pulse" style={{animationDelay: '1s'}} />
        
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 p-2 hover:surface-glass rounded-full transition-colors border border-glass hover:border-primary/40 disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <CardHeader className="text-center pb-4 relative">
          <div className="mx-auto w-16 h-16 surface-glass-strong rounded-2xl flex items-center justify-center mb-4 border border-red-400/30 shadow-lg bg-gradient-to-br from-red-400/10 to-orange-400/10">
            <AlertTriangle className="w-8 h-8 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
          
          <div className="space-y-4">
            <div className="text-2xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Confirmar Exclusão
            </div>
            <p className="text-muted font-light text-sm">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          
          {/* Warning Message */}
          <div className="surface-glass rounded-xl p-4 border border-red-400/30 bg-gradient-to-br from-red-400/5 to-orange-400/5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-400">
                  Atenção! Você está prestes a excluir este lead:
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  Todos os dados relacionados a este lead serão removidos permanentemente do sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Lead Info */}
          <div className="surface-glass rounded-xl p-4 border border-glass">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 surface-glass-strong rounded-lg flex items-center justify-center border border-glass">
                  <span className="text-sm font-bold text-primary">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3 h-3 text-muted" />
                    <span className="font-semibold text-primary">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Mail className="w-3 h-3 text-muted" />
                    <span className="text-muted">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <Calendar className="w-3 h-3 text-muted" />
                    <span className="text-muted">Cadastrado em {formatDate(lead.created_at)}</span>
                  </div>
                </div>
              </div>

              {lead.role && (
                <div className="pt-2 border-t border-glass/50">
                  <span className="text-xs text-muted">Função: </span>
                  <span className="text-xs text-primary font-medium">{lead.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Para confirmar, digite <strong className="text-red-400">EXCLUIR</strong> no campo abaixo:
            </p>
            <input
              type="text"
              placeholder="Digite EXCLUIR para confirmar"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-4 py-3 surface-glass border border-glass focus:border-red-400 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200 text-center"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
              onClick={handleDelete}
              disabled={confirmationText.toUpperCase() !== 'EXCLUIR' || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white hover:from-red-600 hover:via-red-700 hover:to-red-600 shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_45px_rgba(239,68,68,0.8)] transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Excluir Lead
                </>
              )}
            </Button>
          </div>

          {/* Final Warning */}
          <div className="text-center">
            <p className="text-xs text-red-400/80">
              ⚠️ Esta ação é irreversível
            </p>
          </div>
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