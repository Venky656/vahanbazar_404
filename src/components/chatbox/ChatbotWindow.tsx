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

  const API = "https://vahanbazar-404-bot-w3h6.onrender.com";


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
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text })
      });
      const data = await res.json();
      const reply = data.reply;
      if (!reply) return addBot("⚠️ Empty reply from server.");
      if (reply.type === "compare") {
        const table = reply.table.map((r:any[]) => r.join(" | ")).join("\n");
        addBot(`📊 Comparison:\n${table}`);
      } else if (reply.type === "search") {
        if (!reply.results?.length) return addBot("No results found.");
        const list = reply.results.slice(0,6).map((v:any)=>`✅ ${v.name} — ₹${v.price}`).join("\n");
        addBot(list);
      } else if (reply.type === "emi") {
        addBot(`💰 EMI for ${reply.model}: ₹${reply.emi}/month`);
      } else if (reply.type === "faq") {
        addBot(reply.text);
      } else if (reply.type === "ask_location") {
        addBot(reply.text);
      } else {
        addBot(reply.text);
      }
    } catch (e) {
      addBot("⚠️ Could not fetch response.");
    } finally {
      setLoading(false);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) return addBot("❌ Location not supported.");
    navigator.geolocation.getCurrentPosition(async pos => {
      addBot("📍 Location received. Finding nearby dealers...");
      try {
        const r = await fetch(`${API}/api/dealers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        });
        const d = await r.json();
        if (d.dealers?.length) {
          const list = d.dealers.map((x:any)=>`🏬 ${x.name} (${x.brand})\n📞 ${x.phone}\n📍 ${x.address}`).join("\n\n");
          addBot(`Nearby dealers:\n${list}`);
        } else addBot("No dealers found nearby.");
      } catch {
        addBot("❌ Dealers lookup failed.");
      }
    }, () => addBot("❌ Location permission denied."));
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return addBot("⚠️ Speech recognition not supported.");
    if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); return; }
    const rec = new SR(); recRef.current = rec;
    rec.lang = "en-IN"; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (ev:any) => {
      let final = ""; let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) {
          final += r[0].transcript;
        } else {
          interim += r[0].transcript;
        }
      }
      setInput(final || interim);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start(); setListening(true);
  };

  return (
    <div className="w-full h-full border rounded-xl bg-white flex flex-col shadow-xl">
      <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
        <b>VahanaBot</b>
        <div className="flex items-center gap-2">
          <button onClick={() => setVoiceReply(v=>!v)} className="px-2 py-1 rounded bg-blue-700">{voiceReply ? "🔊" : "🔈"}</button>
          <button onClick={shareLocation} className="px-2 py-1 rounded bg-blue-700">📍</button>
          <button onClick={toggleMic} className={`px-2 py-1 rounded ${listening ? "bg-red-500" : "bg-blue-700"}`}>{listening ? "🎙️" : "🎤"}</button>
          <button onClick={onClose} className="hover:text-gray-200">✕</button>
        </div>
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