import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to VirtualLab 👋" },
  ]);

  const sendMessage = (text) => {
    setMessages((m) => [...m, { from: "user", text }]);

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Admin bot received that 🧠" },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {open && (
        <div
          className="absolute inset-0 pointer-events-auto"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className="pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {open && (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            onClose={() => setOpen(false)}
          />
        )}

        <ChatButton onClick={() => setOpen(!open)} />
      </div>
    </div>
  );
}
