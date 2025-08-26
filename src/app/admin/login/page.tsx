'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Zap
} from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('brc_admin_auth') === 'true';
    if (isLoggedIn) {
      router.push('/admin/dashboard');
      return;
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.username === 'admin' && formData.password === 'admin') {
      // Store auth in localStorage
      localStorage.setItem('brc_admin_auth', 'true');
      localStorage.setItem('brc_admin_user', JSON.stringify({
        username: 'admin',
        role: 'administrator',
        loginTime: new Date().toISOString()
      }));
      
      router.push('/admin/dashboard');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden flex items-center justify-center p-4">
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
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full orb-cyan-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full orb-coral-light animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animation: 'float 8s ease-in-out infinite reverse',
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

        {/* Floating Particles */}
        <div className={`absolute inset-0 transition-opacity duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 3 === 0 ? 'particle-coral' : 'particle-cyan'
              }`}
              style={{
                left: `${15 + (i * 7)}%`,
                top: `${25 + (i % 4) * 18}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className={`transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="card-glass-strong rounded-3xl shadow-glow hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden border border-glass">
            
            {/* Energy Corners */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse" style={{animationDelay: '1s'}} />
            
            {/* Header */}
            <CardHeader className="text-center pb-6 relative">
              <div className="mx-auto w-20 h-20 surface-glass-strong rounded-2xl flex items-center justify-center mb-6 border border-glass shadow-cyan">
                <Shield className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
              </div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 surface-glass border border-glass rounded-full shadow-cyan-lg">
                  <Zap className="w-5 h-5 text-gradient-cyan animate-pulse" />
                  <span className="text-sm font-bold text-gradient-cyan tracking-wide">PAINEL ADMINISTRATIVO</span>
                  <Shield className="w-5 h-5 text-gradient-cyan" />
                </div>
                
                <div className="text-3xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
                  BRC ADMIN
                </div>
                <p className="text-muted font-light">Acesso restrito aos administradores</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Error Message */}
                {error && (
                  <div className="p-4 surface-glass border border-red-400/50 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </p>
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary tracking-wide">
                    USUÁRIO
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-muted" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Digite seu usuário"
                      className="pl-14 h-12 text-base surface-glass border border-glass focus:border-primary hover:border-primary/60 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary tracking-wide">
                    SENHA
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      className="pl-14 pr-14 h-12 text-base surface-glass border border-glass focus:border-primary hover:border-primary/60 rounded-lg font-medium text-primary placeholder:text-muted focus:surface-glass-strong transition-all duration-200"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="group w-full h-14 text-lg font-black bg-gradient-to-r from-primary via-cyan-400 to-primary text-white hover:from-cyan-400 hover:via-primary hover:to-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 text-white animate-spin" />
                      VERIFICANDO...
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 mr-3 text-white group-hover:animate-pulse drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
                      ACESSAR PAINEL
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="surface-glass rounded-xl p-4 border border-glass">
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted font-medium">CREDENCIAIS DE DEMONSTRAÇÃO</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <span className="text-primary font-mono">Usuário: admin</span>
                    <span className="text-primary font-mono">Senha: admin</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .particle-cyan {
          background: var(--primary);
          box-shadow: 0 0 8px rgba(0, 229, 255, 0.6), 0 0 16px rgba(0, 229, 255, 0.4);
        }
        
        .particle-coral {
          background: var(--accent);
          box-shadow: 0 0 6px rgba(255, 107, 71, 0.5), 0 0 12px rgba(255, 107, 71, 0.3);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}