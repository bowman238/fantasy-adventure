import GameChat from '../components/GameChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Fantasy Adventure
      </h1>
      <GameChat />
    </div>
  );
}