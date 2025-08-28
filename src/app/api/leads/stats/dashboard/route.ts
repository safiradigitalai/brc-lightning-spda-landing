import { NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';

// Next.js 15 runtime configuration for Node.js APIs
export const runtime = 'nodejs';

// GET /api/leads/stats/dashboard - Obter estatísticas específicas do dashboard
export async function GET() {
  try {
    const stats = await Lead.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        totalLeads: stats.totalLeads,
        todayLeads: stats.todayLeads,
        weekLeads: stats.weekLeads,
        utmSources: stats.utmSources
      },
      message: 'Estatísticas do dashboard recuperadas com sucesso'
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}