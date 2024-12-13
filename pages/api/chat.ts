import type { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, gameState } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      system: `You are running an interactive fantasy text adventure game. 
      Current game state: ${JSON.stringify(gameState)}
      
      Respond in character as a fantasy game master. Keep responses under 200 words.
      Track and update the player's:
      - Health (decrease if they take risks)
      - Inventory (add/remove items as appropriate)
      - Location (change based on movement)
      - Quest progress (update based on actions)`,
      messages: [{ role: "user", content: message }],
    });

    // Get the AI's response
    const aiResponse = response.content[0].text;

    // You could add logic here to parse the AI response and update game state
    const updatedGameState = {
      ...gameState,
      // Add logic to update state based on AI response
    };

    return res.status(200).json({
      narrative: aiResponse,
      gameState: updatedGameState
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}