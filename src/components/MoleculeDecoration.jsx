export const MoleculeDecoration = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles representing molecules */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '0.5s' }} />
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="70%" y1="15%" x2="85%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="25%" y1="70%" x2="45%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="60%" y1="75%" x2="80%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1" />
      </svg>
    </div>
  );
};
