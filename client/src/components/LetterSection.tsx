import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';

interface LetterSectionProps {
  onRestart: () => void;
}

// ===== ADD YOUR CUSTOM SONG URL HERE =====
// (Music is now handled globally in Home.tsx)

const letterText = `Happy Birthday, Honey💫

I’ve been thinking about how to write this, and honestly nothing feels enough for what I feel… but I’ll still try, baby.

It’s only been three weeks, but it never felt that small to me. I still remember how it all started so casually, calling you bestie like it meant nothing. Then slowly it became love, then jaan, then honey… and somewhere in between, you became someone really special to me. I didn’t plan that, it just happened.

And that moment when I joined your club just to get your attention… I still smile thinking about it. It might sound small, but for me it meant everything. The way you noticed it, the way you found it cute… that moment stayed with me.

We had our little fights too. You teasing me, bullying me, and me acting like I’m annoyed but secretly enjoying every bit of it. Those moments, even the messy ones, felt real. And real is rare.

It’s crazy how you’re so far away, yet you became a part of my everyday life. Your energy, your vibe, your presence… it all started to mean something to me.

I know I wasn’t perfect. I made mistakes, I overdid things, and I didn’t always handle things the right way. But one thing I’m sure of… whatever I felt with you was real, baby.

On your birthday, I don’t want to complicate anything. I just hope you feel happy, peaceful, and loved today. You deserve a day that feels light, beautiful, and full of good moments.

And no matter what happens from here, these memories with you will always stay with me.

And if there’s one thing I truly wish for you, baby, it’s that life keeps being kind to you in the quiet ways too… not just today, but every day ahead. I hope you keep smiling the way you do, keep chasing what you want without doubting yourself, and keep being exactly who you are. You have this way of making things feel lighter, even from miles away, and that’s something really rare. I’m just grateful I got to experience that, even for a little while.

Happy Birthday, baby 💛`;

export function LetterSection({ onRestart }: LetterSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || displayedText.length >= letterText.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(letterText.slice(0, displayedText.length + 1));
    }, 30);

    return () => clearTimeout(timer);
  }, [displayedText, isTyping]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background grain py-16 px-4 md:px-8 flex items-center justify-center relative overflow-hidden"
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

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Glassmorphism Background */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          transition={{ duration: 1, delay: 0.3 }}
          className="glass rounded-2xl p-8 md:p-12 shadow-soft-lg border border-white/20"
        >
          {/* Letter Content */}
          <div className="space-y-6">
            {displayedText.split('\n').map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`${
                  line.includes('Happy Birthday') || line.includes('baby 💛')
                    ? 'font-display text-xl md:text-2xl font-bold text-accent-warm'
                    : 'text-base md:text-lg text-foreground leading-relaxed'
                }`}
              >
                {line}
              </motion.p>
            ))}

            {/* Cursor animation */}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-1 h-6 bg-accent-warm ml-1"
              />
            )}
          </div>

          {/* Divider */}
          {!isTyping && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-accent-warm to-transparent my-8 origin-center"
            />
          )}

          {/* Restart Button */}
          {!isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <button
                onClick={onRestart}
                className="px-8 py-4 bg-accent-warm text-blue-600 rounded-full font-display text-lg shadow-soft-lg hover:shadow-soft-lg hover:scale-105 transition-all duration-300"
              >
                Celebrate Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
