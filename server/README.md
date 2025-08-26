# Chess AI Server

This is the backend server for the chess website that provides AI analysis using Google's Gemini API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Google AI API key:
   ```
   GOOGLE_AI_API_KEY=your_api_key_here
   PORT=3001
   ```

3. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

- `POST /chess/analyze` - Analyze chess moves and get AI commentary
- `GET /health` - Health check endpoint

## Security Note

The `.env` file is gitignored to protect your API key. Never commit API keys to version control.
