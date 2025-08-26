import supabase from '../config/database.js';
import logger from '../config/logger.js';

class Lead {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.whatsapp = data.whatsapp;
    this.role = data.role;
    this.lgpd_consent = data.lgpd_consent;
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.referrer = data.referrer;
    this.utm_source = data.utm_source;
    this.utm_medium = data.utm_medium;
    this.utm_campaign = data.utm_campaign;
    this.utm_content = data.utm_content;
    this.utm_term = data.utm_term;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Criar novo lead
  static async create(leadData) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating lead:', error);
        throw error;
      }

      logger.info(`Lead created successfully: ${data.email}`);
      return new Lead(data);
    } catch (error) {
      logger.error('Failed to create lead:', error);
      throw error;
    }
  }

  // Buscar lead por email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        logger.error('Error finding lead by email:', error);
        throw error;
      }

      return data ? new Lead(data) : null;
    } catch (error) {
      logger.error('Failed to find lead by email:', error);
      throw error;
    }
  }

  // Buscar lead por ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error finding lead by ID:', error);
        throw error;
      }

      return data ? new Lead(data) : null;
    } catch (error) {
      logger.error('Failed to find lead by ID:', error);
      throw error;
    }
  }

  // Atualizar lead
  async update(updates) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating lead:', error);
        throw error;
      }

      // Atualizar instância atual
      Object.assign(this, data);
      logger.info(`Lead updated successfully: ${this.email}`);
      return this;
    } catch (error) {
      logger.error('Failed to update lead:', error);
      throw error;
    }
  }

  // Listar leads com paginação
  static async findAll({ page = 1, limit = 50, orderBy = 'created_at', order = 'desc' } = {}) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order(orderBy, { ascending: order === 'asc' })
        .range(from, to);

      if (error) {
        logger.error('Error fetching leads:', error);
        throw error;
      }

      const leads = data.map(leadData => new Lead(leadData));
      
      return {
        leads,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Failed to fetch leads:', error);
      throw error;
    }
  }

  // Estatísticas básicas
  static async getStats() {
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

      const utmSources = utmData.reduce((acc, curr) => {
        acc[curr.utm_source] = (acc[curr.utm_source] || 0) + 1;
        return acc;
      }, {});

      return {
        totalLeads,
        todayLeads,
        weekLeads,
        utmSources
      };
    } catch (error) {
      logger.error('Failed to get lead stats:', error);
      throw error;
    }
  }

  // Verificar se email já existe
  static async emailExists(email) {
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
      logger.error('Failed to check email existence:', error);
      throw error;
    }
  }

  // Verificar se WhatsApp já existe
  static async whatsappExists(whatsapp) {
    try {
      if (!whatsapp) return false;

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
      logger.error('Failed to check WhatsApp existence:', error);
      throw error;
    }
  }

  // Buscar lead por WhatsApp
  static async findByWhatsapp(whatsapp) {
    try {
      if (!whatsapp) return null;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('whatsapp', whatsapp)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error finding lead by WhatsApp:', error);
        throw error;
      }

      return data ? new Lead(data) : null;
    } catch (error) {
      logger.error('Failed to find lead by WhatsApp:', error);
      throw error;
    }
  }

  // Método para serialização JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      whatsapp: this.whatsapp,
      role: this.role,
      lgpd_consent: this.lgpd_consent,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      created_at: this.created_at,
      updated_at: this.updated_at
      // Não expor dados sensíveis como IP, user_agent
    };
  }
}

export default Lead;