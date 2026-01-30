import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex border-t border-border p-3 gap-2">
      <input
        className="
          flex-1 px-3 py-2 rounded-lg
          bg-background border border-input
          focus:outline-none focus:ring-2 focus:ring-ring
        "
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className="
          px-4 rounded-lg
          bg-primary text-primary-foreground
          hover:opacity-90 transition
        "
      >
        Send
      </button>
    </div>
  );
}
