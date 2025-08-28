import { NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';

// Next.js 15 runtime configuration for Node.js APIs
export const runtime = 'nodejs';

// GET /api/leads/stats - Obter estatísticas dos leads
export async function GET() {
  try {
    const stats = await Lead.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Estatísticas recuperadas com sucesso'
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}