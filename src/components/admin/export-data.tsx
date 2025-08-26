'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Calendar,
  Filter,
  Users,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { leadApi } from '@/lib/api';

// Dynamic import for PDF functionality
let jsPDFModule: any = null;

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

export function ExportData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ type: string; status: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: '',
    status: 'idle',
    message: ''
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [totalLeads, setTotalLeads] = useState(0);

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
    loadLeadsData();
  }, []);

  const loadLeadsData = async () => {
    try {
      // Load basic stats
      const statsResponse = await leadApi.getStats();
      if (statsResponse.success && statsResponse.data) {
        setTotalLeads(statsResponse.data.totalLeads);
      }

      // Load all leads for export (we would normally paginate this)
      const response = await fetch('http://localhost:3001/api/leads?limit=1000');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data.leads);
      }
    } catch (error) {
      console.error('Error loading leads data:', error);
    }
  };

  const exportToCSV = async () => {
    setExportStatus({ type: 'CSV', status: 'loading', message: 'Preparando arquivo CSV...' });
    
    try {
      // Prepare data
      const csvData = leads.map(lead => ({
        'Nome': lead.name,
        'Email': lead.email,
        'WhatsApp': lead.whatsapp || '',
        'Cargo/Função': lead.role || '',
        'Fonte UTM': lead.utm_source || '',
        'Mídia UTM': lead.utm_medium || '',
        'Campanha UTM': lead.utm_campaign || '',
        'Data de Cadastro': new Date(lead.created_at).toLocaleString('pt-BR'),
        'Última Atualização': new Date(lead.updated_at).toLocaleString('pt-BR')
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `BRC_Leads_${timestamp}.csv`;

      // Download
      XLSX.writeFile(wb, filename);
      
      setExportStatus({ 
        type: 'CSV', 
        status: 'success', 
        message: `${leads.length} leads exportados com sucesso!` 
      });

    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportStatus({ 
        type: 'CSV', 
        status: 'error', 
        message: 'Erro ao exportar arquivo CSV' 
      });
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setExportStatus({ type: '', status: 'idle', message: '' });
    }, 3000);
  };

  const exportToExcel = async () => {
    setExportStatus({ type: 'Excel', status: 'loading', message: 'Preparando planilha Excel...' });
    
    try {
      // Prepare data with more detailed formatting
      const excelData = leads.map(lead => ({
        'Nome Completo': lead.name,
        'E-mail': lead.email,
        'WhatsApp': lead.whatsapp || 'Não informado',
        'Cargo/Função': lead.role || 'Não informado',
        'Fonte UTM': lead.utm_source || 'Não informado',
        'Mídia UTM': lead.utm_medium || 'Não informado',
        'Campanha UTM': lead.utm_campaign || 'Não informado',
        'Data de Cadastro': new Date(lead.created_at).toLocaleString('pt-BR'),
        'Última Atualização': new Date(lead.updated_at).toLocaleString('pt-BR')
      }));

      // Create workbook with styling
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 25 }, // Nome
        { wch: 30 }, // Email
        { wch: 15 }, // WhatsApp
        { wch: 20 }, // Cargo
        { wch: 15 }, // UTM Source
        { wch: 15 }, // UTM Medium
        { wch: 20 }, // UTM Campaign
        { wch: 20 }, // Data Cadastro
        { wch: 20 }  // Última Atualização
      ];
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leads BRC');

      // Add summary sheet
      const summaryData = [
        { 'Métrica': 'Total de Leads', 'Valor': leads.length },
        { 'Métrica': 'Data da Exportação', 'Valor': new Date().toLocaleString('pt-BR') },
        { 'Métrica': 'Leads com WhatsApp', 'Valor': leads.filter(l => l.whatsapp).length },
        { 'Métrica': 'Leads com Cargo', 'Valor': leads.filter(l => l.role).length }
      ];
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `BRC_Leads_Completo_${timestamp}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);
      
      setExportStatus({ 
        type: 'Excel', 
        status: 'success', 
        message: `Planilha com ${leads.length} leads exportada!` 
      });

    } catch (error) {
      console.error('Error exporting Excel:', error);
      setExportStatus({ 
        type: 'Excel', 
        status: 'error', 
        message: 'Erro ao exportar planilha Excel' 
      });
    }

    setTimeout(() => {
      setExportStatus({ type: '', status: 'idle', message: '' });
    }, 3000);
  };

  const exportToPDF = async () => {
    setExportStatus({ type: 'PDF', status: 'loading', message: 'Gerando relatório PDF...' });
    
    try {
      // Load PDF module if not loaded
      if (!jsPDFModule) {
        jsPDFModule = (await import('jspdf')).default;
      }
      
      const pdf = new jsPDFModule();
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 229, 255);
      pdf.text('BRC - Relatório de Leads', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 40);
      pdf.text(`Total de leads: ${leads.length}`, 20, 50);

      // Summary statistics
      const leadsWithWhatsApp = leads.filter(l => l.whatsapp).length;
      const leadsWithRole = leads.filter(l => l.role).length;
      const utmSources = [...new Set(leads.filter(l => l.utm_source).map(l => l.utm_source))];

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Resumo Estatístico:', 20, 70);
      
      pdf.setFontSize(10);
      pdf.text(`• Leads com WhatsApp: ${leadsWithWhatsApp} (${((leadsWithWhatsApp/leads.length)*100).toFixed(1)}%)`, 25, 80);
      pdf.text(`• Leads com cargo informado: ${leadsWithRole} (${((leadsWithRole/leads.length)*100).toFixed(1)}%)`, 25, 90);
      pdf.text(`• Fontes UTM únicas: ${utmSources.length}`, 25, 100);

      // Create table manually using native jsPDF
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 110;
      
      // Table header
      pdf.setFillColor(0, 229, 255);
      pdf.rect(20, yPosition, pageWidth - 40, 10, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      const headers = ['NOME', 'EMAIL', 'WHATSAPP', 'CARGO', 'FONTE', 'DATA'];
      const colWidths = [35, 50, 25, 30, 25, 25];
      let xPos = 25;
      
      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPosition + 7);
        xPos += colWidths[i];
      });

      // Table rows
      yPosition += 10;
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(7);
      
      leads.forEach((lead, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 30;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');
        }
        
        xPos = 25;
        const rowData = [
          lead.name.length > 15 ? lead.name.substring(0, 15) + '...' : lead.name,
          lead.email.length > 20 ? lead.email.substring(0, 20) + '...' : lead.email,
          lead.whatsapp || '-',
          (lead.role && lead.role.length > 12) ? lead.role.substring(0, 12) + '...' : (lead.role || '-'),
          lead.utm_source || '-',
          new Date(lead.created_at).toLocaleDateString('pt-BR')
        ];
        
        rowData.forEach((data, i) => {
          pdf.text(String(data), xPos, yPosition + 5);
          xPos += colWidths[i];
        });
        
        yPosition += 8;
      });

      // Footer
      const pageCount = (pdf as any).internal.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('BRC Consultoria - Relatório Confidencial', 20, pdf.internal.pageSize.height - 10);

      // Generate filename and download
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `BRC_Relatorio_Leads_${timestamp}.pdf`;
      
      pdf.save(filename);
      
      setExportStatus({ 
        type: 'PDF', 
        status: 'success', 
        message: `Relatório PDF com ${leads.length} leads gerado!` 
      });

    } catch (error) {
      console.error('Error exporting PDF:', error);
      setExportStatus({ 
        type: 'PDF', 
        status: 'error', 
        message: 'Erro ao gerar relatório PDF' 
      });
    }

    setTimeout(() => {
      setExportStatus({ type: '', status: 'idle', message: '' });
    }, 3000);
  };

  const exportOptions = [
    {
      id: 'csv',
      title: 'Exportar CSV',
      description: 'Arquivo simples para planilhas',
      icon: FileText,
      color: 'from-green-400 to-emerald-400',
      action: exportToCSV
    },
    {
      id: 'excel',
      title: 'Exportar Excel',
      description: 'Planilha completa com formatação',
      icon: FileSpreadsheet,
      color: 'from-blue-400 to-cyan-400',
      action: exportToExcel
    },
    {
      id: 'pdf',
      title: 'Relatório PDF',
      description: 'Documento profissional com estatísticas',
      icon: File,
      color: 'from-red-400 to-pink-400',
      action: exportToPDF
    }
  ];

  return (
    <div className="space-y-8 relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 right-1/4 w-64 h-64 rounded-full orb-cyan-light opacity-15"
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`,
            animation: 'float 12s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full orb-coral-light opacity-15"
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
            <Download className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
              Exportar Dados
            </h1>
            <p className="text-muted">Baixe os dados dos leads em diferentes formatos</p>
          </div>
        </div>

        {/* Stats Summary */}
        <Card className="card-glass-strong rounded-xl shadow-cyan border border-glass mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-primary">Dados Disponíveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="surface-glass rounded-lg p-4 border border-glass text-center">
                <div className="text-2xl font-black text-primary">{totalLeads}</div>
                <div className="text-sm text-muted">Total Leads</div>
              </div>
              <div className="surface-glass rounded-lg p-4 border border-glass text-center">
                <div className="text-2xl font-black text-accent">{leads.filter(l => l.whatsapp).length}</div>
                <div className="text-sm text-muted">Com WhatsApp</div>
              </div>
              <div className="surface-glass rounded-lg p-4 border border-glass text-center">
                <div className="text-2xl font-black text-primary">{leads.filter(l => l.role).length}</div>
                <div className="text-sm text-muted">Com Cargo</div>
              </div>
              <div className="surface-glass rounded-lg p-4 border border-glass text-center">
                <div className="text-2xl font-black text-accent">{[...new Set(leads.filter(l => l.utm_source).map(l => l.utm_source))].length}</div>
                <div className="text-sm text-muted">Fontes UTM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isLoading = exportStatus.status === 'loading' && exportStatus.type === option.title.split(' ')[1];
            const isSuccess = exportStatus.status === 'success' && exportStatus.type === option.title.split(' ')[1];
            const isError = exportStatus.status === 'error' && exportStatus.type === option.title.split(' ')[1];
            
            return (
              <Card key={option.id} className="group card-glass-strong rounded-xl shadow-cyan hover:shadow-cyan-lg glass-hover transition-all duration-500 overflow-hidden relative">
                
                {/* Energy Corner */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-cyan-300 rounded-full shadow-cyan animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    
                    {/* Icon & Title */}
                    <div className="space-y-3">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${option.color} shadow-lg`}>
                        <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Message */}
                    {(isLoading || isSuccess || isError) && (
                      <div className={`p-3 rounded-lg border ${
                        isLoading ? 'surface-glass border-primary/30' :
                        isSuccess ? 'bg-green-500/10 border-green-400/30' :
                        'bg-red-500/10 border-red-400/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                          {isSuccess && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {isError && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          <span className={`text-sm font-medium ${
                            isLoading ? 'text-primary' :
                            isSuccess ? 'text-green-400' :
                            'text-red-400'
                          }`}>
                            {exportStatus.message}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Export Button */}
                    <Button
                      onClick={option.action}
                      disabled={isLoading}
                      className={`w-full h-12 bg-gradient-to-r ${option.color} text-white hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          {option.title}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted mt-8">
          <Clock className="w-3 h-3" />
          <span>Dados atualizados: {new Date().toLocaleString('pt-BR')}</span>
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