-- BRC SPDA E-book Lead Capture Database Schema
-- Execute este script no Supabase SQL Editor

-- 1. Tabela principal para captura de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    role VARCHAR(255),
    lgpd_consent BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadados de tracking
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela para logs de download do e-book
CREATE TABLE IF NOT EXISTS ebook_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    ebook_version VARCHAR(50) DEFAULT 'v1.0',
    download_count INTEGER DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela para tracking de emails enviados
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'welcome', 'ebook_delivery', 'follow_up'
    email_subject VARCHAR(255),
    email_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    provider VARCHAR(50), -- 'resend', 'sendgrid', 'ses'
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);
CREATE INDEX IF NOT EXISTS idx_ebook_downloads_lead_id ON ebook_downloads(lead_id);
CREATE INDEX IF NOT EXISTS idx_ebook_downloads_created_at ON ebook_downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(email_status);

-- 5. Constraint para email único
ALTER TABLE leads ADD CONSTRAINT unique_email UNIQUE (email);

-- 6. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Trigger para atualizar updated_at
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Row Level Security (RLS) - Importante para segurança
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- 9. Políticas de acesso (ajuste conforme sua estratégia de auth)
-- Para API service_role (backend)
CREATE POLICY "API can insert leads" ON leads
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "API can read leads" ON leads
    FOR SELECT TO service_role
    USING (true);

CREATE POLICY "API can update leads" ON leads
    FOR UPDATE TO service_role
    USING (true);

-- Mesmas políticas para outras tabelas
CREATE POLICY "API can manage downloads" ON ebook_downloads
    FOR ALL TO service_role
    USING (true);

CREATE POLICY "API can manage email_logs" ON email_logs
    FOR ALL TO service_role
    USING (true);

-- 10. View para analytics básicos
CREATE OR REPLACE VIEW lead_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN whatsapp IS NOT NULL THEN 1 END) as leads_with_whatsapp,
    COUNT(CASE WHEN role IS NOT NULL THEN 1 END) as leads_with_role,
    COUNT(DISTINCT utm_source) as unique_sources,
    utm_source,
    utm_medium,
    utm_campaign
FROM leads 
GROUP BY DATE(created_at), utm_source, utm_medium, utm_campaign
ORDER BY date DESC;

-- 11. Função para buscar lead com downloads
CREATE OR REPLACE FUNCTION get_lead_with_stats(lead_email text)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT row_to_json(t) INTO result
    FROM (
        SELECT 
            l.*,
            COALESCE(d.download_count, 0) as total_downloads,
            COALESCE(e.email_count, 0) as total_emails_sent
        FROM leads l
        LEFT JOIN (
            SELECT lead_id, SUM(download_count) as download_count 
            FROM ebook_downloads 
            GROUP BY lead_id
        ) d ON l.id = d.lead_id
        LEFT JOIN (
            SELECT lead_id, COUNT(*) as email_count 
            FROM email_logs 
            WHERE email_status = 'sent'
            GROUP BY lead_id
        ) e ON l.id = e.lead_id
        WHERE l.email = lead_email
    ) t;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 12. Comentários para documentação
COMMENT ON TABLE leads IS 'Tabela principal para captura de leads do e-book SPDA';
COMMENT ON TABLE ebook_downloads IS 'Log de downloads do e-book por lead';
COMMENT ON TABLE email_logs IS 'Log de emails enviados para leads';
COMMENT ON COLUMN leads.lgpd_consent IS 'Consentimento LGPD obrigatório';
COMMENT ON COLUMN leads.ip_address IS 'IP do usuário para analytics e segurança';