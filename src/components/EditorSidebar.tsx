import React, { useState } from 'react';
import { 
  Sparkles, Palette, MapPin, Image as ImageIcon, 
  Calendar, Clock, ListPlus, HelpCircle, Gift, 
  Hotel, Plus, Trash2, Wand2, Upload, Check, RefreshCw, 
  ChevronRight, AlignLeft, Music, Type
} from 'lucide-react';
import { EventInvitation, EventType, TemplateTheme } from '../types';

interface EditorSidebarProps {
  event: EventInvitation;
  onChange: (updated: EventInvitation) => void;
}

type TabType = 'basics' | 'theme' | 'venue' | 'media' | 'details' | 'itinerary' | 'ai';

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ event, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basics');
  
  // AI Copilot state
  const [aiTone, setAiTone] = useState('Romantic & Elegant');
  const [aiLanguage, setAiLanguage] = useState('English');
  const [aiSpecialDetails, setAiSpecialDetails] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const updateField = (field: keyof EventInvitation, value: any) => {
    onChange({ ...event, [field]: value });
  };

  const updateVenue = (field: keyof EventInvitation['venue'], value: any) => {
    onChange({
      ...event,
      venue: {
        ...event.venue,
        [field]: value,
      },
    });
  };

  const updateCustomization = (field: keyof EventInvitation['customization'], value: any) => {
    onChange({
      ...event,
      customization: {
        ...event.customization,
        [field]: value,
      },
    });
  };

  // Image Upload handler (Data URL)
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateField('heroImage', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    updateField('galleryImages', [...(event.galleryImages || []), url.trim()]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = [...event.galleryImages];
    updated.splice(index, 1);
    updateField('galleryImages', updated);
  };

  // Itinerary helpers
  const handleAddItineraryItem = () => {
    const newItem = {
      id: `itin-${Date.now()}`,
      time: '6:00 PM',
      title: 'Reception & Toasts',
      description: 'Gather for speeches and celebrations.',
      icon: 'Sparkles',
    };
    updateField('itinerary', [...event.itinerary, newItem]);
  };

  const handleUpdateItineraryItem = (index: number, field: string, value: string) => {
    const updated = [...event.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    updateField('itinerary', updated);
  };

  const handleRemoveItineraryItem = (index: number) => {
    const updated = [...event.itinerary];
    updated.splice(index, 1);
    updateField('itinerary', updated);
  };

  // FAQ helpers
  const handleAddFAQ = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: 'Is there parking on site?',
      answer: 'Yes, valet and self-parking are available at the entrance.',
    };
    updateField('faqs', [...event.faqs, newFaq]);
  };

  const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...event.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateField('faqs', updated);
  };

  const handleRemoveFAQ = (index: number) => {
    const updated = [...event.faqs];
    updated.splice(index, 1);
    updateField('faqs', updated);
  };

  // AI Copilot Generator Trigger
  const handleGenerateAIWording = async () => {
    setAiLoading(true);
    setAiSuccessMsg('');
    try {
      const response = await fetch('/api/ai/generate-wording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.eventType,
          tone: aiTone,
          hosts: event.hosts,
          title: event.title,
          details: aiSpecialDetails,
          language: aiLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
          setAiSuggestions(data.suggestions);
          return;
        }
      }
      throw new Error('Fallback to client templates');
    } catch {
      // High quality client-side fallback suggestions for static hosting environments (e.g. GitHub Pages)
      const fallbackSuggestions = [
        {
          headline: aiTone.includes('Formal') ? 'Request the Honor of Your Presence' : 'Together with Joy & Celebration',
          subtitle: `With joyful hearts, we warmly invite you to join us as we celebrate our love and shared future.`,
          storyText: `From our very first encounter under the starry night to building a life filled with laughter, adventure, and unwavering companionship, our journey has been blessed by the warmth of cherished family and dear friends like you.`,
          dressCode: aiTone.includes('Black Tie') ? 'Black Tie & Elegant Evening Attire' : 'Formal Cocktail & Celebration Attire',
        },
        {
          headline: 'Two Lives, One Extraordinary Journey',
          subtitle: `Your love, friendship, and guidance have meant the world to us. Please honor us with your presence on our special day.`,
          storyText: `True love is finding your companion, best friend, and confidant all in one. We are so excited to celebrate the next chapter of our story with the people who matter most.`,
          dressCode: 'Semi-Formal / Festive Garden Party Chic',
        },
        {
          headline: 'A Celebration of Love, Friendship & Family',
          subtitle: `Please join us for an unforgettable evening of vows, joyful toasts, dinner, and dancing under the stars.`,
          storyText: `Every great story deserves a celebration. We cannot wait to raise a glass and make lifelong memories together with you.`,
          dressCode: 'Smart Casual / Cocktail Attire',
        }
      ];
      setAiSuggestions(fallbackSuggestions);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAISuggestion = (suggestion: any) => {
    onChange({
      ...event,
      headline: suggestion.headline || event.headline,
      subtitle: suggestion.subtitle || event.subtitle,
      storyText: suggestion.storyText || event.storyText,
      dressCode: suggestion.dressCode || event.dressCode,
    });
    setAiSuccessMsg('Applied AI wording to your invitation!');
    setTimeout(() => setAiSuccessMsg(''), 3500);
  };

  // Curated sample photography presets
  const curatedHeroImages = [
    { label: 'Vineyard Sunset', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Classic Couple', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Gala Chandelier', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Boho Sunset', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Garden Arch', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Curated Venue Presets
  const venuePresets = [
    { name: 'Villa Bella Vista Vineyard', city: 'St. Helena, CA', lat: 38.5134, lon: -122.4682 },
    { name: 'The Metropolitan Grand Rotunda', city: 'New York, NY', lat: 40.7794, lon: -73.9632 },
    { name: 'The Terracotta Palm Rooftop', city: 'Los Angeles, CA', lat: 34.0453, lon: -118.2547 },
    { name: 'Château de Chantilly', city: 'Chantilly, France', lat: 49.1938, lon: 2.4853 },
    { name: 'Villa d’Este Lake Como', city: 'Cernobbio, Italy', lat: 45.8453, lon: 9.0734 },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[85vh]">
      
      {/* Top Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-1 overflow-x-auto text-xs font-medium select-none">
        <button
          onClick={() => setActiveTab('basics')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'basics' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>Basics</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'theme' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme & Style</span>
        </button>

        <button
          onClick={() => setActiveTab('venue')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'venue' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Venue & Map</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'media' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Photos</span>
        </button>

        <button
          onClick={() => setActiveTab('itinerary')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'itinerary' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5" />
          <span>Schedule & FAQ</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ai' ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-200' : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Co-Pilot</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
        
        {/* ==================== BASICS TAB ==================== */}
        {activeTab === 'basics' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Event Details & Wording
              </h3>
              <p className="text-slate-400 text-[11px]">Customize titles, dates, hosts, and storyline</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Event Type</label>
              <select
                value={event.eventType}
                onChange={(e) => updateField('eventType', e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="wedding">💍 Wedding Celebration</option>
                <option value="birthday">🎂 Birthday Soirée</option>
                <option value="gala">✨ Charity Gala / Black Tie</option>
                <option value="anniversary">🥂 Anniversary Celebration</option>
                <option value="babyshower">👶 Baby Shower</option>
                <option value="party">🎉 Cocktail / Dinner Party</option>
                <option value="corporate">🏢 Corporate Conference / Awards</option>
                <option value="engagement">💍 Engagement Party</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Couple / Hosts Names</label>
              <input
                type="text"
                value={event.hosts}
                onChange={(e) => updateField('hosts', e.target.value)}
                placeholder="e.g. Sophia Isabella & Liam Alexander"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Headline / Eyebrow Text</label>
              <input
                type="text"
                value={event.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="e.g. Together with their families"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Invitation Subtitle Line</label>
              <textarea
                rows={2}
                value={event.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Request the honor of your presence..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Event Date</label>
                <input
                  type="date"
                  value={event.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={event.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">RSVP Deadline</label>
                <input
                  type="date"
                  value={event.rsvpDeadline}
                  onChange={(e) => updateField('rsvpDeadline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Timezone Note</label>
                <input
                  type="text"
                  value={event.timezone}
                  onChange={(e) => updateField('timezone', e.target.value)}
                  placeholder="e.g. PST (Pacific Time)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Attire & Dress Code</label>
              <input
                type="text"
                value={event.dressCode}
                onChange={(e) => updateField('dressCode', e.target.value)}
                placeholder="e.g. Black Tie Optional, Garden Chic"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Our Story / Welcome Narrative</label>
              <textarea
                rows={3}
                value={event.storyText}
                onChange={(e) => updateField('storyText', e.target.value)}
                placeholder="Share a short welcome message or how you met..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}

        {/* ==================== THEME & STYLE TAB ==================== */}
        {activeTab === 'theme' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2 mb-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Visual Theme & Typography
              </h3>
              <p className="text-slate-400 text-[11px]">Select color palettes, fonts, and envelope accents</p>
            </div>

            {/* Template Preset Palette */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">Preset Aesthetic Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'classic-gold', name: 'Classic Gold Foil', color: '#c59b27', bg: '#fbf9f5' },
                  { id: 'romantic-botanical', name: 'Romantic Blush & Sage', color: '#b76e79', bg: '#fdfbf7' },
                  { id: 'royal-velvet', name: 'Royal Velvet & Midnight', color: '#d4af37', bg: '#0a1128' },
                  { id: 'boho-sunset', name: 'Boho Sunset Ochre', color: '#e07a5f', bg: '#fefae0' },
                  { id: 'modern-slate', name: 'Modern Slate Minimal', color: '#1c1917', bg: '#f4f4f5' },
                  { id: 'art-deco', name: 'Gatsby Art Deco', color: '#d4af37', bg: '#0c0a09' },
                  { id: 'rustic-garden', name: 'Rustic Olive Garden', color: '#2d6a4f', bg: '#f5f2eb' },
                  { id: 'neon-party', name: 'Neon Cyber Party', color: '#d946ef', bg: '#09090b' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onChange({
                        ...event,
                        templateTheme: t.id as TemplateTheme,
                        customization: {
                          ...event.customization,
                          accentColor: t.color,
                        },
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      event.templateTheme === t.id
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="font-medium text-[11px] text-slate-800 truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Font Family */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Headline Typography</label>
              <select
                value={event.customization.fontFamily}
                onChange={(e) => updateCustomization('fontFamily', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="cormorant">Cormorant Garamond (Timeless Elegance)</option>
                <option value="serif">Playfair Display (Modern Luxury)</option>
                <option value="cinzel">Cinzel (Regal Classic)</option>
                <option value="alex">Alex Brush (Flowing Script)</option>
                <option value="script">Great Vibes (Romantic Calligraphy)</option>
                <option value="montserrat">Montserrat (Refined Modern)</option>
                <option value="sans">Plus Jakarta Sans (Clean Minimal)</option>
              </select>
            </div>

            {/* Accent Color Customizer */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Accent Foil Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={event.customization.accentColor}
                    onChange={(e) => updateCustomization('accentColor', e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="font-mono text-[11px] text-slate-600">{event.customization.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Monogram Letters</label>
                <input
                  type="text"
                  maxLength={6}
                  value={event.customization.monogramText || ''}
                  onChange={(e) => updateCustomization('monogramText', e.target.value)}
                  placeholder="e.g. S & L"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 uppercase font-serif focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Envelope & Wax Seal Customization */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-900 text-xs">Virtual Envelope Experience</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Envelope Color</label>
                  <select
                    value={event.customization.envelopeColor}
                    onChange={(e) => updateCustomization('envelopeColor', e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="cream">Parchment Cream</option>
                    <option value="burgundy">Burgundy Wine</option>
                    <option value="navy">Midnight Navy</option>
                    <option value="emerald">Emerald Forest</option>
                    <option value="charcoal">Charcoal Slate</option>
                    <option value="rose">Blush Rose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Wax Seal Emblem</label>
                  <select
                    value={event.customization.envelopeWaxSeal}
                    onChange={(e) => updateCustomization('envelopeWaxSeal', e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="initials">Couple Initials</option>
                    <option value="heart">Heart</option>
                    <option value="crown">Royal Crown</option>
                    <option value="rings">Rings / Sparkle</option>
                    <option value="flower">Botanical Flower</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Visibility Switches */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Visible Sections</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  { key: 'showCountdown', label: 'Countdown Clock' },
                  { key: 'showMap', label: 'Venue Location Map' },
                  { key: 'showGallery', label: 'Photo Gallery' },
                  { key: 'showItinerary', label: 'Schedule Itinerary' },
                  { key: 'showGuestbook', label: 'Guestbook Wall' },
                  { key: 'showDressCode', label: 'Dress Code Guide' },
                  { key: 'showGiftRegistry', label: 'Gift Registry' },
                  { key: 'showAccommodations', label: 'Hotel Accommodations' },
                  { key: 'showFaq', label: 'FAQ Accordion' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={(event.customization as any)[item.key]}
                      onChange={(e) => updateCustomization(item.key as any, e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== VENUE & MAP TAB ==================== */}
        {activeTab === 'venue' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Venue Location & Interactive GPS Map
              </h3>
              <p className="text-slate-400 text-[11px]">Pinpoint your celebration site and assist guest navigation</p>
            </div>

            {/* Quick Venue Presets */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Quick Destination Presets</label>
              <div className="flex flex-wrap gap-1.5">
                {venuePresets.map((vp) => (
                  <button
                    key={vp.name}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...event,
                        venue: {
                          ...event.venue,
                          name: vp.name,
                          city: vp.city.split(',')[0],
                          latitude: vp.lat,
                          longitude: vp.lon,
                        },
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-[11px] font-medium text-slate-700 transition-all"
                  >
                    {vp.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Venue / Estate Name</label>
              <input
                type="text"
                value={event.venue.name}
                onChange={(e) => updateVenue('name', e.target.value)}
                placeholder="e.g. Villa Bella Vista Vineyard"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Street Address</label>
              <input
                type="text"
                value={event.venue.address}
                onChange={(e) => updateVenue('address', e.target.value)}
                placeholder="e.g. 1480 Meadowood Lane"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">City</label>
                <input
                  type="text"
                  value={event.venue.city}
                  onChange={(e) => updateVenue('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">State / Province</label>
                <input
                  type="text"
                  value={event.venue.state || ''}
                  onChange={(e) => updateVenue('state', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Latitude & Longitude Coordinates */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-semibold block text-slate-800 text-[11px]">
                Map Pin Coordinates (for live OpenStreetMap & GPS Deep Links)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={event.venue.latitude}
                    onChange={(e) => updateVenue('latitude', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={event.venue.longitude}
                    onChange={(e) => updateVenue('longitude', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Arrival & Direction Notes</label>
              <textarea
                rows={2}
                value={event.venue.directionsNote || ''}
                onChange={(e) => updateVenue('directionsNote', e.target.value)}
                placeholder="e.g. Follow the private cypress road past the lower vineyard..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Parking & Valet Information</label>
              <input
                type="text"
                value={event.venue.parkingInfo || ''}
                onChange={(e) => updateVenue('parkingInfo', e.target.value)}
                placeholder="e.g. Complimentary valet parking provided at main entrance."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}

        {/* ==================== MEDIA & PHOTOS TAB ==================== */}
        {activeTab === 'media' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2 mb-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Invitation Photography & Audio
              </h3>
              <p className="text-slate-400 text-[11px]">Upload custom visuals or choose curated high-res galleries</p>
            </div>

            {/* Hero Main Photo */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Hero Invitation Photo</label>
              
              {event.heroImage && (
                <div className="relative rounded-xl overflow-hidden h-36 border border-slate-200 shadow-sm">
                  <img src={event.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Upload Input */}
              <div className="flex items-center gap-2">
                <label className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 cursor-pointer flex items-center justify-center gap-2 font-medium text-xs text-slate-700 transition-all">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Picture from Computer</span>
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Or paste direct Image URL</label>
                <input
                  type="text"
                  value={event.heroImage}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Curated Presets */}
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Or pick a curated sample photo:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {curatedHeroImages.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => updateField('heroImage', img.url)}
                      className="rounded-lg overflow-hidden border border-slate-200 aspect-square hover:ring-2 hover:ring-indigo-500 transition-all"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Gallery Manager */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Photo Gallery ({event.galleryImages?.length || 0})</label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {event.galleryImages?.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 group">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add image URL field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="add-gallery-photo-input"
                  placeholder="Paste additional photo URL..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGalleryImage((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('add-gallery-photo-input') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddGalleryImage(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCHEDULE & FAQ TAB ==================== */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            
            {/* Itinerary Schedule Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    Itinerary Milestones
                  </h3>
                  <p className="text-slate-400 text-[11px]">Timeline moments of the day</p>
                </div>
                <button
                  onClick={handleAddItineraryItem}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {event.itinerary.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => handleUpdateItineraryItem(idx, 'time', e.target.value)}
                        placeholder="Time (e.g. 4:30 PM)"
                        className="w-28 px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItineraryItem(idx, 'title', e.target.value)}
                        placeholder="Milestone Title"
                        className="flex-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                      />
                      <button
                        onClick={() => handleRemoveItineraryItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItineraryItem(idx, 'description', e.target.value)}
                      placeholder="Brief 1-sentence description"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Builder */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-slate-400 text-[11px]">Helpful details for your guests</p>
                </div>
                <button
                  onClick={handleAddFAQ}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {event.faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(idx, 'question', e.target.value)}
                        placeholder="Question"
                        className="flex-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                      />
                      <button
                        onClick={() => handleRemoveFAQ(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFAQ(idx, 'answer', e.target.value)}
                      placeholder="Answer"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== AI COPILOT TAB ==================== */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-semibold text-sm">
                  Gemini AI Invitation Wording Assistant
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Generate elegant, poetic, or formal invitation phrasings customized for your celebration in seconds.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Desired Tone & Style</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Romantic & Elegant">Romantic & Elegant (Weddings & Vows)</option>
                  <option value="Formal Royal Luxury">Formal Royal Luxury (Galas & Black Tie)</option>
                  <option value="Playful & Modern">Playful & Witty (Birthdays & Soirées)</option>
                  <option value="Poetic & Emotional">Poetic & Deeply Emotional</option>
                  <option value="Chic Minimalist">Chic & Minimalist Modern</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Language</label>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="Italian">Italian (Italiano)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Special Details / Request (Optional)</label>
                <textarea
                  rows={2}
                  value={aiSpecialDetails}
                  onChange={(e) => setAiSpecialDetails(e.target.value)}
                  placeholder="e.g. Met in Tuscany, sunset dinner in Napa Valley, no gifts requested..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="button"
                id="generate-ai-wording-btn"
                onClick={handleGenerateAIWording}
                disabled={aiLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crafting bespoke invitations with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Creative Invitation Wording</span>
                  </>
                )}
              </button>

              {aiSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-xs text-center">
                  {aiSuccessMsg}
                </div>
              )}

              {/* Suggestions results stream */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-3 pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Generated Options:</span>
                  {aiSuggestions.map((sug, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-indigo-400 transition-colors">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                        {sug.headline || `Option ${idx + 1}`}
                      </span>
                      <p className="text-xs font-serif italic text-slate-800">
                        "{sug.subtitle}"
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {sug.storyText}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Dress code: {sug.dressCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => applyAISuggestion(sug)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-white" />
                          <span>Apply to Card</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
