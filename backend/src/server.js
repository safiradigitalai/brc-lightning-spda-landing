import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurações
dotenv.config();

// Importações locais
import logger from './config/logger.js';
import { testConnection } from './config/database.js';
import { globalRateLimit } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler, unhandledRejectionHandler, uncaughtExceptionHandler } from './middleware/errorHandler.js';
import { sanitizeRequest } from './middleware/validateRequest.js';

// Rotas
import leadRoutes from './routes/leadRoutes.js';

// Para obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar handlers globais para erros não tratados
unhandledRejectionHandler();
uncaughtExceptionHandler();

// Criar instância do Express
const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (importante para rate limiting e IPs corretos)
app.set('trust proxy', 1);

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN, 'https://brc-spda.com'] // Adicione seus domínios de produção
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middlewares gerais
app.use(compression());
app.use(express.json({ 
  limit: '10mb',
  strict: true 
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Rate limiting global
app.use(globalRateLimit);

// Sanitização de requests
app.use(sanitizeRequest);

// Middleware de logging para requests
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log da requisição
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });

  // Log da resposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`, {
      duration,
      contentLength: res.get('Content-Length')
    });
  });

  next();
});

// Health check básico
app.get('/health', async (req, res) => {
  try {
    const dbHealthy = await testConnection();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(dbHealthy ? 200 : 503).json({
      success: true,
      message: 'BRC Backend API is running',
      data: {
        status: dbHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutes`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        },
        database: {
          status: dbHealthy ? 'connected' : 'disconnected'
        }
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Service unhealthy',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/leads', leadRoutes);

// Rota de informações da API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'BRC SPDA Lead Capture API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      leads: {
        create: 'POST /api/leads',
        list: 'GET /api/leads',
        getById: 'GET /api/leads/:id',
        stats: 'GET /api/leads/stats/dashboard',
        checkEmail: 'GET /api/leads/check/email',
        health: 'GET /api/leads/health/check'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Documentação simples da API (pode ser expandida com Swagger depois)
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'BRC SPDA Lead Capture API Documentation',
    version: '1.0.0',
    description: 'API para captura de leads do e-book SPDA da BRC Consultoria',
    baseUrl: req.protocol + '://' + req.get('host') + '/api',
    endpoints: [
      {
        path: '/leads',
        method: 'POST',
        description: 'Criar novo lead',
        parameters: {
          body: {
            name: 'string (required)',
            email: 'string (required)',
            whatsapp: 'string (optional)',
            role: 'string (optional)',
            lgpd_consent: 'boolean (required, must be true)',
            utm_source: 'string (optional)',
            utm_medium: 'string (optional)',
            utm_campaign: 'string (optional)',
            utm_content: 'string (optional)',
            utm_term: 'string (optional)'
          }
        },
        responses: {
          201: 'Lead criado com sucesso',
          400: 'Dados inválidos',
          409: 'Email já cadastrado',
          429: 'Rate limit excedido',
          500: 'Erro interno'
        }
      },
      {
        path: '/leads/check/email',
        method: 'GET',
        description: 'Verificar se email existe',
        parameters: {
          query: {
            email: 'string (required)'
          }
        },
        responses: {
          200: 'Verificação realizada',
          400: 'Email não fornecido',
          500: 'Erro interno'
        }
      }
    ]
  });
});

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware global de tratamento de erros
app.use(errorHandler);

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testar conexão com banco de dados
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('Database connection failed. Server will start but some features may not work.');
    }

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      logger.info(`🚀 BRC Backend API running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;