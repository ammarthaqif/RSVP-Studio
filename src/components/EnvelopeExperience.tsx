import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Heart, Crown, Award, Music, Volume2, VolumeX, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventInvitation } from '../types';

interface EnvelopeExperienceProps {
  event: EventInvitation;
  onOpen: () => void;
  isOpen: boolean;
}

export const EnvelopeExperience: React.FC<EnvelopeExperienceProps> = ({ event, onOpen, isOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getEnvelopeColorClass = (color: string) => {
    switch (color) {
      case 'burgundy':
        return 'bg-rose-950 border-rose-900 text-rose-100 shadow-rose-950/40';
      case 'navy':
        return 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/40';
      case 'emerald':
        return 'bg-emerald-950 border-emerald-900 text-emerald-100 shadow-emerald-950/40';
      case 'charcoal':
        return 'bg-stone-900 border-stone-800 text-stone-100 shadow-stone-950/40';
      case 'rose':
        return 'bg-rose-100 border-rose-200 text-stone-800 shadow-rose-200/50';
      case 'cream':
      default:
        return 'bg-[#f7f4ed] border-[#e6dfd1] text-stone-800 shadow-stone-400/20';
    }
  };

  const renderWaxSealIcon = () => {
    const seal = event.customization.envelopeWaxSeal || 'initials';
    switch (seal) {
      case 'heart':
        return <Heart className="w-5 h-5 text-amber-100 fill-amber-100/30" />;
      case 'crown':
        return <Crown className="w-5 h-5 text-amber-100" />;
      case 'rings':
      case 'flower':
        return <Sparkles className="w-5 h-5 text-amber-100" />;
      case 'initials':
      default:
        return (
          <span className="font-serif font-bold text-xs tracking-wider text-amber-100 uppercase">
            {event.customization.monogramText || 'S & L'}
          </span>
        );
    }
  };

  const handleOpenClick = () => {
    setIsOpening(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#e5c07b', '#f7f4ed', '#b76e79'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 900);
  };

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_50%_40%,#c59b27_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium block mb-2">
            You are cordially invited
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-white tracking-wide">
            {event.hosts || event.title}
          </h1>
          <p className="text-xs text-stone-300 mt-2 font-sans-clean">
            Click the wax seal or envelope to open your digital invitation card
          </p>
        </motion.div>

        {/* Realistic Envelope Container */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenClick}
          id="interactive-envelope-trigger"
          className="relative w-72 sm:w-96 h-48 sm:h-64 cursor-pointer perspective-1000 group select-none shadow-2xl rounded-2xl"
        >
          {/* Envelope Body */}
          <div
            className={`w-full h-full rounded-2xl border-2 shadow-2xl relative overflow-hidden flex items-center justify-center transition-all ${getEnvelopeColorClass(
              event.customization.envelopeColor
            )}`}
          >
            {/* Envelope diagonal folds design */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="none">
                <path d="M0,0 L200,130 L400,0 Z" fill="currentColor" />
                <path d="M0,0 L0,260 L200,130 Z" fill="currentColor" opacity="0.5" />
                <path d="M400,0 L400,260 L200,130 Z" fill="currentColor" opacity="0.5" />
                <path d="M0,260 L200,130 L400,260 Z" fill="currentColor" opacity="0.8" />
              </svg>
            </div>

            {/* Inner Gold Foil Letter Sneak Peek */}
            <motion.div
              animate={isOpening ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-5/6 h-4/5 bg-white rounded-xl shadow-lg border border-amber-200/60 p-4 flex flex-col items-center justify-center text-center transform -rotate-1 group-hover:rotate-0 transition-transform"
            >
              <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold mb-1">
                {event.eventType.toUpperCase()} INVITATION
              </span>
              <p className="text-xs font-serif-display font-semibold text-stone-800 line-clamp-1">
                {event.title}
              </p>
              <div className="w-12 h-px bg-amber-400 my-1.5" />
              <span className="text-[10px] text-stone-500 font-sans-clean">
                {event.date} • {event.venue.city}
              </span>
            </motion.div>

            {/* Wax Seal Button in Center */}
            <motion.div
              animate={isOpening ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
              className="absolute z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 border-2 border-amber-300 shadow-xl flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform"
              style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-400/50 flex items-center justify-center bg-amber-900/40">
                {renderWaxSealIcon()}
              </div>
            </motion.div>
          </div>

          {/* Click to open badge below envelope */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-amber-200/90 group-hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Click to Break Wax Seal & Open</span>
          </div>
        </motion.div>

        {/* Direct Skip Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            id="skip-envelope-btn"
            onClick={onOpen}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-sm border border-white/10 transition-all flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Invitation Card Directly</span>
          </button>
        </div>
      </div>
    </div>
  );
};
