import GameChat from '../components/GameChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Fantasy Adventure Chat
        </h1>
        <GameChat />
      </main>
    </div>
  );
}