import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: [
   "https://vahanbazar-404-git-main-venky656s-projects.vercel.app"
  ],
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type"],
}));



app.use(bodyParser.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Gemini Init
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ✅ FULL VEHICLE DATA (no database needed)
const catalog = [
  {
    id: '1', name: 'Activa 6G', brand: 'Honda', category:'scooter',
    price: { exShowroom: 75000, onRoad: 85000 },
    specifications: { mileage: 60, engine: '109.51cc', fuelType: 'Petrol' }
  },
  {
    id: '2', name: 'CBR 650R', brand: 'Honda', category:'bike',
    price: { exShowroom: 950000, onRoad: 1050000 },
    specifications: { mileage: 23, engine: '648.72cc', fuelType: 'Petrol' }
  },
  {
    id: '3', name: 'Jupiter 125', brand: 'TVS', category:'scooter',
    price: { exShowroom: 85000, onRoad: 95000 },
    specifications: { mileage: 62, engine: '124.8cc', fuelType: 'Petrol' }
  },
  {
    id: '4', name: 'Pulsar NS200', brand: 'Bajaj', category:'bike',
    price: { exShowroom: 140000, onRoad: 160000 },
    specifications: { mileage: 35, engine: '199.5cc', fuelType: 'Petrol' }
  },
  {
    id: '5', name: 'Splendor Plus', brand: 'Hero', category:'bike',
    price: { exShowroom: 68000, onRoad: 78000 },
    specifications: { mileage: 80, engine: '97.2cc', fuelType: 'Petrol' }
  },
  {
    id: '6', name: 'Classic 350', brand: 'Royal Enfield', category:'bike',
    price: { exShowroom: 185000, onRoad: 210000 },
    specifications: { mileage: 41, engine: '349cc', fuelType: 'Petrol' }
  },
  {
    id: '7', name: 'FZ-S V3', brand: 'Yamaha', category:'bike',
    price: { exShowroom: 110000, onRoad: 125000 },
    specifications: { mileage: 50, engine: '149cc', fuelType: 'Petrol' }
  },
  {
    id: '8', name: 'Duke 200', brand: 'KTM', category:'bike',
    price: { exShowroom: 180000, onRoad: 205000 },
    specifications: { mileage: 35, engine: '199.5cc', fuelType: 'Petrol' }
  },
  {
    id: '9', name: 'Access 125', brand: 'Suzuki', category:'scooter',
    price: { exShowroom: 80000, onRoad: 90000 },
    specifications: { mileage: 64, engine: '124cc', fuelType: 'Petrol' }
  },
  {
    id: '10', name: 'iQube Electric', brand: 'TVS', category:'ev',
    price: { exShowroom: 115000, onRoad: 125000 },
    specifications: { mileage: 75, engine: 'Electric Motor', fuelType: 'Electric' }
  },
];

// ✅ Helper functions
function findBike(text) {
  const t = text.toLowerCase();
  return catalog.find(
    v =>
      t.includes(v.name.toLowerCase()) ||
      t.includes(v.brand.toLowerCase())
  );
}

function calcEMI(price) {
  const P = price;
  const r = (12/100)/12;
  const n = 24;
  return Math.round((P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1));
}

// ✅ MAIN CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  const { message = "" } = req.body;
  const lower = message.toLowerCase();

  if (!message.trim()) {
    return res.json({ reply:{ type:"text", text:"Hi 👋 I’m VahanaBot! Ask me about bikes, prices, mileage, EMI or compare models."}});
  }

  // ✅ Compare logic
  const match = lower.match(/compare (.*) and (.*)/i) || lower.match(/(.*) vs (.*)/i);
  if (match) {
    const A = findBike(match[1]);
    const B = findBike(match[2]);
    if (A && B) {
      return res.json({
        reply:{ type:"text", text:
`📊 **${A.name} vs ${B.name}**
• Price: ₹${A.price.onRoad} | ₹${B.price.onRoad}
• Mileage: ${A.specifications.mileage} kmpl | ${B.specifications.mileage} kmpl
• Engine: ${A.specifications.engine} | ${B.specifications.engine}
• Fuel: ${A.specifications.fuelType} | ${B.specifications.fuelType}`
        }
      });
    }
    return res.json({ reply:{ type:"text", text:"I couldn’t find both models." }});
  }

  // ✅ EV under budget
  if ((lower.includes("under") || lower.includes("below")) && (lower.includes("ev") || lower.includes("electric"))) {
    const num = parseInt(lower.match(/(\d+)/)?.[0] || "100000");
    const results = catalog.filter(v => v.specifications.fuelType.toLowerCase() === "electric" && v.price.onRoad <= num);
    if (results.length) {
      return res.json({
        reply:{ type:"text", text:`🔌 EVs under ₹${num}:\n` + results.map(v=>`• ${v.name} — ₹${v.price.onRoad}`).join("\n") }
      });
    }
  }

  // ✅ EMI
  if (lower.includes("emi")) {
    const b = findBike(lower);
    if (b) {
      const emi = calcEMI(b.price.onRoad);
      return res.json({ reply:{ type:"text", text:`💰 EMI for ${b.name}: ₹${emi}/month` }});
    }
    return res.json({ reply:{ type:"text", text:"Tell me the model name for EMI." }});
  }

  // ✅ Price lookup
  if (lower.includes("price") || lower.includes("cost")) {
    const b = findBike(lower);
    if (b) {
      return res.json({ reply:{ type:"text", text:`₹${b.price.onRoad} on-road for ${b.name}` }});
    }
  }

  // ✅ Mileage lookup
  if (lower.includes("mileage") || lower.includes("average")) {
    const b = findBike(lower);
    if (b) {
      return res.json({ reply:{ type:"text", text:`${b.name} mileage: ${b.specifications.mileage} kmpl` }});
    }
  }

  // ✅ If bike detected, show short card
  const b = findBike(lower);
  if (b) {
    return res.json({
      reply:{ type:"text", text:
`✅ ${b.name}
Price: ₹${b.price.onRoad}
Mileage: ${b.specifications.mileage} kmpl
Engine: ${b.specifications.engine}`
      }
    });
  }

  // ✅ Gemini fallback
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`
      You are VahanaBot. Reply in max 1-2 short lines only.
      Simple words, helpful answers.
      User: ${message}
    `);

    return res.json({ reply:{ type:"text", text: result.response.text() }});
  } catch {
    return res.json({ reply:{ type:"text", text:"⚠️ AI error. Try again later." }});
  }
});

