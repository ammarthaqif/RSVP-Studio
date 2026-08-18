import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, Clock, MapPin, Sparkles, Utensils, Music, 
  Gift, HelpCircle, Hotel, MessageSquare, ChevronDown, ChevronUp, 
  Send, Check, Share2, Download, GlassWater, Camera, Mic, 
  Volume2, VolumeX, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { EventInvitation, GuestbookEntry } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { formatDate, formatTime, calculateCountdown, createGoogleCalendarUrl, downloadICSFile } from '../utils/helpers';

interface CardInvitationViewProps {
  event: EventInvitation;
  onOpenRSVP: () => void;
  guestbookEntries: GuestbookEntry[];
  onAddGuestbookEntry?: (name: string, message: string, emoji: string) => void;
  isPrintPreview?: boolean;
}

export const CardInvitationView: React.FC<CardInvitationViewProps> = ({
  event,
  onOpenRSVP,
  guestbookEntries,
  onAddGuestbookEntry,
  isPrintPreview = false,
}) => {
  const [countdown, setCountdown] = useState(calculateCountdown(event.date, event.time));
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookMsg, setGuestbookMsg] = useState('');
  const [guestbookEmoji, setGuestbookEmoji] = useState('🥂');
  const [isPostingGuestbook, setIsPostingGuestbook] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Live countdown timer update
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(event.date, event.time));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date, event.time]);

  // Audio player handler for ambient wedding/event chime
  useEffect(() => {
    if (event.musicUrl) {
      const audio = new Audio(event.musicUrl);
      audio.loop = true;
      setAudioElement(audio);
      return () => {
        audio.pause();
      };
    }
  }, [event.musicUrl]);

  const toggleMusic = () => {
    if (!audioElement) return;
    if (isPlayingMusic) {
      audioElement.pause();
      setIsPlayingMusic(false);
    } else {
      audioElement.play().catch(() => {});
      setIsPlayingMusic(true);
    }
  };

  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case 'cormorant':
        return 'font-cormorant';
      case 'cinzel':
        return 'font-cinzel';
      case 'script':
        return 'font-script';
      case 'alex':
        return 'font-alex';
      case 'montserrat':
        return 'font-montserrat';
      case 'sans':
        return 'font-sans-clean';
      case 'serif':
      default:
        return 'font-serif-display';
    }
  };

  const getThemeWrapperClass = (theme: string) => {
    switch (theme) {
      case 'royal-velvet':
        return 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950';
      case 'boho-sunset':
        return 'bg-[#faf7f2] text-stone-900 selection:bg-amber-600 selection:text-white';
      case 'modern-slate':
        return 'bg-stone-100 text-stone-900 selection:bg-stone-900 selection:text-white';
      case 'neon-party':
        return 'bg-stone-950 text-stone-100 selection:bg-fuchsia-500 selection:text-white';
      case 'romantic-botanical':
        return 'bg-[#fbf9f6] text-stone-900 selection:bg-rose-300 selection:text-stone-900';
      case 'art-deco':
        return 'bg-stone-950 text-amber-100 selection:bg-amber-300 selection:text-black';
      case 'rustic-garden':
        return 'bg-[#f5f2eb] text-stone-900 selection:bg-emerald-700 selection:text-white';
      case 'classic-gold':
      default:
        return 'bg-[#fcfaf7] text-stone-900 selection:bg-amber-200 selection:text-stone-900';
    }
  };

  const getCardContainerClass = (theme: string, border: string) => {
    let borderClass = 'border border-stone-200';
    if (border === 'gold-foil') {
      borderClass = 'border-2 border-amber-300/80 shadow-2xl ring-1 ring-amber-400/40';
    } else if (border === 'floral-frame') {
      borderClass = 'border-4 border-double border-rose-200/90 shadow-xl';
    } else if (border === 'minimal-double') {
      borderClass = 'border-2 border-stone-800 shadow-xl';
    } else if (border === 'vintage-filigree') {
      borderClass = 'border-4 border-amber-500/50 shadow-2xl';
    }

    if (theme === 'royal-velvet') {
      return `bg-slate-900/90 backdrop-blur-md ${borderClass} shadow-2xl text-slate-100`;
    }
    if (theme === 'neon-party' || theme === 'art-deco') {
      return `bg-stone-900/95 backdrop-blur-md ${borderClass} shadow-2xl text-amber-50`;
    }
    return `bg-white/95 backdrop-blur-md ${borderClass} shadow-xl text-stone-900`;
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMsg.trim()) return;
    setIsPostingGuestbook(true);
    if (onAddGuestbookEntry) {
      onAddGuestbookEntry(guestbookName.trim(), guestbookMsg.trim(), guestbookEmoji);
    }
    setGuestbookMsg('');
    setTimeout(() => setIsPostingGuestbook(false), 400);
  };

  const getTimelineIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Music':
        return <Music className="w-4 h-4 text-violet-500" />;
      case 'GlassWater':
        return <GlassWater className="w-4 h-4 text-sky-500" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-indigo-500" />;
      case 'Mic':
        return <Mic className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className={`w-full min-h-screen py-6 sm:py-12 px-3 sm:px-6 transition-colors duration-500 ${getThemeWrapperClass(event.templateTheme)}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Floating Action Bar (RSVP & Calendar Shortcuts) */}
        {!isPrintPreview && (
          <div className="flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs no-print sticky top-3 z-30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Official Digital Invitation
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Music Player Button (if present) */}
              {event.musicUrl && (
                <button
                  onClick={toggleMusic}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                  title="Toggle background music"
                >
                  {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 text-indigo-500 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isPlayingMusic ? 'Mute Music' : 'Play Music'}</span>
                </button>
              )}

              {/* Add to Calendar Dropdown */}
              <div className="relative">
                <button
                  id="add-to-calendar-btn"
                  onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Add to Calendar</span>
                </button>

                {calendarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 animate-in fade-in zoom-in-95">
                    <a
                      href={createGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setCalendarMenuOpen(false)}
                    >
                      <span>Google Calendar</span>
                    </a>
                    <button
                      onClick={() => {
                        downloadICSFile(event);
                        setCalendarMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span>Apple Calendar (.ics)</span>
                    </button>
                    <button
                      onClick={() => {
                        downloadICSFile(event);
                        setCalendarMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span>Outlook / Other</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Primary RSVP CTA */}
              <button
                id="header-rsvp-cta-btn"
                onClick={onOpenRSVP}
                className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>RSVP Now</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRIMARY INVITATION CARD CONTAINER */}
        {/* ========================================================================= */}
        <div 
          id="printable-invitation-card"
          className={`relative rounded-3xl p-6 sm:p-12 transition-all ${getCardContainerClass(
            event.templateTheme,
            event.customization.cardBorder
          )}`}
        >
          {/* Subtle Decorative Filigree Corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 pointer-events-none rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 pointer-events-none rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 pointer-events-none rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 pointer-events-none rounded-br-lg" />

          {/* Monogram Seal Emblem */}
          {event.customization.monogramText && (
            <div className="flex justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-amber-300/80 shadow-md bg-amber-500/10 backdrop-blur-sm"
              >
                <span className={`text-base font-bold tracking-widest ${getFontFamilyClass(event.customization.fontFamily)}`}
                  style={{ color: event.customization.accentColor || '#c59b27' }}
                >
                  {event.customization.monogramText}
                </span>
              </div>
            </div>
          )}

          {/* Headline & Eyebrow */}
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-semibold block">
              {event.headline}
            </span>

            {/* Couple / Hosts Main Title */}
            <h1 
              className={`text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${getFontFamilyClass(
                event.customization.fontFamily
              )}`}
              style={{ color: event.templateTheme === 'royal-velvet' || event.templateTheme === 'art-deco' ? '#fbf6ba' : undefined }}
            >
              {event.hosts}
            </h1>

            {/* Subtitle invitation text */}
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-lg mx-auto italic font-cormorant leading-relaxed">
              {event.subtitle}
            </p>
          </div>

          {/* Hero Couple / Event Picture */}
          {event.heroImage && (
            <div className="my-8 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-stone-800 max-w-2xl mx-auto relative group">
              <img
                src={event.heroImage}
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Date, Time, Venue Key Information Block */}
          <div className="my-8 py-6 px-4 sm:px-8 rounded-2xl bg-stone-50/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 text-center max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Date */}
              <div className="flex flex-col items-center">
                <Calendar className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Date</span>
                <span className="text-base sm:text-lg font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  {formatDate(event.date)}
                </span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-stone-300 dark:bg-stone-600" />

              {/* Time */}
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Time</span>
                <span className="text-base sm:text-lg font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  {formatTime(event.time)} {event.endTime ? `– ${formatTime(event.endTime)}` : ''}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">{event.timezone}</span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-stone-300 dark:bg-stone-600" />

              {/* Venue City */}
              <div className="flex flex-col items-center">
                <MapPin className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Location</span>
                <span className="text-base sm:text-lg font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  {event.venue.city}, {event.venue.state || event.venue.country}
                </span>
              </div>
            </div>

            {/* RSVP Deadline Alert */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
              Kindly respond on or before <strong className="text-stone-900 dark:text-stone-100 font-semibold">{formatDate(event.rsvpDeadline)}</strong>
            </div>
          </div>

          {/* Live Countdown Timer */}
          {event.customization.showCountdown && !countdown.isPast && (
            <div className="my-8 text-center">
              <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-3">
                Counting Down To The Moment
              </span>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700">
                  <span className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 dark:text-stone-100 block">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Days</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700">
                  <span className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 dark:text-stone-100 block">
                    {countdown.hours}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Hours</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700">
                  <span className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 dark:text-stone-100 block">
                    {countdown.minutes}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Mins</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700">
                  <span className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 dark:text-stone-100 block">
                    {countdown.seconds}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">Secs</span>
                </div>
              </div>
            </div>
          )}

          {/* "Our Story" / Welcome Message */}
          {event.storyText && (
            <div className="my-10 max-w-2xl mx-auto text-center space-y-3">
              <h2 className="text-xl font-bold font-serif-display tracking-tight text-stone-900 dark:text-stone-100">
                Our Story
              </h2>
              <div className="w-12 h-0.5 bg-amber-400 mx-auto" />
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-cormorant leading-relaxed italic">
                "{event.storyText}"
              </p>
            </div>
          )}

          {/* Dress Code Card */}
          {event.customization.showDressCode && event.dressCode && (
            <div className="my-8 max-w-xl mx-auto p-5 rounded-2xl bg-amber-50/50 dark:bg-stone-800/60 border border-amber-200/70 dark:border-stone-700 text-center">
              <span className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-300 font-semibold block mb-1">
                Attire & Dress Code
              </span>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {event.dressCode}
              </p>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {event.customization.showGallery && event.galleryImages && event.galleryImages.length > 0 && (
            <div className="my-10">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Moments & Memories
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Photo Gallery
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {event.galleryImages.map((imgUrl, index) => (
                  <div 
                    key={index}
                    className="group relative rounded-2xl overflow-hidden shadow-md aspect-square bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery photo ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Itinerary / Timeline */}
          {event.customization.showItinerary && event.itinerary && event.itinerary.length > 0 && (
            <div className="my-12 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Schedule of Events
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Celebration Itinerary
                </h2>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-700">
                {event.itinerary.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 flex items-center justify-center shadow-sm shrink-0">
                        {getTimelineIcon(item.icon)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block font-mono">
                          {item.time}
                        </span>
                        <h4 className="text-base font-bold font-serif-display text-stone-900 dark:text-stone-100">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 sm:text-right max-w-xs font-sans-clean">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Venue Map Section */}
          {event.customization.showMap && event.venue && (
            <div className="my-12">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Getting There
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Venue Location & Navigation
                </h2>
              </div>
              <InteractiveMap venue={event.venue} accentColor={event.customization.accentColor} />
            </div>
          )}

          {/* Accommodations & Hotel Partner Blocks */}
          {event.customization.showAccommodations && event.accommodations && event.accommodations.length > 0 && (
            <div className="my-10 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Stay Nearby
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Guest Accommodations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.accommodations.map((acc, index) => (
                  <div 
                    key={acc.id || index}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm space-y-2"
                  >
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <Hotel className="w-4 h-4" />
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {acc.name}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-sans-clean">
                      {acc.address}
                    </p>
                    {acc.bookingCode && (
                      <div className="text-xs text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700/60 p-2 rounded-lg font-mono">
                        Booking Code: <strong>{acc.bookingCode}</strong>
                      </div>
                    )}
                    {acc.notes && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                        {acc.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gift Registry Links */}
          {event.customization.showGiftRegistry && event.giftRegistry && event.giftRegistry.length > 0 && (
            <div className="my-10 max-w-xl mx-auto text-center space-y-4">
              <div>
                <Gift className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Gift Registry
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  Your love and presence is the greatest gift. If you wish to bless us with a registry gift:
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {event.giftRegistry.map((reg, index) => (
                  <a
                    key={reg.id || index}
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 text-left transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs group-hover:text-amber-600">
                        {reg.title}
                      </h4>
                      {reg.note && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {reg.note}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Accordion */}
          {event.customization.showFaq && event.faqs && event.faqs.length > 0 && (
            <div className="my-10 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Event Q & A
                </h2>
              </div>

              <div className="space-y-3">
                {event.faqs.map((faq, index) => {
                  const isExpanded = expandedFaq === (faq.id || String(index));
                  return (
                    <div 
                      key={faq.id || index}
                      className="rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-stone-50/60 dark:bg-stone-800/60"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : (faq.id || String(index)))}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-stone-900 dark:text-stone-100 text-sm font-semibold hover:bg-stone-100/50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200/50 dark:border-stone-700/50 pt-3 font-sans-clean leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prominent Bottom RSVP Call-to-Action */}
          {!isPrintPreview && (
            <div className="my-12 p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-xl"
              style={{
                background: event.customization.accentColor 
                  ? `linear-gradient(135deg, ${event.customization.accentColor} 0%, #1c1917 100%)`
                  : 'linear-gradient(135deg, #c59b27 0%, #1c1917 100%)',
                color: '#ffffff'
              }}
            >
              <Sparkles className="w-8 h-8 mx-auto text-amber-200 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display">
                Will You Celebrate With Us?
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-md mx-auto">
                Please let us know your attendance and meal preferences by {formatDate(event.rsvpDeadline)}.
              </p>
              <button
                id="main-rsvp-trigger-btn"
                onClick={onOpenRSVP}
                className="px-8 py-3.5 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 text-sm font-bold shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Open Digital RSVP Form</span>
              </button>
            </div>
          )}

          {/* Live Guestbook & Well Wishes Wall */}
          {event.customization.showGuestbook && (
            <div className="my-12 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
                  Love & Blessings
                </span>
                <h2 className="text-2xl font-bold font-serif-display text-stone-900 dark:text-stone-100">
                  Guestbook Wall
                </h2>
              </div>

              {/* Guestbook New Post Form */}
              <form onSubmit={handleGuestbookSubmit} className="mb-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={guestbookName}
                    onChange={(e) => setGuestbookName(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <div className="flex gap-1.5 justify-around items-center bg-white dark:bg-stone-700 px-2 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600">
                    {['🥂', '💍', '✨', '💖', '🎉'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setGuestbookEmoji(emoji)}
                        className={`text-base p-1 rounded-lg transition-transform ${guestbookEmoji === emoji ? 'scale-125 bg-amber-100 dark:bg-amber-900/50' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Leave a heartfelt note or congratulations..."
                    required
                    value={guestbookMsg}
                    onChange={(e) => setGuestbookMsg(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="submit"
                    disabled={isPostingGuestbook}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    style={{ backgroundColor: event.customization.accentColor || '#1c1917' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Guestbook Entries Stream */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {guestbookEntries.length === 0 ? (
                  <p className="text-center text-xs text-stone-500 py-6">
                    Be the first guest to write a message in the guestbook!
                  </p>
                ) : (
                  guestbookEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm flex items-start gap-3"
                    >
                      <span className="text-2xl p-1 rounded-xl bg-white dark:bg-stone-700 shadow-inner">
                        {entry.emoji || '✨'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {entry.authorName}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-sans-clean leading-relaxed">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div className="mt-12 pt-6 border-t border-stone-200/80 dark:border-stone-700/80 text-center space-y-1">
            <span className="text-xs font-serif-display tracking-widest text-stone-400 uppercase">
              With Love & Gratitude
            </span>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              {event.hosts}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
