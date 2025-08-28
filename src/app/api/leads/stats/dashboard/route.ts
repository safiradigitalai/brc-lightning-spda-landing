import { NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';

// GET /api/leads/stats/dashboard - Obter estatísticas específicas do dashboard
export async function GET() {
  try {
    // Durante o build, retorna uma resposta mock
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        data: { totalLeads: 0, todayLeads: 0, weekLeads: 0, utmSources: {} },
        message: 'Mock stats for build'
      });
    }

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