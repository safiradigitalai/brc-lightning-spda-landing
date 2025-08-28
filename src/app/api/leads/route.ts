import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';
import { validateLead, leadQuerySchema } from '@/lib/validators/leadValidator';

// GET /api/leads - Lista leads com paginação
export async function GET(request: NextRequest) {
  try {
    // Durante o build, retorna uma resposta mock
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        data: { leads: [], total: 0, page: 1, limit: 50, totalPages: 0 },
        message: 'Mock data for build'
      });
    }

    const { searchParams } = new URL(request.url);
    
    // Validar query parameters
    const { error, value } = leadQuerySchema.validate({
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      orderBy: searchParams.get('orderBy') || 'created_at',
      order: searchParams.get('order') || 'desc'
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Parâmetros de consulta inválidos',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      }, { status: 400 });
    }

    const result = await Lead.findAll(value);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Leads recuperados com sucesso'
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// POST /api/leads - Criar novo lead
export async function POST(request: NextRequest) {
  try {
    // Durante o build, retorna uma resposta mock
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured for build'
      }, { status: 503 });
    }

    const body = await request.json();
    
    // Capturar dados da requisição
    const ip = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      request.headers.get('cf-connecting-ip') ||
      'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    // Adicionar dados de tracking
    const leadData = {
      ...body,
      ip_address: ip,
      user_agent: userAgent,
      referrer: referrer
    };

    // Validar dados
    const validation = validateLead(leadData);
    
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: validation.errors
      }, { status: 400 });
    }

    // Verificar se email já existe
    const existingLead = await Lead.findByEmail(validation.data.email);
    if (existingLead) {
      return NextResponse.json({
        success: true,
        data: {
          leadId: existingLead.id,
          email: existingLead.email,
          name: existingLead.name,
          isExisting: true
        },
        message: 'Lead já existe'
      });
    }

    // Verificar se WhatsApp já existe (se fornecido)
    if (validation.data.whatsapp) {
      const whatsappCheck = await Lead.whatsappExists(validation.data.whatsapp);
      if (whatsappCheck.exists) {
        return NextResponse.json({
          success: false,
          message: 'WhatsApp já cadastrado',
          code: 'DUPLICATE_DATA',
          data: {
            field: 'whatsapp',
            existingEmail: whatsappCheck.leadData?.email
          }
        }, { status: 409 });
      }
    }

    // Criar novo lead
    const newLead = await Lead.create(validation.data);

    return NextResponse.json({
      success: true,
      data: {
        leadId: newLead.id,
        email: newLead.email,
        name: newLead.name,
        isExisting: false
      },
      message: 'Lead criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}