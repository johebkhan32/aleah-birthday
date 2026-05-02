import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

interface Memory {
  id: number;
  title: string;
  color: string;
  emoji: string;
  message: string;
}

interface MemoryGalleryProps {
  onContinue: () => void;
}

const memories: Memory[] = [
  { id: 1, title: 'First Smile', color: 'bg-blue-100', emoji: '😊', message: "I've been thinking about how to write this, and honestly nothing feels enough for what I feel… but I'll still try, baby." },
  { id: 2, title: 'Adventure Day', color: 'bg-green-100', emoji: '🌲', message: "It's only been three weeks, but it never felt that small to me. I still remember how it all started so casually, calling you bestie like it meant nothing. Then slowly it became love, then jaan, then honey… and somewhere in between, you became someone really special to me. I didn't plan that, it just happened." },
  { id: 3, title: 'Laughter Moment', color: 'bg-yellow-100', emoji: '😄', message: "And that moment when I joined your club just to get your attention… I still smile thinking about it. It might sound small, but for me it meant everything. The way you noticed it, the way you found it cute… that moment stayed with me." },
  { id: 4, title: 'Sunset Vibes', color: 'bg-orange-100', emoji: '🌅', message: "We had our little fights too. You teasing me, bullying me, and me acting like I'm annoyed but secretly enjoying every bit of it. Those moments, even the messy ones, felt real. And real is rare." },
  { id: 5, title: 'Together Time', color: 'bg-pink-100', emoji: '💕', message: "It's crazy how you're so far away, yet you became a part of my everyday life. Your energy, your vibe, your presence… it all started to mean something to me." },
  { id: 6, title: 'Dream Chasing', color: 'bg-purple-100', emoji: '✨', message: "I know I wasn't perfect. I made mistakes, I overdid things, and I didn't always handle things the right way. But one thing I'm sure of… whatever I felt with you was real, baby." },
  { id: 7, title: 'Celebration', color: 'bg-red-100', emoji: '🎉', message: "On your birthday, I don't want to complicate anything. I just hope you feel happy, peaceful, and loved today. You deserve a day that feels light, beautiful, and full of good moments." },
  { id: 8, title: 'Peaceful Moment', color: 'bg-teal-100', emoji: '🌸', message: "And no matter what happens from here, these memories with you will always stay with me." },
];

export function MemoryGallery({ onContinue }: MemoryGalleryProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background grain py-16 px-4 md:px-8"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Treasured Memories
          </h2>
          <p className="text-xl text-muted-foreground">
            A collection of special moments we cherish
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-accent-warm to-transparent mb-16 origin-center"
        />

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(memory.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedMemory(memory)}
              className="cursor-pointer"
            >
              {/* Polaroid Card */}
              <motion.div
                animate={{
                  y: hoveredId === memory.id ? -8 : 0,
                  rotate: hoveredId === memory.id ? 0 : (memory.id % 2 === 0 ? -2 : 2),
                }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-sm shadow-soft-lg p-4 transform origin-center"
              >
                {/* Image Area */}
                <div
                  className={`${memory.color} w-full h-40 rounded-sm flex items-center justify-center mb-3 transition-all duration-300`}
                >
                  <span className="text-5xl md:text-6xl">{memory.emoji}</span>
                </div>

                {/* Caption */}
                <p className="text-center text-sm text-foreground font-light">
                  {memory.title}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-accent-warm text-blue-600 rounded-full font-display text-lg shadow-soft-lg hover:shadow-soft-lg hover:scale-105 transition-all duration-300"
          >
            Continue to Message
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl max-w-md w-full relative border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <div className={`w-20 h-20 ${selectedMemory.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-6`}>
                {selectedMemory.emoji}
              </div>
              
              <h3 className="text-2xl font-display font-bold text-center mb-4">{selectedMemory.title}</h3>
              
              <p className="text-center text-lg leading-relaxed text-muted-foreground">
                {selectedMemory.message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
