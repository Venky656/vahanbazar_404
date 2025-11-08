import React, { useEffect, useState } from "react";
import "./AlertPopup.css";

interface Offer {
  bikeName: string;
  offerType: string;
  discount: string;
  endTime: Date;
}

// ✅ Random offers pulled from your existing mockVehicles
const availableOffers: Offer[] = [
  {
    bikeName: "Activa 6G",
    offerType: "Festive Cashback 💸",
    discount: "₹3,000 OFF + 1 Year Free Insurance",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    bikeName: "CBR 650R",
    offerType: "Superbike Mega Deal 🔥",
    discount: "Flat ₹25,000 OFF + Riding Jacket Free",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    bikeName: "Jupiter 125",
    offerType: "New Year Sale 🎊",
    discount: "₹4,000 OFF + Free Helmet",
    endTime: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000),
  },
  {
    bikeName: "Pulsar NS200",
    offerType: "Performance Deal ⚡",
    discount: "₹6,000 OFF + Free Service for 1 Year",
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    bikeName: "Classic 350",
    offerType: "Royal Ride Offer 👑",
    discount: "₹10,000 OFF + Custom Number Plate",
    endTime: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000),
  },
  {
    bikeName: "iQube Electric",
    offerType: "EV Eco Deal 🌱",
    discount: "₹15,000 OFF + Free Charger Installation",
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
];

const AlertPopup: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  
  // ✅ Pick a random offer every refresh
  const offer = availableOffers[Math.floor(Math.random() * availableOffers.length)];

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = offer.endTime.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("Offer expired!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [offer]);

  // Hide popup after 25 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 25000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <div className="alert-header">
          <h3>🏍️ {offer.offerType}</h3>
        </div>

        <button className="close-btn" onClick={() => setVisible(false)}>✖</button>

        <div className="alert-content">
          <p className="intro-text">
            Limited-time offer on your favorite ride!
          </p>

          <h2 className="bike-name">{offer.bikeName}</h2>
          <p className="discount-text">{offer.discount}</p>

          <ul className="feature-list">
            <li>✅ Compare models instantly</li>
            <li>📍 Find nearest showroom</li>
            <li>⚡ EMI & insurance calculator</li>
            <li>🚦 Test ride booking</li>
            <li>🔔 Price drop alerts</li>
          </ul>

          <div className="offer-timer">
            Offer ends in <span>{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;