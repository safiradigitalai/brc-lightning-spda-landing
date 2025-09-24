import { NextResponse } from 'next/server';
import { KommoService } from '@/lib/services/kommo';

export const runtime = 'nodejs';

// GET /api/kommo/test - Testar conexão com Kommo
export async function GET() {
  try {
    console.log('Testando conexão com Kommo...');

    const testResult = await KommoService.testConnection();

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Conexão com Kommo estabelecida com sucesso',
        data: {
          status: 'connected',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com Kommo',
        error: testResult.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro ao testar conexão com Kommo:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao testar conexão com Kommo',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// POST /api/kommo/test - Testar criação de lead no Kommo
export async function POST() {
  try {
    console.log('Testando criação de lead no Kommo...');

    const testLeadData = {
      name: 'Lead de Teste - BRC',
      email: 'teste@brc-lightning.com',
      whatsapp: '+5511999999999',
      role: 'Teste',
      lgpd_consent: true,
      ip_address: '127.0.0.1',
      user_agent: 'Test Agent',
      referrer: 'Test',
      utm_source: 'test',
      utm_medium: 'api',
      utm_campaign: 'integration-test'
    };

    const result = await KommoService.createLead(testLeadData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Lead de teste criado com sucesso no Kommo',
        data: {
          kommoLeadId: result.kommoLeadId,
          testData: testLeadData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao criar lead de teste no Kommo',
        error: result.error,
        testData: testLeadData
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro ao testar criação de lead no Kommo:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao testar criação de lead no Kommo',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}