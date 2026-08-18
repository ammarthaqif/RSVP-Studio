import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, Download, 
  Plus, MessageSquare, Music, Utensils, QrCode, 
  Send, Phone, Mail, Check, RefreshCw, Trash2, Filter
} from 'lucide-react';
import { EventInvitation, RSVPResponse } from '../types';
import { exportRSVPsToCSV } from '../utils/helpers';

interface RSVPTrackerProps {
  event: EventInvitation;
  rsvps: RSVPResponse[];
  onCheckInToggle: (rsvpId: string, currentCheckedIn: boolean) => void;
  onDeleteRSVP: (rsvpId: string) => void;
  onAddManualRSVP: (rsvpData: Partial<RSVPResponse>) => void;
}

export const RSVPTracker: React.FC<RSVPTrackerProps> = ({
  event,
  rsvps,
  onCheckInToggle,
  onDeleteRSVP,
  onAddManualRSVP,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'checked-in'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkInInputCode, setCheckInInputCode] = useState('');
  const [checkInFeedback, setCheckInFeedback] = useState<{ msg: string; success: boolean } | null>(null);

  // Form states for manual RSVP
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualStatus, setManualStatus] = useState<'attending' | 'declined'>('attending');
  const [manualCount, setManualCount] = useState(1);
  const [manualMeal, setManualMeal] = useState('Prime Filet Mignon');
  const [manualDiet, setManualDiet] = useState('');

  // Statistics calculation
  const totalRsvps = rsvps.length;
  const attendingList = rsvps.filter(r => r.status === 'attending');
  const declinedList = rsvps.filter(r => r.status === 'declined');
  const totalAttendingHeadcount = attendingList.reduce((acc, r) => acc + (r.attendingCount || 1), 0);
  const checkedInCount = attendingList.filter(r => r.checkedIn).length;

  // Meal breakdown
  const mealCounts: Record<string, number> = {};
  attendingList.forEach(r => {
    if (r.mealPreference) {
      mealCounts[r.mealPreference] = (mealCounts[r.mealPreference] || 0) + (r.attendingCount || 1);
    }
  });

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter(r => {
    const matchesSearch = 
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.checkInCode && r.checkInCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.plusOneNames && r.plusOneNames.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (statusFilter === 'attending') return r.status === 'attending';
    if (statusFilter === 'declined') return r.status === 'declined';
    if (statusFilter === 'checked-in') return r.status === 'attending' && r.checkedIn;
    return true;
  });

  const handleFastCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInInputCode.trim()) return;

    const targetCode = checkInInputCode.trim().toUpperCase();
    const match = rsvps.find(r => r.checkInCode.toUpperCase() === targetCode || r.guestName.toLowerCase().includes(checkInInputCode.toLowerCase()));

    if (match) {
      if (match.checkedIn) {
        setCheckInFeedback({ msg: `${match.guestName} is ALREADY checked in!`, success: true });
      } else {
        onCheckInToggle(match.id, false);
        setCheckInFeedback({ msg: `✅ Successfully checked in ${match.guestName} (${match.attendingCount} guest${match.attendingCount > 1 ? 's' : ''})!`, success: true });
      }
      setCheckInInputCode('');
    } else {
      setCheckInFeedback({ msg: `No RSVP found matching code "${checkInInputCode}"`, success: false });
    }

    setTimeout(() => setCheckInFeedback(null), 4000);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualEmail.trim()) return;

    onAddManualRSVP({
      guestName: manualName.trim(),
      email: manualEmail.trim(),
      phone: manualPhone.trim(),
      status: manualStatus,
      attendingCount: manualStatus === 'attending' ? manualCount : 0,
      mealPreference: manualMeal,
      dietaryNotes: manualDiet,
    });

    setShowAddModal(false);
    setManualName('');
    setManualEmail('');
    setManualPhone('');
  };

  const createWhatsAppReminderUrl = (rsvp: RSVPResponse) => {
    const text = encodeURIComponent(
      `Hello ${rsvp.guestName}! We are counting down the days to ${event.title} on ${event.date} at ${event.venue.name}. Your check-in pass code is: ${rsvp.checkInCode}. Let us know if you have any questions!`
    );
    const cleanPhone = (rsvp.phone || '').replace(/[^0-9]/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">
              Automated Tracker
            </span>
            <span className="text-xs text-slate-500">• {event.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Guest List & RSVP Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Real-time headcount tracking, meal preference analytics, and door check-in manager.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="add-guest-manual-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Guest</span>
          </button>

          <button
            id="export-csv-btn"
            onClick={() => exportRSVPsToCSV(rsvps, event.title)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export CSV Sheet</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block">Total Responses</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 block tracking-tight">
            {totalRsvps}
          </span>
          <span className="text-[11px] text-slate-400">RSVP forms submitted</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-emerald-600 uppercase tracking-wider font-bold block">Confirmed Attending</span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 block tracking-tight">
            {attendingList.length}
          </span>
          <span className="text-[11px] text-emerald-600/80 font-medium">{totalAttendingHeadcount} total seats reserved</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-rose-600 uppercase tracking-wider font-bold block">Declined</span>
          <span className="text-2xl sm:text-3xl font-bold text-rose-700 mt-1 block tracking-tight">
            {declinedList.length}
          </span>
          <span className="text-[11px] text-rose-500">Sending warm regards</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-indigo-600 uppercase tracking-wider font-bold block">Door Check-In</span>
          <span className="text-2xl sm:text-3xl font-bold text-indigo-700 mt-1 block tracking-tight">
            {checkedInCount} / {attendingList.length}
          </span>
          <span className="text-[11px] text-indigo-600/80 font-medium">
            {attendingList.length > 0 ? `${Math.round((checkedInCount / attendingList.length) * 100)}% checked in` : '0%'}
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-indigo-300 uppercase tracking-wider font-bold block">RSVP Deadline</span>
            <span className="text-lg font-bold mt-1 block tracking-tight">
              {event.rsvpDeadline}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Automated tracking active</span>
        </div>
      </div>

      {/* Fast Check-In Code Scanner / Quick Lookup */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
              Fast Door Check-In & Code Validator
            </h3>
            <p className="text-xs text-slate-500">
              Type or scan a guest's 6-character code (e.g. "SL-8921") or name to verify check-in instantly.
            </p>
          </div>

          <form onSubmit={handleFastCheckIn} className="flex gap-2 max-w-md w-full">
            <input
              type="text"
              id="fast-checkin-input"
              placeholder="Enter Check-In Code or Name..."
              value={checkInInputCode}
              onChange={(e) => setCheckInInputCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase font-mono"
            />
            <button
              type="submit"
              id="verify-checkin-btn"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>
        </div>

        {checkInFeedback && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold ${checkInFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
            {checkInFeedback.msg}
          </div>
        )}
      </div>

      {/* Meal & Dietary Breakdown Panel */}
      {Object.keys(mealCounts).length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-indigo-600" />
            Catering & Meal Breakdown for Venue Staff
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div key={meal} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
                <span className="font-medium text-slate-800">{meal}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guest List Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-guests-input"
              placeholder="Search by name, email, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              All ({rsvps.length})
            </button>
            <button
              onClick={() => setStatusFilter('attending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'attending' ? 'bg-emerald-600 text-white font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Attending ({attendingList.length})
            </button>
            <button
              onClick={() => setStatusFilter('declined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'declined' ? 'bg-rose-600 text-white font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Declined ({declinedList.length})
            </button>
            <button
              onClick={() => setStatusFilter('checked-in')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'checked-in' ? 'bg-indigo-600 text-white font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Checked In ({checkedInCount})
            </button>
          </div>
        </div>

        {/* Guest List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Headcount</th>
                  <th className="py-3.5 px-4">Meal & Dietary</th>
                  <th className="py-3.5 px-4">Pass Code</th>
                  <th className="py-3.5 px-4 text-center">Door Check-In</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      No RSVP responses found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div>
                          <span>{rsvp.guestName}</span>
                          {rsvp.messageToHost && (
                            <span className="block text-[11px] font-normal text-slate-500 italic truncate max-w-xs mt-0.5" title={rsvp.messageToHost}>
                              "{rsvp.messageToHost}"
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{rsvp.email}</div>
                        {rsvp.phone && <div className="text-[11px] text-slate-400">{rsvp.phone}</div>}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {rsvp.status === 'attending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Attending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px] border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Declined
                          </span>
                        )}
                      </td>

                      {/* Headcount */}
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {rsvp.status === 'attending' ? (
                          <div>
                            <span className="font-bold">{rsvp.attendingCount}</span>
                            {rsvp.plusOneNames && rsvp.plusOneNames.length > 0 && (
                              <span className="block text-[10px] text-slate-400 truncate max-w-[140px]" title={rsvp.plusOneNames.join(', ')}>
                                + {rsvp.plusOneNames.join(', ')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Meal & Dietary */}
                      <td className="py-3.5 px-4 text-slate-700">
                        {rsvp.status === 'attending' ? (
                          <div>
                            <span className="font-medium truncate block max-w-[160px]">{rsvp.mealPreference || 'Standard'}</span>
                            {rsvp.dietaryNotes && (
                              <span className="text-[10px] text-rose-600 font-semibold block">
                                Note: {rsvp.dietaryNotes}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Check-In Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {rsvp.checkInCode}
                      </td>

                      {/* Check In Toggle Button */}
                      <td className="py-3.5 px-4 text-center">
                        {rsvp.status === 'attending' ? (
                          <button
                            onClick={() => onCheckInToggle(rsvp.id, rsvp.checkedIn)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                              rsvp.checkedIn
                                ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <Check className={`w-3.5 h-3.5 ${rsvp.checkedIn ? 'text-white' : 'text-slate-400'}`} />
                            <span>{rsvp.checkedIn ? 'Checked In' : 'Check In'}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Reminder */}
                          <a
                            href={createWhatsAppReminderUrl(rsvp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Send WhatsApp update/reminder"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteRSVP(rsvp.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete RSVP"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Guest Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Add Guest RSVP Manually
            </h3>
            <form onSubmit={handleManualAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Benjamin Hayes"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ben@example.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Status</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Total Headcount</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={manualCount}
                    onChange={(e) => setManualCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Meal Selection</label>
                <input
                  type="text"
                  placeholder="e.g. Prime Filet Mignon"
                  value={manualMeal}
                  onChange={(e) => setManualMeal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
