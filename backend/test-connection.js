import { testConnection } from './src/config/database.js';
import logger from './src/config/logger.js';

async function runTest() {
  logger.info('Testing Supabase connection...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      logger.info('✅ Supabase connection successful!');
      logger.info('Database is ready to receive leads.');
    } else {
      logger.error('❌ Supabase connection failed!');
      logger.error('Please check your .env configuration.');
    }
  } catch (error) {
    logger.error('Connection test error:', error);
  }
  
  process.exit(0);
}

runTest();