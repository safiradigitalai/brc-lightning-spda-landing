import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// Rate limit padrão
export const rateLimitMiddleware = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por windowMs
    message: {
      success: false,
      message: 'Muitas requisições deste IP. Tente novamente mais tarde.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
    
    // Handler customizado para logs
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
      
      res.status(429).json(options.message || defaultOptions.message);
    },
    
    // Skip successful requests
    skipSuccessfulRequests: false,
    
    // Skip failed requests  
    skipFailedRequests: false,
    
    // Key generator - pode ser customizado
    keyGenerator: (req) => {
      return req.ip;
    },

    // Custom store pode ser adicionado aqui (Redis, etc)
    // store: redisStore
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// Rate limit específico para criação de leads (mais restritivo)
export const leadCreationRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 leads por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitas tentativas de cadastro. Aguarde alguns minutos antes de tentar novamente.',
    code: 'TOO_MANY_LEAD_ATTEMPTS'
  }
});

// Rate limit para verificação de email (médio)
export const emailCheckRateLimit = rateLimitMiddleware({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // máximo 20 verificações por IP a cada 5 minutos
  message: {
    success: false,
    message: 'Muitas verificações de email. Aguarde alguns minutos.',
    code: 'TOO_MANY_EMAIL_CHECKS'
  }
});

// Rate limit para consultas admin (flexível)
export const adminQueryRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo 200 consultas por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitas consultas administrativas.',
    code: 'TOO_MANY_ADMIN_QUERIES'
  }
});

// Rate limit global (muito flexível)
export const globalRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Limite de requisições excedido.',
    code: 'GLOBAL_RATE_LIMIT_EXCEEDED'
  }
});

export default rateLimitMiddleware;