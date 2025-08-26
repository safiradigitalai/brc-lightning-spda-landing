import Joi from 'joi';

// Schema de validação para criação de lead
export const leadValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório'
    }),

  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .max(255)
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'string.empty': 'Email é obrigatório',
      'string.max': 'Email deve ter no máximo 255 caracteres',
      'any.required': 'Email é obrigatório'
    }),

  whatsapp: Joi.string()
    .trim()
    .pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'WhatsApp deve ter um formato válido (ex: (11) 99999-9999)',
      'string.max': 'WhatsApp deve ter no máximo 20 caracteres'
    }),

  role: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Cargo deve ter no máximo 255 caracteres'
    }),

  lgpd_consent: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'Consentimento LGPD é obrigatório',
      'any.required': 'Consentimento LGPD é obrigatório'
    }),

  // UTM Parameters (opcionais)
  utm_source: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_medium: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_campaign: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_content: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_term: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
});

// Schema para atualização de lead (todos os campos opcionais exceto LGPD)
export const leadUpdateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres'
    }),

  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .max(255)
    .optional()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'string.max': 'Email deve ter no máximo 255 caracteres'
    }),

  whatsapp: Joi.string()
    .trim()
    .pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'WhatsApp deve ter um formato válido (ex: (11) 99999-9999)',
      'string.max': 'WhatsApp deve ter no máximo 20 caracteres'
    }),

  role: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Cargo deve ter no máximo 255 caracteres'
    }),

  utm_source: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_medium: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_campaign: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_content: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  utm_term: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
});

// Schema para query parameters de listagem
export const leadQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50),

  orderBy: Joi.string()
    .valid('created_at', 'name', 'email', 'updated_at')
    .default('created_at'),

  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

// Schema para validação de email
export const emailSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    })
});

// Função helper para validar dados de entrada
export const validateLead = (data) => {
  const { error, value } = leadValidationSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));
    
    return {
      isValid: false,
      errors,
      data: null
    };
  }

  return {
    isValid: true,
    errors: null,
    data: value
  };
};

export default {
  leadValidationSchema,
  leadUpdateSchema,
  leadQuerySchema,
  emailSchema,
  validateLead
};