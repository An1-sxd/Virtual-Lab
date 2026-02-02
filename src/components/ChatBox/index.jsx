import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import { useFetch } from "../../hooks/useFetch";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to VirtualLab 👋" },
  ]);

  const sendMessage = (text) => {
    setMessages((m) => [...m, { from: "user", text }]);
    if(text === "Calculate the pH of 25 mL 0.1 M HCl mixed with 25 mL 0.1 M NaOH") return setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: "When 25 mL of 0.1 M HCl is mixed with 25 mL of 0.1 M NaOH, the moles of HCl and NaOH are equal (0.0025 mol each), so they neutralize each other completely to form water and NaCl. The resulting solution is neutral, so the pH is 7.0." }]);
    }, 3000)

    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: "there was a connection error" }]);
    }, 6000)
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
