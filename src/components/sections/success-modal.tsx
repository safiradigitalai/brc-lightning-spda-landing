'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  X, 
  ExternalLink 
} from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  name: string;
}

export function SuccessModal({ isOpen, onClose, email, name }: SuccessModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Simular download do e-book
    const link = document.createElement('a');
    link.href = '/ebook-sample.pdf'; // Substituir pelo link real
    link.download = 'Guia-Completo-Crescimento-Empresarial.pdf';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.4)] relative animate-in fade-in-0 zoom-in-95 duration-300 rounded-2xl overflow-hidden">
        
        {/* Energy Corners */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-pulse" style={{animationDelay: '1s'}} />
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-slate-700/50 rounded-full transition-colors border border-slate-600/50 hover:border-primary/40"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <CardHeader className="text-center pb-6 relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/15 rounded-2xl flex items-center justify-center mb-6 border border-primary/50 shadow-[0_0_25px_rgba(0,229,255,0.4)]">
            <CheckCircle className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] mb-3">
            Parabéns, {name.split(' ')[0]}! 🎉
          </CardTitle>
          <p className="text-xl text-slate-300 font-light">
            Seu e-book está pronto para download
          </p>
        </CardHeader>

        <CardContent className="space-y-8 relative">
          
          {/* Confirmação */}
          <div className="bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 border border-primary/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/40">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Email de confirmação enviado
                </h3>
                <p className="text-slate-300 text-sm">
                  Verifique sua caixa de entrada: <strong className="text-primary">{email}</strong>
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Enviamos o link de download direto para seu email. 
              Se não receber em alguns minutos, verifique a pasta de spam.
            </p>
          </div>

          {/* Download Direto */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Ou baixe agora mesmo:
            </h3>
            
            <Button 
              size="lg"
              className="group h-16 px-10 text-lg font-bold bg-gradient-to-r from-primary via-cyan-400 to-primary text-white hover:from-cyan-400 hover:via-primary hover:to-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-500 hover:scale-105 cursor-pointer"
              onClick={handleDownload}
            >
              <Download className="w-6 h-6 mr-3 text-white group-hover:animate-bounce drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
              BAIXAR E-BOOK BRC VOLUME 1
            </Button>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 border border-primary/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <h3 className="font-bold mb-6 flex items-center gap-3 text-white text-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              Próximos passos:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-300 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                  1
                </div>
                <span className="text-slate-300 leading-relaxed">Leia os 5 erros críticos identificados no e-book</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-300 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                  2
                </div>
                <span className="text-slate-300 leading-relaxed">Aplique as soluções práticas em seus próximos laudos</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-300 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                  3
                </div>
                <span className="text-slate-300 leading-relaxed">Acompanhe nossos emails com dicas técnicas exclusivas</span>
              </li>
            </ul>
          </div>

          {/* Ação Secundária */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="h-12 px-8 text-base font-semibold border-2 border-primary/60 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all duration-500 backdrop-blur-sm cursor-pointer"
            >
              Continuar Navegando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}