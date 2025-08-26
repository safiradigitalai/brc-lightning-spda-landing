import logger from '../config/logger.js';

/**
 * Middleware para tratamento global de erros
 */
export const errorHandler = (err, req, res, next) => {
  // Log do erro completo
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  });

  // Erro de validação do Joi (caso não tenha sido capturado antes)
  if (err.isJoi) {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erros do Supabase
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique constraint violation
        return res.status(409).json({
          success: false,
          message: 'Dados já existem no sistema',
          code: 'DUPLICATE_DATA'
        });
      
      case '23502': // Not null violation
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios não preenchidos',
          code: 'REQUIRED_FIELDS_MISSING'
        });
      
      case '23514': // Check violation
        return res.status(400).json({
          success: false,
          message: 'Dados não atendem aos critérios de validação',
          code: 'DATA_VALIDATION_FAILED'
        });
      
      case 'PGRST116': // No rows returned
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado',
          code: 'RESOURCE_NOT_FOUND'
        });
      
      default:
        logger.error('Supabase error:', err);
        break;
    }
  }

  // Erro de conexão com banco de dados
  if (err.message && err.message.includes('connect')) {
    return res.status(503).json({
      success: false,
      message: 'Serviço temporariamente indisponível',
      code: 'SERVICE_UNAVAILABLE'
    });
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Formato JSON inválido',
      code: 'INVALID_JSON'
    });
  }

  // Erro de timeout
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
    return res.status(408).json({
      success: false,
      message: 'Requisição expirou. Tente novamente',
      code: 'REQUEST_TIMEOUT'
    });
  }

  // Erro genérico de servidor
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err 
    })
  });
};

/**
 * Middleware para capturar rotas não encontradas
 */
export const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND'
  });
};

/**
 * Middleware para capturar erros de promises rejeitadas
 */
export const unhandledRejectionHandler = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Não fechar o processo imediatamente em produção
    // process.exit(1);
  });
};

/**
 * Middleware para capturar exceções não tratadas
 */
export const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Em caso de exceção não tratada, é mais seguro reiniciar
    process.exit(1);
  });
};

/**
 * Wrapper para async routes que garante que erros sejam capturados
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  errorHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
  asyncHandler
};