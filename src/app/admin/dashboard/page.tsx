'use client';

import { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/admin/dashboard-nav';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { LeadsTable } from '@/components/admin/leads-table';
import { ExportData } from '@/components/admin/export-data';
import { EditLeadModal } from '@/components/admin/edit-lead-modal';
import { DeleteLeadModal } from '@/components/admin/delete-lead-modal';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

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

export default function AdminDashboard() {
  const { isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-primary text-lg">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      // API call to update lead
      const response = await fetch(`http://localhost:3001/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Trigger refresh of components
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  const handleDeleteLeadConfirm = async (leadId: string) => {
    try {
      // API call to delete lead
      const response = await fetch(`http://localhost:3001/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Trigger refresh of components
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats key={refreshTrigger} />;
      case 'leads':
        return (
          <LeadsTable 
            key={refreshTrigger}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
          />
        );
      case 'exports':
        return <ExportData key={refreshTrigger} />;
      default:
        return <DashboardStats key={refreshTrigger} />;
    }
  };

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Electric Grid */}
        <div 
          className="absolute inset-0 opacity-3 effect-grid"
          style={{
            transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
            filter: 'drop-shadow(0 0 6px var(--primary))'
          }}
        />
        
        {/* Energy Orbs */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full orb-cyan-light opacity-10"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full orb-coral-light opacity-10"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            animation: 'float 15s ease-in-out infinite reverse',
            animationDelay: '5s'
          }}
        />

        {/* Lightning Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px)`
          }}
        >
          <div className="absolute top-1/4 right-1/4 w-px h-20 bg-gradient-to-b from-primary via-primary to-transparent opacity-20 animate-pulse" />
          <div className="absolute bottom-1/3 left-1/2 w-16 h-px bg-gradient-to-r from-primary via-primary to-transparent opacity-20 animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex relative z-10">
        {/* Navigation Sidebar */}
        <DashboardNav 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        lead={selectedLead}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLead(null);
        }}
        onSave={handleSaveLead}
      />

      <DeleteLeadModal
        isOpen={isDeleteModalOpen}
        lead={selectedLead}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLead(null);
        }}
        onDelete={handleDeleteLeadConfirm}
      />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}