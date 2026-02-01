/**
 * Neural Speak Logo Component
 * ---------------------------
 * Reusable SVG logo with neural network + waveform design.
 * Use throughout the app for consistent branding.
 */

interface LogoProps {
  /** Logo width/height in pixels or tailwind class */
  size?: "sm" | "md" | "lg";
  /** Optional additional CSS classes */
  className?: string;
  /** Show text label alongside logo */
  showText?: boolean;
  /** Custom text class for the label */
  textClass?: string;
}

/** Size mapping for logo dimensions */
const sizeMap = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
};

/**
 * Logo - Renders the Neural Speak brand logo
 * @param size - Logo size variant (sm, md, lg)
 * @param className - Additional container classes
 * @param showText - Whether to display "Neural Speak" text
 * @param textClass - Custom styling for the text label
 */
export function Logo({ 
  size = "md", 
  className = "", 
  showText = false,
  textClass = "text-sm font-semibold tracking-tight text-slate-200"
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          className={sizeMap[size]}
          aria-label="Neural Speak Logo"
        >
          {/* Outer neural ring - dashed circle representing connectivity */}
          <circle 
            cx="16" 
            cy="16" 
            r="14" 
            stroke="url(#logoGradient)" 
            strokeWidth="1.5" 
            strokeDasharray="4 2" 
            className="opacity-40" 
          />
          {/* Central waveform - audio visualization path */}
          <path 
            d="M8 16 L11 12 L14 18 L17 10 L20 20 L23 14 L26 16" 
            stroke="url(#logoGradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Neural nodes - input/output markers */}
          <circle cx="8" cy="16" r="2" fill="#94a3b8" />
          <circle cx="17" cy="10" r="1.5" fill="#cbd5e1" />
          <circle cx="20" cy="20" r="1.5" fill="#cbd5e1" />
          <circle cx="26" cy="16" r="2" fill="#94a3b8" />
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={textClass}>Neural Speak</span>
      )}
    </div>
  );
}

export default Logo;
