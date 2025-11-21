/**
 * Server configuration
 */
module.exports = {
  // OpenAI API key - should be set as an environment variable in production
  openaiApiKey: process.env.OPENAI_API_KEY || 'AIzaSyBS0JYJeSEXI8CF1SHZjuE4FEwDzlu0pPs',
  
  // Google AI API key for Gemini
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || 'AIzaSyBS0JYJeSEXI8CF1SHZjuE4FEwDzlu0pPs',
  
  // Cohere API key
  cohereApiKey: process.env.COHERE_API_KEY || 'YOUR_COHERE_API_KEY_HERE',
  
  // Server port
  port: process.env.PORT || 3001,
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/chess',
  },
};