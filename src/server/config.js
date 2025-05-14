/**
 * Server configuration
 */
module.exports = {
  // OpenAI API key - should be set as an environment variable in production
  openaiApiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
  
  // Server port
  port: process.env.PORT || 3000,
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/chess',
  },
}; 