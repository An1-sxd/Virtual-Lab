export default function ChatMessages({ messages }) {
    return (
      <div className="p-4 h-72 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.from === "user" ? "text-right" : "text-left"}
          >
            <span
              className={`
                inline-block px-4 py-2 rounded-xl text-sm
                ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }
              `}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    );
  }
  