#!/bin/bash

# Script para inicializar o backend do BRC
echo "🚀 Iniciando BRC Backend..."

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "📝 Por favor, configure o arquivo .env com suas credenciais do Supabase"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    read -p "Pressione Enter após configurar o .env..."
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Criar diretório de logs
mkdir -p logs

echo "✅ Setup concluído!"
echo ""
echo "🔗 URLs disponíveis:"
echo "   API: http://localhost:3001/api"
echo "   Health: http://localhost:3001/health"
echo "   Docs: http://localhost:3001/api/docs"
echo ""

# Iniciar servidor
npm run dev