import Lead from '../models/Lead.js';
import logger from '../config/logger.js';
import { leadValidationSchema, leadUpdateSchema } from '../validators/leadValidator.js';
import supabase from '../config/database.js';

class LeadController {
  // Criar novo lead
  static async createLead(req, res) {
    try {
      // Validar dados de entrada
      const { error, value } = leadValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Verificar se email já existe
      const existingLead = await Lead.findByEmail(value.email);
      if (existingLead) {
        return res.status(409).json({
          success: false,
          message: 'E-mail já cadastrado',
          data: {
            leadId: existingLead.id,
            isExisting: true,
            field: 'email'
          }
        });
      }

      // Verificar se WhatsApp já existe (apenas se fornecido)
      if (value.whatsapp) {
        const whatsappCheck = await Lead.whatsappExists(value.whatsapp);
        if (whatsappCheck.exists) {
          return res.status(409).json({
            success: false,
            message: 'WhatsApp já cadastrado com outro email',
            data: {
              leadId: whatsappCheck.leadData.id,
              existingEmail: whatsappCheck.leadData.email,
              isExisting: true,
              field: 'whatsapp'
            }
          });
        }
      }

      // Extrair informações do request
      const leadData = {
        ...value,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        referrer: req.get('Referer'),
        // UTM parameters já vêm no body ou podem vir via query
        utm_source: value.utm_source || req.query.utm_source,
        utm_medium: value.utm_medium || req.query.utm_medium,
        utm_campaign: value.utm_campaign || req.query.utm_campaign,
        utm_content: value.utm_content || req.query.utm_content,
        utm_term: value.utm_term || req.query.utm_term
      };

      // Criar lead
      const newLead = await Lead.create(leadData);

      logger.info(`New lead created: ${newLead.email} from IP: ${req.ip}`);

      res.status(201).json({
        success: true,
        message: 'Lead capturado com sucesso',
        data: {
          leadId: newLead.id,
          email: newLead.email,
          name: newLead.name,
          isExisting: false
        }
      });

    } catch (error) {
      logger.error('Error in createLead:', error);
      
      // Tratamento de erros específicos do Supabase
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({
          success: false,
          message: 'E-mail já cadastrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar lead por ID
  static async getLeadById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do lead é obrigatório'
        });
      }

      const lead = await Lead.findById(id);

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: lead.toJSON()
      });

    } catch (error) {
      logger.error('Error in getLeadById:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar leads com paginação
  static async getLeads(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        orderBy = 'created_at',
        order = 'desc'
      } = req.query;

      // Validar parâmetros
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

      const result = await Lead.findAll({
        page: pageNum,
        limit: limitNum,
        orderBy,
        order
      });

      res.status(200).json({
        success: true,
        data: {
          leads: result.leads.map(lead => lead.toJSON()),
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
          }
        }
      });

    } catch (error) {
      logger.error('Error in getLeads:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Estatísticas de leads
  static async getLeadStats(req, res) {
    try {
      const stats = await Lead.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      logger.error('Error in getLeadStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar se email existe (útil para validação no frontend)
  static async checkEmailExists(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      const exists = await Lead.emailExists(email);

      res.status(200).json({
        success: true,
        data: {
          exists,
          email
        }
      });

    } catch (error) {
      logger.error('Error in checkEmailExists:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar se WhatsApp existe (útil para validação no frontend)
  static async checkWhatsAppExists(req, res) {
    try {
      const { whatsapp } = req.query;

      if (!whatsapp) {
        return res.status(400).json({
          success: false,
          message: 'WhatsApp é obrigatório'
        });
      }

      const whatsappCheck = await Lead.whatsappExists(whatsapp);

      res.status(200).json({
        success: true,
        data: {
          exists: whatsappCheck.exists,
          whatsapp,
          ...(whatsappCheck.exists && {
            existingEmail: whatsappCheck.leadData.email
          })
        }
      });

    } catch (error) {
      logger.error('Error in checkWhatsAppExists:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar lead
  static async updateLead(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do lead é obrigatório'
        });
      }

      // Validar dados de entrada
      const { error, value } = leadUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Buscar lead existente
      const existingLead = await Lead.findById(id);
      if (!existingLead) {
        return res.status(404).json({
          success: false,
          message: 'Lead não encontrado'
        });
      }

      // Verificar se email já existe em outro lead
      if (value.email && value.email !== existingLead.email) {
        const emailExists = await Lead.emailExists(value.email);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email já cadastrado em outro lead'
          });
        }
      }

      // Verificar se WhatsApp já existe em outro lead
      if (value.whatsapp && value.whatsapp !== existingLead.whatsapp) {
        const whatsappCheck = await Lead.whatsappExists(value.whatsapp);
        if (whatsappCheck.exists) {
          return res.status(409).json({
            success: false,
            message: 'WhatsApp já cadastrado em outro lead'
          });
        }
      }

      // Atualizar lead
      const updatedLead = await existingLead.update(value);

      logger.info(`Lead updated: ${updatedLead.email} by IP: ${req.ip}`);

      res.status(200).json({
        success: true,
        message: 'Lead atualizado com sucesso',
        data: updatedLead.toJSON()
      });

    } catch (error) {
      logger.error('Error in updateLead:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Deletar lead
  static async deleteLead(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do lead é obrigatório'
        });
      }

      // Buscar lead existente
      const existingLead = await Lead.findById(id);
      if (!existingLead) {
        return res.status(404).json({
          success: false,
          message: 'Lead não encontrado'
        });
      }

      // Deletar lead
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      logger.info(`Lead deleted: ${existingLead.email} by IP: ${req.ip}`);

      res.status(200).json({
        success: true,
        message: 'Lead deletado com sucesso'
      });

    } catch (error) {
      logger.error('Error in deleteLead:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Health check específico para leads
  static async healthCheck(req, res) {
    try {
      const stats = await Lead.getStats();
      
      res.status(200).json({
        success: true,
        message: 'Lead service is healthy',
        data: {
          totalLeads: stats.totalLeads,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Error in lead health check:', error);
      res.status(503).json({
        success: false,
        message: 'Lead service is unhealthy'
      });
    }
  }
}

export default LeadController;