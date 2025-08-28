import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/lib/models/Lead';
import { emailSchema } from '@/lib/validators/leadValidator';

// GET /api/leads/check/email - Verificar se email existe
export async function GET(request: NextRequest) {
  try {
    // Durante o build, retorna uma resposta mock
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        data: { exists: false, email: 'test@example.com' },
        message: 'Mock email check for build'
      });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email é obrigatório'
      }, { status: 400 });
    }

    // Validar formato do email
    const { error } = emailSchema.validate({ email });
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Email deve ter um formato válido'
      }, { status: 400 });
    }

    const exists = await Lead.emailExists(email);
    
    return NextResponse.json({
      success: true,
      data: {
        exists,
        email
      },
      message: 'Verificação de email concluída'
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}