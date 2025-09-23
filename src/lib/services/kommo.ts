import { LeadData } from '@/lib/models/Lead';

// Configuração do Kommo
const KOMMO_CONFIG = {
  subdomain: 'contatobrclightningcom',
  integrationId: '96c52f67-2b74-4ac7-bff5-1c70af136f1e',
  secretKey: process.env.KOMMO_SECRET_KEY,
  accessToken: process.env.KOMMO_ACCESS_TOKEN,
  baseUrl: 'https://contatobrclightningcom.kommo.com/api/v4'
};

// Interface para dados do contato no Kommo
interface KommoContact {
  id?: number;
  name: string;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{
      value: string;
      enum_id?: number;
      enum_code?: string;
    }>;
  }>;
}

// Interface para dados do lead no Kommo
interface KommoLead {
  name: string;
  pipeline_id?: number;
  status_id?: number;
  responsible_user_id?: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{
      value: string;
    }>;
  }>;
  _embedded?: {
    contacts: KommoContact[];
  };
}

// Interface para resposta de contatos existentes
interface KommoContactResponse {
  _embedded?: {
    contacts: Array<{
      id: number;
      name: string;
      custom_fields_values?: Array<{
        field_id: number;
        field_name: string;
        field_code: string;
        field_type: string;
        values: Array<{
          value: string;
          enum_id?: number;
          enum_code?: string;
        }>;
      }>;
    }>;
  };
}

// Cache para IDs de campos customizados
let customFieldsCache: { [key: string]: number } | null = null;

export class KommoService {
  private static getHeaders() {
    if (!KOMMO_CONFIG.accessToken) {
      throw new Error('Token de acesso do Kommo não configurado');
    }

    return {
      'Authorization': `Bearer ${KOMMO_CONFIG.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Buscar campos customizados de contatos
  private static async getContactCustomFields(): Promise<{ [key: string]: number }> {
    // Sempre buscar campos customizados (não usar cache por enquanto para debug)
    try {
      const response = await fetch(`${KOMMO_CONFIG.baseUrl}/contacts/custom_fields`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar campos customizados: ${response.status}`);
      }

      const data = await response.json();
      const customFields = data._embedded?.custom_fields || [];

      // Mapear códigos de campo para IDs e nome dos campos
      const fieldMap = customFields.reduce((acc: { [key: string]: number }, field: any) => {
        if (field.code) {
          acc[field.code] = field.id;
        }
        // Mapear também por nome específico
        if (field.name === 'WhatsApp') {
          acc['WHATSAPP'] = field.id;
        }
        return acc;
      }, {});

      console.log('📋 Campos customizados encontrados:', fieldMap);
      customFieldsCache = fieldMap;
      return fieldMap;
    } catch (error) {
      console.error('Erro ao buscar campos customizados:', error);
      // Retornar IDs conhecidos como fallback
      return {
        'PHONE': 1325729,
        'EMAIL': 1325731,
        'WHATSAPP': 1899396
      };
    }
  }

  // Buscar contato existente por telefone
  private static async findContactByPhone(phone: string): Promise<number | null> {
    try {
      const response = await fetch(`${KOMMO_CONFIG.baseUrl}/contacts?query=${encodeURIComponent(phone)}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 204) {
          return null; // Nenhum contato encontrado
        }
        throw new Error(`Erro ao buscar contato: ${response.status}`);
      }

      const data: KommoContactResponse = await response.json();
      const contacts = data._embedded?.contacts || [];

      if (contacts.length > 0) {
        return contacts[0].id;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar contato por telefone:', error);
      return null;
    }
  }

  // Buscar contato existente por email
  private static async findContactByEmail(email: string): Promise<number | null> {
    try {
      const response = await fetch(`${KOMMO_CONFIG.baseUrl}/contacts?query=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 204) {
          return null; // Nenhum contato encontrado
        }
        throw new Error(`Erro ao buscar contato por email: ${response.status}`);
      }

      const data: KommoContactResponse = await response.json();
      const contacts = data._embedded?.contacts || [];

      if (contacts.length > 0) {
        return contacts[0].id;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar contato por email:', error);
      return null;
    }
  }

  // Criar lead no Kommo
  static async createLead(leadData: LeadData): Promise<{ success: boolean; kommoLeadId?: number; error?: string }> {
    try {
      console.log('Iniciando criação de lead no Kommo para:', leadData.email);

      // Buscar campos customizados
      const customFields = await this.getContactCustomFields();
      const phoneFieldId = customFields['PHONE'];
      const emailFieldId = customFields['EMAIL'];
      const whatsappFieldId = customFields['WHATSAPP'];

      console.log('📱 Field IDs encontrados:', { phoneFieldId, emailFieldId, whatsappFieldId });

      if (!phoneFieldId || !emailFieldId) {
        console.warn('Campos PHONE ou EMAIL não encontrados nos campos customizados');
      }

      // Verificar se já existe contato por email ou telefone
      let existingContactId: number | null = null;

      if (leadData.email) {
        existingContactId = await this.findContactByEmail(leadData.email);
      }

      if (!existingContactId && leadData.whatsapp) {
        existingContactId = await this.findContactByPhone(leadData.whatsapp);
      }

      // Construir dados do lead
      const pipeline_id = process.env.KOMMO_PIPELINE_ID ? parseInt(process.env.KOMMO_PIPELINE_ID) : 12051759;
      const status_id = process.env.KOMMO_STATUS_ID ? parseInt(process.env.KOMMO_STATUS_ID) : 92986715;
      const responsible_user_id = process.env.KOMMO_RESPONSIBLE_USER_ID ? parseInt(process.env.KOMMO_RESPONSIBLE_USER_ID) : 10422107;

      console.log('🔧 Configurações do pipeline:', { pipeline_id, status_id, responsible_user_id });

      const kommoLead: KommoLead = {
        name: leadData.name,
        pipeline_id, // Funil E-book
        status_id,   // Etapa de leads de entrada
        responsible_user_id, // Usuário padrão
        custom_fields_values: [] // Inicializar array de campos customizados do lead
      };

      if (existingContactId) {
        // Lead com contato existente
        kommoLead._embedded = {
          contacts: [{ id: existingContactId, name: leadData.name }]
        };
        console.log('Utilizando contato existente:', existingContactId);
      } else {
        // Lead com novo contato
        const newContact: KommoContact = {
          name: leadData.name,
          custom_fields_values: []
        };

        // Adicionar WhatsApp se fornecido (usar campo específico WhatsApp)
        if (leadData.whatsapp && whatsappFieldId) {
          newContact.custom_fields_values!.push({
            field_id: whatsappFieldId,
            values: [{ value: leadData.whatsapp }]
          });
        }

        // Adicionar email se fornecido
        if (leadData.email && emailFieldId) {
          newContact.custom_fields_values!.push({
            field_id: emailFieldId,
            values: [{ value: leadData.email }]
          });
        }

        kommoLead._embedded = {
          contacts: [newContact]
        };
        console.log('Criando novo contato no Kommo');
      }

      // Adicionar campos UTM ao lead (se disponíveis)
      if (leadData.utm_source) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325743, // UTM_SOURCE
          values: [{ value: leadData.utm_source }]
        });
      }

      if (leadData.utm_medium) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325739, // UTM_MEDIUM
          values: [{ value: leadData.utm_medium }]
        });
      }

      if (leadData.utm_campaign) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325741, // UTM_CAMPAIGN
          values: [{ value: leadData.utm_campaign }]
        });
      }

      if (leadData.utm_content) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325737, // UTM_CONTENT
          values: [{ value: leadData.utm_content }]
        });
      }

      if (leadData.utm_term) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325745, // UTM_TERM
          values: [{ value: leadData.utm_term }]
        });
      }

      if (leadData.referrer) {
        kommoLead.custom_fields_values!.push({
          field_id: 1325749, // REFERRER
          values: [{ value: leadData.referrer }]
        });
      }

      // Log do payload completo antes do envio
      console.log('📤 Payload sendo enviado para Kommo:', JSON.stringify([kommoLead], null, 2));

      // Tentar primeiro criar contato separadamente, depois lead
      let contactId = existingContactId;

      if (!contactId) {
        // Criar contato primeiro
        const contactPayload = [{
          name: leadData.name,
          custom_fields_values: []
        }];

        // Adicionar WhatsApp se fornecido
        if (leadData.whatsapp && whatsappFieldId) {
          contactPayload[0].custom_fields_values!.push({
            field_id: whatsappFieldId,
            values: [{ value: leadData.whatsapp }]
          });
        }

        // Adicionar email se fornecido
        if (leadData.email && emailFieldId) {
          contactPayload[0].custom_fields_values!.push({
            field_id: emailFieldId,
            values: [{ value: leadData.email }]
          });
        }

        console.log('📤 Criando contato primeiro:', JSON.stringify(contactPayload, null, 2));

        const contactResponse = await fetch(`${KOMMO_CONFIG.baseUrl}/contacts`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(contactPayload)
        });

        if (!contactResponse.ok) {
          const errorData = await contactResponse.text();
          console.error('Erro ao criar contato:', contactResponse.status, errorData);
          throw new Error(`Erro ao criar contato: ${contactResponse.status} - ${errorData}`);
        }

        const contactResponseData = await contactResponse.json();
        console.log('Contato criado:', contactResponseData);
        contactId = contactResponseData._embedded?.contacts?.[0]?.id;
      }

      // Agora criar lead simples linkado ao contato - Teste sem pipeline_id primeiro
      const leadPayload = [{
        name: leadData.name,
        responsible_user_id,
        contacts_id: [contactId]
      }];

      console.log('📤 Payload do lead sendo enviado:', JSON.stringify(leadPayload, null, 2));

      // Enviar requisição para criar lead simples
      const response = await fetch(`${KOMMO_CONFIG.baseUrl}/leads`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(leadPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta do Kommo:', response.status, errorData);
        throw new Error(`Erro ao criar lead no Kommo: ${response.status} - ${errorData}`);
      }

      const responseData = await response.json();
      console.log('Lead criado no Kommo com sucesso:', responseData);

      // Extrair ID do lead criado
      const createdLead = responseData._embedded?.leads?.[0];
      const kommoLeadId = createdLead?.id;

      // Agora mover o lead para o pipeline correto
      if (kommoLeadId) {
        console.log(`🔄 Movendo lead ${kommoLeadId} para pipeline ${pipeline_id}`);

        const updatePayload = [{
          id: kommoLeadId,
          pipeline_id,
          status_id
        }];

        const updateResponse = await fetch(`${KOMMO_CONFIG.baseUrl}/leads`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(updatePayload)
        });

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          console.log('✅ Lead movido para pipeline correto:', updateResult);
        } else {
          const updateError = await updateResponse.text();
          console.error('❌ Erro ao mover lead:', updateResponse.status, updateError);
        }
      }

      return {
        success: true,
        kommoLeadId
      };

    } catch (error) {
      console.error('Erro ao criar lead no Kommo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Testar conexão com Kommo
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${KOMMO_CONFIG.baseUrl}/leads?limit=1`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro de conexão: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao testar conexão com Kommo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export default KommoService;