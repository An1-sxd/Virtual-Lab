import React from 'react';

export const FlaskVisualization = ({
  acidVolume,
  baseVolume,
  maxVolume = 100,
  pH,
}) => {
  // Volume calculations
  const totalVolume = acidVolume + baseVolume;
  // Beaker fill level (visually capped at a reasonable height for the beaker)
  const beakerFillPercent = Math.min((totalVolume / (maxVolume * 1.5)) * 100, 80);
  
  // Burette fill level
  // Assuming a standard 50mL burette. If baseVolume is 0, it's full (level at top).
  // If baseVolume is 50, it's empty (level at bottom).
  // Visual height in the SVG for the liquid column is ~120 units.
  const buretteCapacity = 50; 
  const buretteLiquidHeightPercent = Math.max(0, ((buretteCapacity - baseVolume) / buretteCapacity) * 100);

  // Color based on pH (acid = red/orange, neutral = green, base = blue/purple)
  const getLiquidColor = () => {
    // Override for the specific "Red Acid" look request if pH is low, 
    // but keeping it dynamic adds to the simulation value.
    // The user's image shows Red for Acid, so let's bias the acid color to be a nice red.
    if (pH < 4) return '#ef4444'; // Red - Strong acid (Tailwind red-500)
    if (pH < 6) return '#f97316'; // Orange - Weak acid
    if (pH < 8) return '#22c55e'; // Green - Neutral
    if (pH < 10) return '#3b82f6'; // Blue - Weak base
    return '#8b5cf6'; // Purple - Strong base
  };

  const beakerLiquidColor = getLiquidColor();
  const buretteLiquidColor = '#06b6d4'; // Cyan-500 (Base)

  return (
    <div className="w-full h-full flex items-center justify-center bg-white/50 rounded-xl overflow-hidden">
      <svg 
        viewBox="0 0 300 400" 
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glass Gradient */}
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Beaker Liquid Clip */}
          <clipPath id="beakerLiquidClip">
            <path d="M120 280 L120 370 Q120 380 130 380 L210 380 Q220 380 220 370 L220 280 Z" />
          </clipPath>
        </defs>

        {/* --- STAND & CLAMPS --- */}
        {/* Base */}
        <rect x="40" y="380" width="220" height="12" rx="2" fill="#475569" />
        {/* Rod */}
        <rect x="60" y="50" width="8" height="330" rx="4" fill="#94a3b8" />
        
        {/* Clamps */}
        <g stroke="#64748b" strokeWidth="4">
           {/* Top Clamp */}
           <line x1="64" y1="100" x2="160" y2="100" />
           <circle cx="64" cy="100" r="6" fill="#475569" stroke="none"/>
           <path d="M150 90 L170 90 A 5 5 0 0 1 170 110 L150 110" fill="none" strokeWidth="3" />
           
           {/* Bottom Clamp */}
           <line x1="64" y1="220" x2="160" y2="220" />
           <circle cx="64" cy="220" r="6" fill="#475569" stroke="none"/>
           <path d="M150 210 L170 210 A 5 5 0 0 1 170 230 L150 230" fill="none" strokeWidth="3" />
        </g>

        {/* --- SURETTE (Base) --- */}
        <g transform="translate(150, 20)">
          {/* Burette Body Outline */}
          <rect x="0" y="0" width="20" height="220" rx="1" fill="url(#glassGradient)" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Burette Liquid */}
          {/* Start y depends on emptiness. Max height is ~220. */}
          {/* We render a rect from bottom up to level. */}
          <rect 
            x="2" 
            y={220 - (buretteLiquidHeightPercent / 100 * 220)} 
            width="16" 
            height={(buretteLiquidHeightPercent / 100 * 220)} 
            fill={buretteLiquidColor} 
            opacity="0.8"
          />
          
          {/* Volume Markings */}
          {[0, 10, 20, 30, 40].map(i => (
             <line key={i} x1="12" y1={10 + i * 50} x2="20" y2={10 + i * 50} stroke="#94a3b8" strokeWidth="1" />
          ))}

          {/* Tip & Stopcock */}
          <path d="M2 220 L8 240 L12 240 L18 220" fill="url(#glassGradient)" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="10" y1="240" x2="10" y2="270" stroke="#cbd5e1" strokeWidth="3" /> {/* Tip */}
          
          {/* Valve handle */}
          <rect x="2" y="235" width="16" height="6" rx="2" fill="#cbd5e1" />
        </g>

        {/* --- BEAKER (Acid) --- */}
        <g transform="translate(0, 0)">
          {/* Back of beaker (for transparency look) */}
          <path d="M120 280 L120 370 Q120 380 130 380 L210 380 Q220 380 220 370 L220 280" fill="url(#glassGradient)" stroke="none" />
          
          {/* Beaker Liquid */}
          <defs>
             <clipPath id="beakerClip">
                <path d="M120 280 L120 370 Q120 380 130 380 L210 380 Q220 380 220 370 L220 280 Z" />
             </clipPath>
          </defs>
          <g clipPath="url(#beakerClip)">
             <rect 
               x="120" 
               y={380 - (beakerFillPercent / 100 * 100)} 
               width="100" 
               height={(beakerFillPercent / 100 * 100)} 
               fill={beakerLiquidColor} 
               opacity="0.8" 
               className="transition-all duration-300 ease-in-out"
             />
             {/* Liquid Surface */}
             <ellipse 
               cx="170" 
               cy={380 - (beakerFillPercent / 100 * 100)} 
               rx="50" 
               ry="5" 
               fill={beakerLiquidColor} 
               opacity="0.9"
               className="transition-all duration-300 ease-in-out" 
             />
          </g>

          {/* Beaker Outline */}
          <path d="M120 280 L120 370 Q120 380 130 380 L210 380 Q220 380 220 370 L220 280" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <ellipse cx="170" cy="280" rx="50" ry="5" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Beaker Markings */}
          <line x1="130" y1="360" x2="140" y2="360" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="130" y1="340" x2="145" y2="340" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="130" y1="320" x2="140" y2="320" stroke="#cbd5e1" strokeWidth="2" />
        </g>

        {/* --- LABELS --- */}
        {/* Base Label */}
        <g>
           <text x="200" y="140" fontSize="16" fontWeight="600" fill="#334155" fontFamily="sans-serif">Base</text>
           <line x1="195" y1="135" x2="170" y2="135" stroke="#334155" strokeWidth="2" />
        </g>

        {/* Acid Label */}
        <g>
           <text x="240" y="340" fontSize="16" fontWeight="600" fill="#334155" fontFamily="sans-serif">Acid</text>
           <line x1="235" y1="335" x2="210" y2="335" stroke="#334155" strokeWidth="2" />
        </g>

      </svg>
      
      {/* Dynamic Caption */}
      <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground bg-white/80 p-2 rounded border border-border">
        pH: {pH.toFixed(2)}
      </div>
    </div>
  );
};
