import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, Share2, Users, FileEdit, Eye, 
  Download, Plus, RefreshCw, Mail, Calendar, 
  MapPin, Check, QrCode, Sliders, Smartphone, Laptop, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventInvitation, RSVPResponse, GuestbookEntry } from './types';
import { PRESET_TEMPLATES } from './data/presets';
import { CardInvitationView } from './components/CardInvitationView';
import { EnvelopeExperience } from './components/EnvelopeExperience';
import { RSVPModal } from './components/RSVPModal';
import { RSVPTracker } from './components/RSVPTracker';
import { ShareAndExportHub } from './components/ShareAndExportHub';
import { EditorSidebar } from './components/EditorSidebar';

type AppMode = 'editor' | 'guest-card' | 'rsvp-tracker' | 'share-export';

export default function App() {
  // Current Event state with localStorage persistence
  const [events, setEvents] = useState<EventInvitation[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('celebration_studio_events');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to presets
      }
    }
    return PRESET_TEMPLATES;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    return PRESET_TEMPLATES[0].id;
  });
  const [activeMode, setActiveMode] = useState<AppMode>('editor');

  // Persist events to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('celebration_studio_events', JSON.stringify(events));
      } catch {
        // storage quota exceeded or disabled
      }
    }
  }, [events]);

  // Device preview simulation in editor mode
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive envelope modal experience
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [envelopeOpenedState, setEnvelopeOpenedState] = useState(false);

  // RSVP Submission modal
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

  // Active Event accessor
  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  // Guestbook & RSVPs state (locally synced + api ready)
  const [rsvps, setRsvps] = useState<RSVPResponse[]>(activeEvent.rsvps || []);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(activeEvent.guestbook || []);

  // Synchronize RSVPs and Guestbook when active event switches
  useEffect(() => {
    const current = events.find(e => e.id === activeEventId) || events[0];
    setRsvps(current.rsvps || []);
    setGuestbookEntries(current.guestbook || []);
  }, [activeEventId]);

  // Check URL query parameters for direct shared links (?event=wedding-slug&guest=Name)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get('event');
      if (eventParam) {
        const found = events.find(e => e.slug === eventParam || e.id === eventParam);
        if (found) {
          setActiveEventId(found.id);
          setActiveMode('guest-card');
          setIsEnvelopeOpen(true);
        }
      }
    }
  }, []);

  // Update Event handler
  const handleUpdateEvent = (updated: EventInvitation) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  // RSVP Submission handler
  const handleRSVPSubmit = (newRsvp: RSVPResponse) => {
    setRsvps(prev => [newRsvp, ...prev]);
    // Also save to active event state
    setEvents(prev => prev.map(e => {
      if (e.id === activeEvent.id) {
        return {
          ...e,
          rsvps: [newRsvp, ...(e.rsvps || [])],
        };
      }
      return e;
    }));
  };

  // Check-In toggle in RSVP Tracker
  const handleCheckInToggle = (rsvpId: string, currentCheckedIn: boolean) => {
    const updated = rsvps.map(r => r.id === rsvpId ? { ...r, checkedIn: !currentCheckedIn } : r);
    setRsvps(updated);
    setEvents(prev => prev.map(e => e.id === activeEvent.id ? { ...e, rsvps: updated } : e));
  };

  // Delete RSVP
  const handleDeleteRSVP = (rsvpId: string) => {
    const updated = rsvps.filter(r => r.id !== rsvpId);
    setRsvps(updated);
    setEvents(prev => prev.map(e => e.id === activeEvent.id ? { ...e, rsvps: updated } : e));
  };

  // Add manual RSVP
  const handleAddManualRSVP = (data: Partial<RSVPResponse>) => {
    const newEntry: RSVPResponse = {
      id: `rsvp-${Date.now()}`,
      eventId: activeEvent.id,
      guestName: data.guestName || 'Guest',
      email: data.email || '',
      phone: data.phone || '',
      status: data.status || 'attending',
      attendingCount: data.attendingCount || 1,
      plusOneNames: data.plusOneNames || [],
      mealPreference: data.mealPreference || 'Standard',
      dietaryNotes: data.dietaryNotes || '',
      submittedAt: new Date().toISOString(),
      checkInCode: `CE-${Math.floor(1000 + Math.random() * 9000)}`,
      checkedIn: false,
    };
    handleRSVPSubmit(newEntry);
  };

  // Add Guestbook entry
  const handleAddGuestbookEntry = (name: string, message: string, emoji: string) => {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      eventId: activeEvent.id,
      authorName: name,
      message,
      emoji,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...guestbookEntries];
    setGuestbookEntries(updated);
    setEvents(prev => prev.map(e => e.id === activeEvent.id ? { ...e, guestbook: updated } : e));
  };

  // Create new blank / preset event
  const handleCreateNewEvent = (templateType: 'wedding' | 'birthday' | 'gala') => {
    const basePreset = PRESET_TEMPLATES.find(e => e.eventType === templateType) || PRESET_TEMPLATES[0];
    const newEvent: EventInvitation = {
      ...basePreset,
      id: `event-${Date.now()}`,
      slug: `my-${templateType}-${Date.now().toString().slice(-4)}`,
      title: templateType === 'wedding' ? 'Our Wedding Celebration' : templateType === 'birthday' ? 'Birthday Soirée' : 'Annual Charity Gala',
      hosts: templateType === 'wedding' ? 'Emma & Lucas' : 'The Host Committee',
      rsvps: [],
      guestbook: [],
    };
    setEvents([newEvent, ...events]);
    setActiveEventId(newEvent.id);
    setActiveMode('editor');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Sleek micro-dot matrix subtle background overlay */}
      <div className="absolute inset-0 bg-slate-dots opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR (Sleek Interface) */}
      {/* ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm shadow-indigo-200 shrink-0">
              E
            </div>
            
            <div className="hidden sm:block">
              <span className="font-semibold text-base tracking-tight text-slate-900 leading-tight block">
                Ethereal Invites
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                Celebration Studio & RSVP
              </span>
            </div>

            {/* Auto-saved badge */}
            <span className="hidden md:inline-flex items-center text-[11px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 border border-slate-200/60 rounded-md">
              Auto-saved
            </span>

            {/* Event Preset Selector */}
            <div className="ml-1 sm:ml-2">
              <select
                id="event-selector-dropdown"
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 max-w-[150px] sm:max-w-[210px] truncate transition-all"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Navigation Mode Switcher (Sleek pill bar) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="mode-editor-btn"
              onClick={() => setActiveMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'editor'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileEdit className={`w-3.5 h-3.5 ${activeMode === 'editor' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Studio Editor</span>
            </button>

            <button
              id="mode-guest-view-btn"
              onClick={() => setActiveMode('guest-card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'guest-card'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className={`w-3.5 h-3.5 ${activeMode === 'guest-card' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Guest Preview</span>
            </button>

            <button
              id="mode-rsvp-tracker-btn"
              onClick={() => setActiveMode('rsvp-tracker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'rsvp-tracker'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeMode === 'rsvp-tracker' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">RSVP Tracker</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                {rsvps.length}
              </span>
            </button>

            <button
              id="mode-share-export-btn"
              onClick={() => setActiveMode('share-export')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'share-export'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Share2 className={`w-3.5 h-3.5 ${activeMode === 'share-export' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Share & Export</span>
            </button>
          </div>

          {/* Right Action Quick CTA: Envelope Simulation / New Invite */}
          <div className="flex items-center gap-2">
            <button
              id="open-envelope-sim-btn"
              onClick={() => setIsEnvelopeOpen(true)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Experience 3D Virtual Envelope Opening"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Virtual Envelope</span>
            </button>

            {/* Primary Action Button */}
            <button
              id="global-rsvp-modal-btn"
              onClick={() => setIsRSVPModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Submit RSVP</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full overflow-x-hidden relative z-10">
        
        {/* VIEW 1: STUDIO EDITOR (SIDE-BY-SIDE) */}
        {activeMode === 'editor' && (
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Customization Controls Panel */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <EditorSidebar
                event={activeEvent}
                onChange={handleUpdateEvent}
              />
            </div>

            {/* Right: Live Interactive Card Preview */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-3">
              {/* Preview Bar with Desktop / Mobile device frame toggles */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-xs font-medium">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Live Interactive Preview</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setDeviceFrame('desktop')}
                      className={`p-1.5 rounded-md transition-colors ${deviceFrame === 'desktop' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Desktop View"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeviceFrame('mobile')}
                      className={`p-1.5 rounded-md transition-colors ${deviceFrame === 'mobile' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Mobile Phone View"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsEnvelopeOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                  >
                    Open Envelope View
                  </button>
                </div>
              </div>

              {/* Live Card Container framed */}
              <div className={`transition-all duration-300 mx-auto ${deviceFrame === 'mobile' ? 'max-w-md border-8 border-slate-900 rounded-[38px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-1 bg-slate-950' : 'w-full'}`}>
                <div className="overflow-y-auto max-h-[82vh] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-200 bg-white">
                  <CardInvitationView
                    event={activeEvent}
                    onOpenRSVP={() => setIsRSVPModalOpen(true)}
                    guestbookEntries={guestbookEntries}
                    onAddGuestbookEntry={handleAddGuestbookEntry}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: FULLSCREEN GUEST CARD VIEW */}
        {activeMode === 'guest-card' && (
          <div className="w-full">
            <CardInvitationView
              event={activeEvent}
              onOpenRSVP={() => setIsRSVPModalOpen(true)}
              guestbookEntries={guestbookEntries}
              onAddGuestbookEntry={handleAddGuestbookEntry}
            />
          </div>
        )}

        {/* VIEW 3: AUTOMATED RSVP TRACKER & GUEST LIST */}
        {activeMode === 'rsvp-tracker' && (
          <RSVPTracker
            event={activeEvent}
            rsvps={rsvps}
            onCheckInToggle={handleCheckInToggle}
            onDeleteRSVP={handleDeleteRSVP}
            onAddManualRSVP={handleAddManualRSVP}
          />
        )}

        {/* VIEW 4: SHARE & EXPORT HUB */}
        {activeMode === 'share-export' && (
          <ShareAndExportHub
            event={activeEvent}
            onPreviewOpen={() => {
              setActiveMode('guest-card');
              setIsEnvelopeOpen(true);
            }}
          />
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: 3D VIRTUAL ENVELOPE OPENING EXPERIENCE */}
      {/* ========================================================================= */}
      <EnvelopeExperience
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
        event={activeEvent}
        onOpenCard={() => {
          setIsEnvelopeOpen(false);
          setActiveMode('guest-card');
        }}
      />

      {/* ========================================================================= */}
      {/* MODAL 2: DIGITAL RSVP SUBMISSION FORM */}
      {/* ========================================================================= */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        event={activeEvent}
        onRSVPSubmitted={handleRSVPSubmit}
      />

    </div>
  );
}
