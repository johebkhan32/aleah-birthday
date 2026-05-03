import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudioDetection } from '@/hooks/useAudioDetection';

interface BirthdayCakeProps {
  candlesLit: boolean;
  onCandlesExtinguished: () => void;
  micEnabled: boolean;
}

interface Candle {
  id: number;
  x: number;
  y: number;
  lit: boolean;
}

export function BirthdayCake({
  candlesLit,
  onCandlesExtinguished,
  micEnabled,
}: BirthdayCakeProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [allExtinguished, setAllExtinguished] = useState(false);
  const cakeSvgRef = useRef<SVGSVGElement>(null);

  // Initialize single candle
  useEffect(() => {
    const initialCandles: Candle[] = [
      {
        id: 0,
        x: 100,
        y: 92,
        lit: true,
      },
    ];
    setCandles(initialCandles);
  }, []);

  // Handle blow detection
  const handleBlow = () => {
    if (!allExtinguished && micEnabled) {
      setCandles((prev) =>
        prev.map((candle) => ({
          ...candle,
          lit: false,
        }))
      );

      setTimeout(() => {
        setAllExtinguished(true);
        onCandlesExtinguished();
      }, 500);
    }
  };

  useAudioDetection({
    threshold: 130,
    onBlow: handleBlow,
    enabled: micEnabled && !allExtinguished,
    sustainedFrames: 8,
    gracePeriodMs: 2000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent opacity-5"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-accent opacity-5"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8 text-center"
        >
          Make a Wish and Blow...
        </motion.h2>

        {/* Cake SVG */}
        <motion.svg
          ref={cakeSvgRef}
          viewBox="0 0 200 200"
          className="w-64 h-64 md:w-80 md:h-80 drop-shadow-soft-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Cake base */}
          <defs>
            <linearGradient id="cakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#F5E6E0', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#E8D5B7', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cake layers */}
          <ellipse cx="100" cy="140" rx="70" ry="15" fill="#E8D5B7" />
          <rect x="30" y="100" width="140" height="50" fill="url(#cakeGradient)" rx="5" />
          <ellipse cx="100" cy="100" rx="70" ry="15" fill="#F5E6E0" />

          {/* Frosting swirls */}
          <path
            d="M 50 90 Q 60 80 70 85 T 90 80"
            stroke="#D4A574"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 110 80 Q 120 75 130 80 T 150 85"
            stroke="#D4A574"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />

          {/* Single Candle */}
          {candles.map((candle) => (
            <g key={candle.id}>
              {/* Candle stick */}
              <rect
                x={candle.x - 2}
                y={candle.y - 12}
                width="4"
                height="12"
                fill="#F5DEB3"
                rx="2"
              />

              {/* Flame */}
              {candle.lit && (
                <motion.g
                  animate={{
                    y: [0, -2, 0],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}
                  filter="url(#glow)"
                >
                  {/* Outer flame (yellow) */}
                  <path
                    d={`M ${candle.x} ${candle.y - 14} Q ${candle.x - 2} ${candle.y - 20} ${candle.x} ${candle.y - 24} Q ${candle.x + 2} ${candle.y - 20} ${candle.x} ${candle.y - 14}`}
                    fill="#FFD700"
                    opacity="0.8"
                  />
                  {/* Inner flame (orange) */}
                  <path
                    d={`M ${candle.x} ${candle.y - 16} Q ${candle.x - 1} ${candle.y - 20} ${candle.x} ${candle.y - 23} Q ${candle.x + 1} ${candle.y - 20} ${candle.x} ${candle.y - 16}`}
                    fill="#FFA500"
                    opacity="0.9"
                  />
                  {/* Core flame (white) */}
                  <circle cx={candle.x} cy={candle.y - 18} r="1" fill="#FFFACD" opacity="1" />
                </motion.g>
              )}

              {/* Extinguished candle (smoke effect) */}
              {!candle.lit && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0.5, 0] }}
                  transition={{ duration: 1 }}
                >
                  <circle cx={candle.x} cy={candle.y - 20} r="2" fill="#999" opacity="0.6" />
                  <circle cx={candle.x - 1} cy={candle.y - 23} r="1.5" fill="#999" opacity="0.4" />
                  <circle cx={candle.x + 1} cy={candle.y - 23} r="1.5" fill="#999" opacity="0.4" />
                </motion.g>
              )}
            </g>
          ))}
        </motion.svg>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center max-w-md"
        >
          {!allExtinguished ? (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                🎤 Blow into your microphone to extinguish the candle
              </p>
              <p className="text-sm text-muted-foreground opacity-75">
                1 candle burning
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-2xl font-display font-bold text-accent-warm mb-2">
                🎉 Candle Blown Out! 🎉
              </p>
              <p className="text-lg text-muted-foreground">
                Your wish has been made...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
