export default function ChatButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="
          fixed bottom-6 right-6
          w-14 h-14 rounded-full
          lab-gradient lab-glow
          flex items-center justify-center
          text-white shadow-lg
          hover:scale-105 transition
        "
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h8m-8 4h5m9-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }
  