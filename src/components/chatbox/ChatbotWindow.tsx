import React, { useState, useEffect, useRef } from "react";

type Message = { sender: "user" | "bot"; text: string };

const ChatbotWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([{ sender: "bot", text: "Hi! I'm VahanaBot 🚀 Ask me about bikes, EMI, EVs, or test rides!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const [sessionId] = useState(() => "u_" + Math.random().toString(36).slice(2,10));
  const endRef = useRef<HTMLDivElement | null>(null);
  const recRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  // ✅ Using relative API (works on Vercel)
  const API = ""; 

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const speak = (text: string) => {
    if (!voiceReply || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN"; u.rate = 1; u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const addBot = (text: string) => {
    setMessages(p => [...p, { sender: "bot", text }]); speak(text);
  };

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(p => [...p, { sender: "user", text }]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text })
      });
      const data = await res.json();
      const reply = data.reply;
      if (!reply) return addBot("⚠️ Empty reply from server.");
      addBot(reply.text);
    } catch (e) {
      addBot("⚠️ Could not fetch response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full border rounded-xl bg-white flex flex-col shadow-xl">
      <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
        <b>VahanaBot</b>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((m,i)=>(
          <div key={i} className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.sender==="user" ? "ml-auto bg-blue-600 text-white":"mr-auto bg-gray-200"}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Bot is typing...</div>}
        <div ref={endRef} />
      </div>

      <div className="p-2 border-t flex gap-2">
        <input className="flex-1 border p-2 rounded" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Type your message..." />
        <button onClick={send} className="bg-blue-600 text-white px-3 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatbotWindow;
