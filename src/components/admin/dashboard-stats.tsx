'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target,
  Activity,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { leadApi } from '@/lib/api';

interface StatsData {
  totalLeads: number;
  todayLeads: number;
  weekLeads: number;
  utmSources: Record<string, number>;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalLeads: 0,
    todayLeads: 0,
    weekLeads: 0,
    utmSources: {}
  });
  const [isLoading, setIsLoading] = useState(true);
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
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await leadApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Leads',
      value: stats.totalLeads,
      icon: Users,
      description: 'Leads capturados',
      color: 'primary',
      gradient: 'from-primary via-cyan-400 to-primary'
    },
    {
      title: 'Hoje',
      value: stats.todayLeads,
      icon: Calendar,
      description: 'Leads de hoje',
      color: 'accent',
      gradient: 'from-accent via-orange-400 to-accent'
    },
    {
      title: 'Esta Semana',
      value: stats.weekLeads,
      icon: TrendingUp,
      description: 'Últimos 7 dias',
      color: 'primary',
      gradient: 'from-green-400 via-emerald-400 to-green-400'
    },
    {
      title: 'Fontes UTM',
      value: Object.keys(stats.utmSources).length,
      icon: Globe,
      description: 'Canais ativos',
      color: 'accent',
      gradient: 'from-purple-400 via-violet-400 to-purple-400'
    }
  ];

  const topUtmSources = Object.entries(stats.utmSources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-glass rounded-xl animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                    <div className="h-8 bg-primary/20 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-1/4 w-64 h-64 rounded-full orb-cyan-light opacity-20"
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`,
            animation: 'float 12s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full orb-coral-light opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            animation: 'float 10s ease-in-out infinite reverse',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 surface-glass-strong rounded-xl flex items-center justify-center border border-glass shadow-cyan">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
              Dashboard Analytics
            </h1>
            <p className="text-muted">Visão geral dos leads e performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <Card key={index} className="group card-glass-strong rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden relative">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 surface-glass rounded-lg flex items-center justify-center border border-glass shadow-cyan`}>
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted uppercase tracking-wide">
                            {stat.title}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                          {stat.value.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-accent rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* UTM Sources Chart */}
        {topUtmSources.length > 0 && (
          <Card className="card-glass-strong rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 surface-glass rounded-lg flex items-center justify-center border border-glass">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xl font-bold text-primary">
                  Top Fontes de Tráfego
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topUtmSources.map(([source, count], index) => {
                const percentage = (count / stats.totalLeads) * 100;
                
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 surface-glass rounded-md flex items-center justify-center border border-glass">
                          <span className="text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-semibold text-primary capitalize">
                          {source}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">
                          {count} leads
                        </span>
                        <span className="text-xs text-primary font-semibold">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 surface-glass rounded-full overflow-hidden border border-glass">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Last Update */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted mt-6">
          <Clock className="w-3 h-3" />
          <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
          <Zap className="w-3 h-3 text-primary animate-pulse" />
        </div>
      </div>

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