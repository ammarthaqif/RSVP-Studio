import React, { useState } from 'react';
import { X, Heart, Check, Music, Utensils, Users, Mail, Phone, Sparkles, QrCode, Download, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { EventInvitation, RSVPResponse } from '../types';
import { formatDate, formatTime } from '../utils/helpers';

interface RSVPModalProps {
  event: EventInvitation;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (rsvp: RSVPResponse) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ event, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendingCount, setAttendingCount] = useState<number>(1);
  const [plusOneNames, setPlusOneNames] = useState<string[]>([]);
  const [mealPreference, setMealPreference] = useState('Prime Filet Mignon');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [messageToHost, setMessageToHost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedRsvp, setCompletedRsvp] = useState<RSVPResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAttendingCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(6, count));
    setAttendingCount(validCount);
    
    // Adjust plus one names array
    const needed = validCount - 1;
    setPlusOneNames(prev => {
      const updated = [...prev];
      if (updated.length < needed) {
        while (updated.length < needed) {
          updated.push('');
        }
      } else if (updated.length > needed) {
        return updated.slice(0, needed);
      }
      return updated;
    });
  };

  const handlePlusOneNameChange = (index: number, val: string) => {
    setPlusOneNames(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c59b27', '#e07a5f', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !email.trim()) {
      setErrorMessage('Please provide your name and email.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          status,
          attendingCount: status === 'attending' ? attendingCount : 0,
          plusOneNames: status === 'attending' ? plusOneNames.filter(n => n.trim().length > 0) : [],
          mealPreference: status === 'attending' ? mealPreference : '',
          dietaryNotes: status === 'attending' ? dietaryNotes.trim() : '',
          songRequest: status === 'attending' ? songRequest.trim() : '',
          messageToHost: messageToHost.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP. Please try again.');
      }

      const newRsvp: RSVPResponse = await response.json();
      setCompletedRsvp(newRsvp);
      if (status === 'attending') {
        triggerConfetti();
      }
      if (onSuccess) {
        onSuccess(newRsvp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong submitting your RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealOptions = [
    'Prime Filet Mignon (Gluten-Free)',
    'Pan-Seared Chilean Sea Bass',
    'Truffle Wild Mushroom Risotto (Vegetarian/Vegan)',
    'Organic Roasted Herb Chicken',
    'Children’s Meal (Pasta & Fruit)',
    'Special Dietary Option'
  ];  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div 
        id="rsvp-modal-card"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div 
          className="p-6 text-white text-center relative"
          style={{ 
            background: event.customization.accentColor 
              ? `linear-gradient(135deg, ${event.customization.accentColor} 0%, #0f172a 100%)`
              : 'linear-gradient(135deg, #4f46e5 0%, #0f172a 100%)'
          }}
        >
          <button
            id="close-rsvp-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] uppercase tracking-widest text-indigo-200 font-bold block mb-1">
            {event.eventType.toUpperCase()} RSVP
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            {event.title}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Please respond by <span className="font-semibold text-white">{formatDate(event.rsvpDeadline)}</span>
          </p>
        </div>

        {/* Confirmation Pass View (After Successful Submission) */}
        {completedRsvp ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {completedRsvp.status === 'attending' ? 'You’re on the Guest List!' : 'Thank You for Letting Us Know'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                {completedRsvp.status === 'attending'
                  ? `We have confirmed attendance for ${completedRsvp.guestName} (${completedRsvp.attendingCount} guest${completedRsvp.attendingCount > 1 ? 's' : ''}). A confirmation copy has been registered.`
                  : `We’ll miss celebrating with you, ${completedRsvp.guestName}! Thank you for your warm wishes.`}
              </p>
            </div>

            {completedRsvp.status === 'attending' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">VIP Guest Pass</span>
                    <span className="font-bold text-slate-900 text-base">{completedRsvp.guestName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Check-in Code</span>
                    <span className="font-mono font-bold text-sm bg-slate-900 text-indigo-300 px-2.5 py-0.5 rounded-md">
                      {completedRsvp.checkInCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="font-medium text-slate-800">{formatDate(event.date)} at {formatTime(event.time)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Venue</span>
                    <span className="font-medium text-slate-800">{event.venue.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Headcount</span>
                    <span className="font-medium text-slate-800">{completedRsvp.attendingCount} Guest(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Meal Selection</span>
                    <span className="font-medium text-slate-800 truncate">{completedRsvp.mealPreference || 'Standard'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-2 border-t border-slate-200">
                  <div className="text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 inline-block shadow-2xs">
                      <QRCodeSVG 
                        value={`EVENT:${event.id};RSVP:${completedRsvp.id};CODE:${completedRsvp.checkInCode};NAME:${completedRsvp.guestName}`} 
                        size={110} 
                        level="M" 
                      />
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">Show this QR code at the door for fast check-in</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                id="done-rsvp-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                Back to Invitation
              </button>
            </div>
          </div>
        ) : (
          /* RSVP Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Attending / Declining Switcher */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="rsvp-status-attending"
                  onClick={() => setStatus('attending')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
                    status === 'attending'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${status === 'attending' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  id="rsvp-status-declining"
                  onClick={() => setStatus('declined')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
                    status === 'declined'
                      ? 'border-slate-800 bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${status === 'declined' ? 'text-slate-800' : 'text-slate-400'}`} />
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Guest Primary Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="guest-name-input"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="guest-email-input"
                  required
                  placeholder="eleanor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Phone Number (Optional for updates)
                </label>
                <input
                  type="tel"
                  id="guest-phone-input"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Attending-Specific Details */}
            {status === 'attending' && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                {/* Plus-ones & Party Size */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Total Attending Guests (Including You)
                    </label>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {attendingCount} {attendingCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => handleAttendingCountChange(num)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          attendingCount === num
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Guest Names */}
                {attendingCount > 1 && (
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Additional Guest Names:
                    </span>
                    {plusOneNames.map((name, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Guest ${idx + 2} Full Name`}
                        value={name}
                        onChange={(e) => handlePlusOneNameChange(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    ))}
                  </div>
                )}

                {/* Meal Preference */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-slate-400" />
                    Meal Selection
                  </label>
                  <select
                    id="guest-meal-select"
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {mealOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Dietary Restrictions & Allergies
                  </label>
                  <input
                    type="text"
                    id="guest-dietary-input"
                    placeholder="e.g. Nut allergy, Gluten-Free, Vegan, Dairy-Free"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Song Request */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-slate-400" />
                    Song Request for the DJ
                  </label>
                  <input
                    type="text"
                    id="guest-song-input"
                    placeholder="e.g. September - Earth, Wind & Fire"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            )}

            {/* Message / Heartfelt Note to Host */}
            <div className="pt-2 border-t border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Message / Well Wishes to the Hosts (Optional)
              </label>
              <textarea
                rows={3}
                id="guest-message-input"
                placeholder="Share your excitement, warm blessings, or advice..."
                value={messageToHost}
                onChange={(e) => setMessageToHost(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="submit-rsvp-btn"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting RSVP...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Confirm RSVP Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
