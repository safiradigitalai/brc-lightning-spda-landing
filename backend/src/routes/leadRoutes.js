import express from 'express';
import LeadController from '../controllers/leadController.js';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { leadValidationSchema, leadUpdateSchema, leadQuerySchema, emailSchema } from '../validators/leadValidator.js';

const router = express.Router();

// Middleware de rate limiting mais restritivo para criação de leads
const createLeadRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em alguns minutos.'
  }
});

// Rate limit mais flexível para consultas
const queryRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 consultas por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitas consultas. Tente novamente em alguns minutos.'
  }
});

/**
 * @route POST /api/leads
 * @desc Criar novo lead
 * @access Public
 */
router.post('/',
  createLeadRateLimit,
  validateRequest(leadValidationSchema),
  LeadController.createLead
);

/**
 * @route GET /api/leads
 * @desc Listar leads com paginação
 * @access Private (adicionar auth middleware depois)
 */
router.get('/',
  queryRateLimit,
  LeadController.getLeads
);

/**
 * @route GET /api/leads/stats/dashboard
 * @desc Obter estatísticas de leads
 * @access Private (adicionar auth middleware depois)
 */
router.get('/stats/dashboard',
  queryRateLimit,
  LeadController.getLeadStats
);

/**
 * @route GET /api/leads/check/email
 * @desc Verificar se email já existe
 * @access Public
 */
router.get('/check/email',
  queryRateLimit,
  LeadController.checkEmailExists
);

/**
 * @route GET /api/leads/check/whatsapp
 * @desc Verificar se WhatsApp já existe
 * @access Public
 */
router.get('/check/whatsapp',
  queryRateLimit,
  LeadController.checkWhatsAppExists
);

/**
 * @route GET /api/leads/health/check
 * @desc Health check do serviço de leads
 * @access Public
 */
router.get('/health/check',
  LeadController.healthCheck
);

/**
 * @route GET /api/leads/:id
 * @desc Buscar lead por ID
 * @access Private (adicionar auth middleware depois)
 */
router.get('/:id',
  queryRateLimit,
  LeadController.getLeadById
);

/**
 * @route PUT /api/leads/:id
 * @desc Atualizar lead por ID
 * @access Private (adicionar auth middleware depois)
 */
router.put('/:id',
  createLeadRateLimit,
  validateRequest(leadUpdateSchema),
  LeadController.updateLead
);

/**
 * @route DELETE /api/leads/:id
 * @desc Deletar lead por ID
 * @access Private (adicionar auth middleware depois)
 */
router.delete('/:id',
  queryRateLimit,
  LeadController.deleteLead
);

export default router;