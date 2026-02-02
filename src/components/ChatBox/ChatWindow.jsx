import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, loading, onSend, onClose }) {
  return (
    <div
      className="
        fixed bottom-24 right-6 w-96
        lab-card animate-scale-in
      "
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display text-lg">VirtualLab Bot</h3>
        <button onClick={onClose} className="text-muted-foreground">
          ✕
        </button>
      </div>

      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSend={onSend} />
    </div>
  );
}
