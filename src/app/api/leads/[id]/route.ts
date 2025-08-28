import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';
import { leadUpdateSchema } from '@/lib/validators/leadValidator';

// Next.js 15 runtime configuration for Node.js APIs
export const runtime = 'nodejs';

// GET /api/leads/[id] - Buscar lead por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return NextResponse.json({
        success: false,
        message: 'Lead não encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead encontrado'
    });

  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// PUT /api/leads/[id] - Atualizar lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validar dados de atualização
    const { error, value } = leadUpdateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return NextResponse.json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors
      }, { status: 400 });
    }

    // Verificar se o lead existe
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return NextResponse.json({
        success: false,
        message: 'Lead não encontrado'
      }, { status: 404 });
    }

    // Verificar email duplicado (se está sendo alterado)
    if (value.email && value.email !== existingLead.email) {
      const emailExists = await Lead.emailExists(value.email);
      if (emailExists) {
        return NextResponse.json({
          success: false,
          message: 'Este email já está sendo usado por outro lead',
          code: 'DUPLICATE_EMAIL'
        }, { status: 409 });
      }
    }

    // Verificar WhatsApp duplicado (se está sendo alterado)
    if (value.whatsapp && value.whatsapp !== existingLead.whatsapp) {
      const whatsappCheck = await Lead.whatsappExists(value.whatsapp);
      if (whatsappCheck.exists) {
        return NextResponse.json({
          success: false,
          message: 'Este WhatsApp já está sendo usado por outro lead',
          code: 'DUPLICATE_WHATSAPP',
          data: {
            existingEmail: whatsappCheck.leadData?.email
          }
        }, { status: 409 });
      }
    }

    // Atualizar lead
    const updatedLead = await Lead.update(id, value);

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// DELETE /api/leads/[id] - Deletar lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verificar se o lead existe
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return NextResponse.json({
        success: false,
        message: 'Lead não encontrado'
      }, { status: 404 });
    }

    // Deletar lead
    await Lead.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Lead deletado com sucesso'
    });

  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}