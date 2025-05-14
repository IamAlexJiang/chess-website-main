const OpenAI = require('openai');
const config = require('../config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

/**
 * Analyze chess moves using OpenAI API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzeChessMoves(req, res) {
  try {
    const { moves } = req.body;
    console.log(moves);
    
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ error: 'Invalid moves data' });
    }

    // Format the moves for the prompt
    const formattedMoves = moves.map((move, index) => {
      return `${index + 1}. ${move.from} to ${move.to}`;
    }).join('\n');

    // Create the prompt for GPT-4o
    const prompt = `
You are a chess expert analyzing a game. The following moves have been played:

${formattedMoves}

Please provide a brief commentary on the last move played and the current position, and predict the opponent's next move.
`;

    // Call OpenAI API with JSON mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a chess expert providing analysis and predictions. Always respond in valid JSON format with the following structure: {\"commentary\": \"your analysis here\", \"predictedMove\": \"from to\"}. For example: {\"commentary\": \"White's e4 opening is a strong central control move. Black's e5 response is a solid counter.\", \"predictedMove\": \"Nf3 Nc6\"}" 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    // Extract the response
    const response = completion.choices[0].message.content;
    
    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        commentary: "No commentary available",
        predictedMove: "No prediction available"
      });
    }
    
    // Return the analysis
    return res.json({
      commentary: analysis.commentary || "No commentary available",
      predictedMove: analysis.predictedMove || "No prediction available"
    });
  } catch (error) {
    console.error('Error analyzing chess moves:', error);
    return res.status(500).json({ error: 'Failed to analyze chess moves' });
  }
}

module.exports = analyzeChessMoves; 