import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseClient: SupabaseClient | null = null;

// Lazy initialization of Supabase client
const initSupabaseClient = (): SupabaseClient => {
  if (!_supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Check your .env file.');
    }

    _supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  
  return _supabaseClient;
};

// Proxy to ensure lazy loading and maintain API compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = initSupabaseClient();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    
    // Bind methods to maintain correct context
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  }
});

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