import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotWindow from "./ChatbotWindow";

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="absolute bottom-16 left-0 w-[350px] h-[450px]"
          >
            <ChatbotWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;