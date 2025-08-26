import logger from '../config/logger.js';

/**
 * Middleware para validação de request usando Joi schemas
 * @param {Object} schema - Schema Joi para validação
 * @param {string} source - Fonte dos dados ('body', 'query', 'params')
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Selecionar a fonte dos dados
      let dataToValidate;
      switch (source) {
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'headers':
          dataToValidate = req.headers;
          break;
        case 'body':
        default:
          dataToValidate = req.body;
          break;
      }

      // Validar dados
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false, // Retorna todos os erros, não apenas o primeiro
        stripUnknown: true, // Remove campos não definidos no schema
        convert: true // Converte tipos quando possível
      });

      if (error) {
        // Log do erro de validação
        logger.warn(`Validation error on ${req.method} ${req.path}:`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        });

        // Formatar erros para resposta
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          code: detail.type
        }));

        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors: errors,
          code: 'VALIDATION_ERROR'
        });
      }

      // Substituir os dados originais pelos dados validados e sanitizados
      switch (source) {
        case 'query':
          req.query = value;
          break;
        case 'params':
          req.params = value;
          break;
        case 'headers':
          req.headers = { ...req.headers, ...value };
          break;
        case 'body':
        default:
          req.body = value;
          break;
      }

      next();
    } catch (validationError) {
      logger.error('Error in validation middleware:', validationError);
      
      res.status(500).json({
        success: false,
        message: 'Erro interno de validação',
        code: 'VALIDATION_MIDDLEWARE_ERROR'
      });
    }
  };
};

/**
 * Middleware para validação de múltiplas fontes
 * @param {Object} schemas - Objeto com schemas para diferentes fontes
 * @example
 * validateMultiple({
 *   body: leadSchema,
 *   query: paginationSchema,
 *   params: idSchema
 * })
 */
export const validateMultiple = (schemas) => {
  return async (req, res, next) => {
    try {
      const validationPromises = [];
      const validationErrors = [];

      // Validar cada fonte especificada
      for (const [source, schema] of Object.entries(schemas)) {
        if (schema) {
          const dataToValidate = req[source];
          const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
          });

          if (error) {
            const sourceErrors = error.details.map(detail => ({
              source,
              field: detail.path.join('.'),
              message: detail.message,
              code: detail.type
            }));
            validationErrors.push(...sourceErrors);
          } else {
            // Atualizar req com dados validados
            req[source] = value;
          }
        }
      }

      // Se houver erros, retornar todos
      if (validationErrors.length > 0) {
        logger.warn(`Multiple validation errors on ${req.method} ${req.path}:`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          errors: validationErrors
        });

        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos em múltiplas fontes',
          errors: validationErrors,
          code: 'MULTIPLE_VALIDATION_ERROR'
        });
      }

      next();
    } catch (validationError) {
      logger.error('Error in multiple validation middleware:', validationError);
      
      res.status(500).json({
        success: false,
        message: 'Erro interno de validação múltipla',
        code: 'MULTIPLE_VALIDATION_MIDDLEWARE_ERROR'
      });
    }
  };
};

/**
 * Middleware para sanitização adicional de dados sensíveis
 */
export const sanitizeRequest = (req, res, next) => {
  try {
    // Remover campos potencialmente perigosos
    const dangerousFields = ['__proto__', 'constructor', 'prototype'];
    
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      for (const field of dangerousFields) {
        delete obj[field];
      }
      
      // Recursivamente sanitizar objetos aninhados
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = sanitizeObject(obj[key]);
        }
      }
      
      return obj;
    };

    // Sanitizar body, query e params
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);

    next();
  } catch (error) {
    logger.error('Error in sanitize middleware:', error);
    next(); // Continue mesmo com erro de sanitização
  }
};

export default validateRequest;