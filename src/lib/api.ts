// API Configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types
export interface LeadData {
  name: string;
  email: string;
  whatsapp?: string;
  role?: string;
  lgpd_consent: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
  code?: string;
}

export interface LeadResponse {
  leadId: string;
  email: string;
  name: string;
  isExisting: boolean;
  field?: string;
  existingEmail?: string;
}

// Utility function to get UTM parameters from URL
export const getUtmParams = (): Partial<LeadData> => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  };
};

// Custom fetch wrapper with error handling and retries
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const maxRetries = 3;
  let lastError: Error = new Error('Network request failed');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Retry logic
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: ApiResponse<T>;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Fallback para respostas não JSON
        const text = await response.text();
        data = {
          success: response.ok,
          message: text || response.statusText,
        };
      }

      // Handle HTTP errors
      if (!response.ok) {
        // Rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }

        // Return error response
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          errors: data.errors,
          code: data.code || `HTTP_${response.status}`,
        };
      }

      return data;

    } catch (error) {
      lastError = error as Error;
      
      // Não tentar novamente em erros de rede no último attempt
      if (attempt === maxRetries) break;
      
      // Esperar antes de tentar novamente (backoff exponencial)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Return final error
  return {
    success: false,
    message: lastError?.name === 'AbortError' 
      ? 'Tempo limite da requisição excedido' 
      : lastError?.message || 'Erro de conexão com o servidor',
    code: 'NETWORK_ERROR',
  };
};

// API Functions
export const leadApi = {
  /**
   * Create a new lead
   */
  async create(leadData: LeadData): Promise<ApiResponse<LeadResponse>> {
    // Adicionar UTM params automaticamente
    const utmParams = getUtmParams();
    const completeLeadData = {
      ...leadData,
      ...utmParams,
    };

    return apiRequest<LeadResponse>('/leads', {
      method: 'POST',
      body: JSON.stringify(completeLeadData),
    });
  },

  /**
   * Check if email already exists
   */
  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean; email: string }>> {
    const params = new URLSearchParams({ email });
    return apiRequest(`/leads/check/email?${params}`);
  },

  /**
   * Get lead by ID (admin function)
   */
  async getById(leadId: string): Promise<ApiResponse<LeadData>> {
    return apiRequest(`/leads/${leadId}`);
  },

  /**
   * Get leads statistics (admin function)
   */
  async getStats(): Promise<ApiResponse<{
    totalLeads: number;
    todayLeads: number;
    weekLeads: number;
    utmSources: Record<string, number>;
  }>> {
    return apiRequest('/leads/stats/dashboard');
  },

  /**
   * Health check for leads service
   */
  async healthCheck(): Promise<ApiResponse<{ totalLeads: number; timestamp: string }>> {
    return apiRequest('/leads/health/check');
  },
};

// General API utilities
export const apiUtils = {
  /**
   * Check API health
   */
  async healthCheck(): Promise<ApiResponse> {
    return apiRequest('/health');
  },

  /**
   * Get API information
   */
  async getInfo(): Promise<ApiResponse> {
    return apiRequest('/');
  },
};

// Error handling utilities
export const handleApiError = (error: ApiResponse): string => {
  if (error.errors && error.errors.length > 0) {
    return error.errors.map(err => err.message).join(', ');
  }
  
  return error.message || 'Erro desconhecido';
};

// Form validation helpers
export const validateLeadData = (data: Partial<LeadData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email deve ter um formato válido');
  }

  if (!data.lgpd_consent) {
    errors.push('Consentimento LGPD é obrigatório');
  }

  if (data.whatsapp && !isValidWhatsApp(data.whatsapp)) {
    errors.push('WhatsApp deve ter um formato válido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validation utilities
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidWhatsApp = (whatsapp: string): boolean => {
  const whatsappRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
  return whatsappRegex.test(whatsapp);
};

export default leadApi;