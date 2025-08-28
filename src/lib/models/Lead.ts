import { supabase } from '../database';

export interface LeadData {
  id?: string;
  name: string;
  email: string;
  whatsapp?: string;
  role?: string;
  lgpd_consent: boolean;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeadStats {
  totalLeads: number;
  todayLeads: number;
  weekLeads: number;
  utmSources: Record<string, number>;
}

export interface LeadsPaginated {
  leads: LeadData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class Lead {
  constructor(private data: LeadData) {}

  // Criar novo lead
  static async create(leadData: LeadData): Promise<LeadData> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      console.log(`Lead created successfully: ${data.email}`);
      return data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  }

  // Buscar lead por email
  static async findByEmail(email: string): Promise<LeadData | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error finding lead by email:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to find lead by email:', error);
      throw error;
    }
  }

  // Buscar lead por ID
  static async findById(id: string): Promise<LeadData | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding lead by ID:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to find lead by ID:', error);
      throw error;
    }
  }

  // Atualizar lead
  static async update(id: string, updates: Partial<LeadData>): Promise<LeadData> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      console.log(`Lead updated successfully: ${data.email}`);
      return data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  }

  // Deletar lead
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }

      console.log(`Lead deleted successfully: ${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw error;
    }
  }

  // Listar leads com paginação
  static async findAll({ 
    page = 1, 
    limit = 50, 
    orderBy = 'created_at', 
    order = 'desc' 
  } = {}): Promise<LeadsPaginated> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order(orderBy, { ascending: order === 'asc' })
        .range(from, to);

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      return {
        leads: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  }

  // Estatísticas básicas
  static async getStats(): Promise<LeadStats> {
    try {
      // Total de leads
      const { count: totalLeads, error: totalError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Leads hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: todayLeads, error: todayError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      if (todayError) throw todayError;

      // Leads esta semana
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: weekLeads, error: weekError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo);

      if (weekError) throw weekError;

      // Top UTM sources
      const { data: utmData, error: utmError } = await supabase
        .from('leads')
        .select('utm_source')
        .not('utm_source', 'is', null);

      if (utmError) throw utmError;

      const utmSources = (utmData || []).reduce((acc: Record<string, number>, curr: { utm_source: string }) => {
        acc[curr.utm_source] = (acc[curr.utm_source] || 0) + 1;
        return acc;
      }, {});

      return {
        totalLeads: totalLeads || 0,
        todayLeads: todayLeads || 0,
        weekLeads: weekLeads || 0,
        utmSources
      };
    } catch (error) {
      console.error('Failed to get lead stats:', error);
      throw error;
    }
  }

  // Verificar se email já existe
  static async emailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Failed to check email existence:', error);
      throw error;
    }
  }

  // Verificar se WhatsApp já existe
  static async whatsappExists(whatsapp: string): Promise<{ exists: boolean; leadData: { id: string; email: string } | null }> {
    try {
      if (!whatsapp) return { exists: false, leadData: null };

      const { data, error } = await supabase
        .from('leads')
        .select('id, email')
        .eq('whatsapp', whatsapp)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? { exists: true, leadData: data } : { exists: false, leadData: null };
    } catch (error) {
      console.error('Failed to check WhatsApp existence:', error);
      throw error;
    }
  }

  // Buscar lead por WhatsApp
  static async findByWhatsapp(whatsapp: string): Promise<LeadData | null> {
    try {
      if (!whatsapp) return null;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('whatsapp', whatsapp)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding lead by WhatsApp:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to find lead by WhatsApp:', error);
      throw error;
    }
  }
}

export default Lead;