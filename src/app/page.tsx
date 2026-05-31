import ChatWidget from "./components/ChatWidget";
import TabBar from "./components/TabBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="px-6 py-4">
        <span className="font-semibold text-gray-900 text-base">AI tools</span>
      </nav>

      <main className="flex justify-center px-4 py-4 pb-24">
        <div className="w-full max-w-[560px]">
          <TabBar />
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
