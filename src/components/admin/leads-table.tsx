'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { leadApi } from '@/lib/api';

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

interface LeadsTableProps {
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadsTable({ onEdit, onDelete }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const limit = 10;

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
    loadLeads();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    // Reset page when search changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadLeads();
    }
  }, [searchTerm]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      // Note: This would need to be implemented in the API
      // For now, we'll simulate the API call
      const response = await fetch(`/api/leads?page=${currentPage}&limit=${limit}&orderBy=${sortBy}&order=${sortOrder}`);
      const data = await response.json();
      
      if (data.success) {
        let filteredLeads = data.data.leads;
        
        // Client-side filtering for search (in production, this should be server-side)
        if (searchTerm) {
          filteredLeads = filteredLeads.filter((lead: Lead) => 
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.whatsapp?.includes(searchTerm)
          );
        }
        
        setLeads(filteredLeads);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUtmBadge = (lead: Lead) => {
    if (!lead.utm_source) return null;
    
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 surface-glass border border-glass rounded-md">
        <ExternalLink className="w-3 h-3 text-primary" />
        <span className="text-xs font-medium text-primary">
          {lead.utm_source}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="card-glass-strong rounded-xl shadow-cyan">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-primary">Carregando leads...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-40 right-1/3 w-48 h-48 rounded-full orb-cyan-light opacity-15"
          style={{
            transform: `translate(${mousePosition.x * -0.005}px, ${mousePosition.y * -0.005}px)`,
            animation: 'float 15s ease-in-out infinite'
          }}
        />
      </div>

      {/* Header & Search */}
      <div className="relative z-10">
        <Card className="card-glass-strong rounded-xl shadow-cyan border border-glass">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 surface-glass-strong rounded-xl flex items-center justify-center border border-glass shadow-cyan">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
                    Gerenciar Leads
                  </h2>
                  <p className="text-sm text-muted font-normal">
                    {total} leads cadastrados
                  </p>
                </div>
              </CardTitle>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Buscar por nome, email..."
                  className="pl-10 w-72 surface-glass border border-glass focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Table */}
        <Card className="card-glass-strong rounded-xl shadow-cyan border border-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass">
                  <th className="text-left py-4 px-6 text-sm font-bold text-primary uppercase tracking-wide">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      Lead
                      {sortBy === 'name' && (
                        <span className="text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-primary uppercase tracking-wide">
                    Contato
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-primary uppercase tracking-wide">
                    Origem
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-primary uppercase tracking-wide">
                    <button 
                      onClick={() => handleSort('created_at')}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      Data
                      {sortBy === 'created_at' && (
                        <span className="text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-primary uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr 
                    key={lead.id} 
                    className={`border-b border-glass/50 hover:surface-glass transition-colors duration-200 ${
                      selectedLead === lead.id ? 'surface-glass-strong' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 surface-glass-strong rounded-lg flex items-center justify-center border border-glass">
                          <span className="text-sm font-bold text-primary">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-primary">
                            {lead.name}
                          </div>
                          {lead.role && (
                            <div className="text-sm text-muted">
                              {lead.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted" />
                          <span className="text-primary">{lead.email}</span>
                        </div>
                        {lead.whatsapp && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted" />
                            <span className="text-muted">{lead.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      {getUtmBadge(lead)}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(lead)}
                          className="surface-glass border-glass hover:border-primary hover:surface-glass-strong text-primary hover:text-accent transition-all duration-200 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(lead)}
                          className="surface-glass border-glass hover:border-red-400 hover:surface-glass-strong text-muted hover:text-red-400 transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-glass">
              <div className="text-sm text-muted">
                Página {currentPage} de {totalPages} ({total} leads)
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="surface-glass border-glass hover:border-primary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="px-3 py-1 text-sm font-medium text-primary">
                  {currentPage}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="surface-glass border-glass hover:border-primary"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {leads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted mb-2">
                Nenhum lead encontrado
              </h3>
              <p className="text-sm text-muted">
                {searchTerm ? 'Tente ajustar sua busca' : 'Os leads aparecerão aqui quando forem capturados'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}