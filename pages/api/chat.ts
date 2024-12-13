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

    const systemPrompt = `You are running an interactive fantasy text adventure game.
    Current game state: ${JSON.stringify(gameState)}
    
    Rules:
    1. Respond to the player's actions with vivid, engaging descriptions
    2. Keep track of player health, inventory, and important story decisions
    3. Create challenging situations but make them possible to overcome with creativity
    4. If player reaches a game over, offer to restart
    5. Keep responses concise but descriptive
    6. React naturally to anything the player types to do`;

    const response = await anthropic.messages.create({
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ],
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
    });

    // Access the content from the response
    const narrativeContent = response.content[0].text;

    const gameResponse = {
      narrative: narrativeContent,
      gameState: {
        ...gameState, // Preserve existing game state
        // Update specific properties based on the response if needed
      }
    };

    return res.status(200).json(gameResponse);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}