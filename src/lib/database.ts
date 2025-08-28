import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    throw new Error('Missing Supabase configuration. Check your .env file.');
  }
  // Durante o build, pode não ter as variáveis disponíveis, então criamos um cliente dummy
  console.warn('⚠️ Supabase variables not available during build, using dummy client');
}

// Cliente com service_role para operações do backend
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseServiceKey || 'dummy-key', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Teste de conexão
export const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default supabase;