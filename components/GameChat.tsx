import React, { useState, useRef, useEffect } from 'react';

interface GameState {
  health: number;
  inventory: string[];
  location: string;
  questProgress: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function GameChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    inventory: [],
    location: 'starting village',
    questProgress: 'not started'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          gameState: gameState
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.gameState) {
        setGameState(data.gameState);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.narrative || 'No response received'
      }]);

    } catch (error) {
      console.error('Detailed error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Status</h2>
        <p>Health: {gameState.health}</p>
        <p>Location: {gameState.location}</p>
        <p>Inventory: {gameState.inventory.join(', ') || 'Empty'}</p>
      </div>

      <div className="mb-4 h-[400px] overflow-y-auto border rounded-lg p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.role === 'assistant' 
                ? 'bg-blue-100' 
                : 'bg-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to do?"
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}