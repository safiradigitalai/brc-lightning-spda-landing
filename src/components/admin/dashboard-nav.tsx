'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Download,
  LogOut,
  Shield,
  Zap,
  User,
  Clock,
  ChevronDown
} from 'lucide-react';

interface DashboardNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardNav({ activeSection, onSectionChange }: DashboardNavProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral'
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      description: 'Gerenciar leads'
    },
    {
      id: 'exports',
      label: 'Exportar',
      icon: Download,
      description: 'Exportar dados'
    }
  ];

  const formatLoginTime = (loginTime: string) => {
    const date = new Date(loginTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav className="w-72 h-screen surface-glass-strong border-r border-glass backdrop-blur-xl relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Energy Orb */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full orb-cyan-light opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        
        {/* Lightning Elements */}
        <div className="absolute bottom-10 right-4 w-px h-20 bg-gradient-to-t from-primary to-transparent opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header */}
        <div className="p-6 border-b border-glass">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 surface-glass rounded-xl flex items-center justify-center border border-glass shadow-cyan">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                BRC ADMIN
              </h1>
              <p className="text-xs text-muted">Painel de Controle</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          <div className="space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'surface-glass-strong border border-glass shadow-cyan text-primary' 
                      : 'hover:surface-glass hover:border hover:border-glass/50 text-muted hover:text-primary'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted group-hover:text-primary'} transition-colors`} />
                  <div className="text-left">
                    <div className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-secondary group-hover:text-primary'} transition-colors`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-muted">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="ml-auto">
                      <Zap className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-glass">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl surface-glass hover:surface-glass-strong border border-glass hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-10 h-10 surface-glass-strong rounded-lg flex items-center justify-center border border-glass">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm text-primary">
                  {user?.username}
                </div>
                <div className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {user?.loginTime ? formatLoginTime(user.loginTime) : 'N/A'}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted group-hover:text-primary transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 surface-glass-strong border border-glass rounded-xl shadow-cyan overflow-hidden">
                <div className="p-3 border-b border-glass">
                  <div className="text-xs text-muted uppercase tracking-wide font-semibold">
                    Sessão Ativa
                  </div>
                  <div className="text-sm text-primary font-medium mt-1">
                    Administrador
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10 hover:border-red-400/40 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair do Sistema
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
      `}</style>
    </nav>
  );
}