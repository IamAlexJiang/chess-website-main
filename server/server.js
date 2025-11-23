const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const apertusAI = require('./apertus-ai');
// const config = require('./config'); // Available for future use
const analyzeWithStockfish = require('./stockfish-analyze');
const predictMove = require('./move-prediction');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow requests from localhost and 127.0.0.1
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: false, // Set to false to allow wildcard if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Free Chess AI doesn't require an API key - it's completely free!
console.log('✅ Free Chess AI initialized - No API key required!');

// Analyze chess moves endpoint
app.post('/chess/analyze', async (req, res) => {
  try {
    const { moves } = req.body;
    
    console.log('Received moves:', moves);
    
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid moves data',
        commentary: "No moves to analyze",
        predictedMove: "No prediction available"
      });
    }

    // Format the moves for the prompt (available for future use)
    // const formattedMoves = moves.map((move, index) => {
    //   return `${index + 1}. ${move.from} to ${move.to}`;
    // }).join('\n');

    // Use Free Chess AI for analysis
    const analysis = await apertusAI.analyzeChessPosition(moves);
    
    // Return the analysis
    return res.json(analysis);
  } catch (error) {
    console.error('Error analyzing chess moves:', error);
    
    // Check if it's a service error
    if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('unavailable'))) {
      return res.json({
        commentary: "AI service temporarily busy. Please try again in a moment.",
        predictedMove: "No prediction available"
      });
    }
    
    // Check if it's a quota limit error
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('rate limit'))) {
      return res.json({
        commentary: "Daily AI analysis limit reached. Try again tomorrow or upgrade your plan.",
        predictedMove: "No prediction available"
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to analyze chess moves',
      commentary: "Error analyzing chess moves",
      predictedMove: "No prediction available"
    });
  }
});

// Move prediction endpoint
app.post('/chess/predict-move', predictMove);

// Stockfish analysis endpoint
app.post('/chess/analyze-stockfish', analyzeWithStockfish);

// Chess record storage (simple JSON file-based storage)
const RECORDS_FILE = path.join(__dirname, 'chess-records.json');

// Initialize records file if it doesn't exist
if (!fs.existsSync(RECORDS_FILE)) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify([]));
}

// Helper functions for record management
const readRecords = () => {
  try {
    const data = fs.readFileSync(RECORDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading records:', error);
    return [];
  }
};

const writeRecords = (records) => {
  try {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing records:', error);
    return false;
  }
};

// Chess record endpoints
app.get('/chess/getRecord', (req, res) => {
  try {
    const records = readRecords();
    res.json({ code: 200, content: records });
  } catch (error) {
    console.error('Error getting records:', error);
    res.status(500).json({ code: 500, content: 'Failed to get records' });
  }
});

app.post('/chess/saveRecord', (req, res) => {
  try {
    const { name, value } = req.body;
    
    if (!name || !value) {
      return res.status(400).json({ 
        code: 400, 
        content: 'Name and value are required' 
      });
    }

    const records = readRecords();
    const newRecord = {
      id: Date.now().toString(), // Simple ID generation
      name,
      value,
      createdAt: new Date().toISOString()
    };
    
    records.push(newRecord);
    
    if (writeRecords(records)) {
      res.json({ code: 200, content: newRecord.id });
    } else {
      res.status(500).json({ code: 500, content: 'Failed to save record' });
    }
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ code: 500, content: 'Failed to save record' });
  }
});

app.post('/chess/delete', (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        code: 400, 
        content: 'Record ID is required' 
      });
    }

    const records = readRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    
    if (records.length === filteredRecords.length) {
      return res.status(404).json({ 
        code: 404, 
        content: 'Record not found' 
      });
    }
    
    if (writeRecords(filteredRecords)) {
      res.json({ code: 200, content: 'Record deleted successfully' });
    } else {
      res.status(500).json({ code: 500, content: 'Failed to delete record' });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ code: 500, content: 'Failed to delete record' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chess AI server is running' });
});

app.listen(port, () => {
  console.log(`Chess AI server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Chess records will be stored in: ${RECORDS_FILE}`);
});
