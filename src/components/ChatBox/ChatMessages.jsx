import { useEffect, useRef } from "react";

export default function ChatMessages({ messages, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div ref={scrollRef} className="p-4 h-72 overflow-y-auto space-y-2 scroll-smooth">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={msg.from === "user" ? "text-right" : "text-left"}
        >
          <span
            className={`
                inline-block px-4 py-2 rounded-xl text-sm
                ${msg.from === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
              }
              `}
          >
            {msg.text}
          </span>
        </div>
      ))}
      {loading && (
        <div className="text-left">
          <span className="inline-block px-4 py-3 rounded-xl bg-secondary text-secondary-foreground">
            <div className="flex gap-1 items-center h-2">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </span>
        </div>
      )}
    </div>
  );
}
