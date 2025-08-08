'use client';

export default function EthicsIconPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg 
        className="absolute inset-0 w-full h-full" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 600"
        fill="none"
      >
        {/* Circuit pattern representing digital ethics */}
        <defs>
          <pattern 
            id="ethics-grid" 
            x="0" 
            y="0" 
            width="120" 
            height="120" 
            patternUnits="userSpaceOnUse"
          >
            {/* Node circles */}
            <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="60" cy="60" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="100" cy="100" r="2" fill="currentColor" opacity="0.3" />
            
            {/* Connection lines */}
            <line x1="20" y1="20" x2="60" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="60" y1="60" x2="100" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            
            {/* Ethics symbols - scales of justice represented abstractly */}
            <rect x="40" y="10" width="4" height="20" fill="currentColor" opacity="0.15" />
            <rect x="35" y="12" width="14" height="2" fill="currentColor" opacity="0.15" />
            <rect x="35" y="26" width="14" height="2" fill="currentColor" opacity="0.15" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#ethics-grid)" />
        
        {/* Floating elements for visual interest */}
        <g opacity="0.1">
          <circle cx="200" cy="100" r="4" fill="currentColor">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 10,-5; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="800" cy="200" r="3" fill="currentColor">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -8,8; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="400" cy="300" r="5" fill="currentColor">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,10; 0,0"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}