import React, { useState } from 'react';
import { 
  FileDown, Share2, MessageCircle, Mail, QrCode, 
  Copy, Check, Printer, Sparkles, Send, Globe, 
  ExternalLink, Download, Image as ImageIcon, Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EventInvitation } from '../types';
import { exportInvitationToPDF, exportInvitationToImage } from '../utils/helpers';

interface ShareAndExportHubProps {
  event: EventInvitation;
  onPreviewOpen: () => void;
}

export const ShareAndExportHub: React.FC<ShareAndExportHubProps> = ({ event, onPreviewOpen }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);
  const [guestNameParam, setGuestNameParam] = useState('');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [qrColor, setQrColor] = useState('#1c1917');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');

  // Base public link calculation
  const publicShareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?event=${event.slug || event.id}`
    : `https://celebrationstudio.app/?event=${event.slug || event.id}`;

  const personalizedUrl = guestNameParam.trim()
    ? `${publicShareUrl}&guest=${encodeURIComponent(guestNameParam.trim())}`
    : publicShareUrl;

  const copyShareLink = () => {
    navigator.clipboard.writeText(personalizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // WhatsApp Pre-filled message generator
  const getWhatsAppShareUrl = () => {
    const message = `✨ You are cordially invited to *${event.title}*!\n\n` +
      `📅 Date: ${event.date} at ${event.time}\n` +
      `📍 Venue: ${event.venue.name}, ${event.venue.city}\n` +
      `👗 Dress Code: ${event.dressCode}\n` +
      `💌 Please view our digital invitation card & RSVP online here:\n${personalizedUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

  // Email Mailto link generator
  const getEmailShareUrl = () => {
    const subject = encodeURIComponent(`Invitation: ${event.title}`);
    const body = encodeURIComponent(
      `Dear Friend,\n\nWe are delighted to invite you to ${event.title}.\n\n` +
      `Event Details:\n` +
      `Date & Time: ${event.date} at ${event.time}\n` +
      `Venue: ${event.venue.name} (${event.venue.address}, ${event.venue.city})\n` +
      `Dress Code: ${event.dressCode}\n` +
      `RSVP Deadline: ${event.rsvpDeadline}\n\n` +
      `Please view the digital invitation card and submit your RSVP here:\n${personalizedUrl}\n\n` +
      `With warm regards,\n${event.hosts}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  // SMS share link
  const getSmsShareUrl = () => {
    const text = encodeURIComponent(`You're invited to ${event.title}! View details & RSVP: ${personalizedUrl}`);
    return `sms:?&body=${text}`;
  };

  // Social Share links
  const getFacebookShareUrl = () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(personalizedUrl)}`;
  const getTwitterShareUrl = () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`You are invited to ${event.title}!`)}&url=${encodeURIComponent(personalizedUrl)}`;
  const getPinterestShareUrl = () => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(personalizedUrl)}&media=${encodeURIComponent(event.heroImage)}&description=${encodeURIComponent(event.title)}`;
  const getLinkedInShareUrl = () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(personalizedUrl)}`;

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    await exportInvitationToPDF('printable-invitation-card', `${event.slug || 'invitation'}.pdf`);
    setIsExportingPDF(false);
  };

  const handleExportImage = async () => {
    setIsExportingImage(true);
    await exportInvitationToImage('printable-invitation-card', `${event.slug || 'invitation-card'}.png`);
    setIsExportingImage(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">
            Export & Direct Sharing Hub
          </span>
          <span className="text-xs text-slate-500">• {event.title}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Share Your Digital Invitation Card
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Distribute via WhatsApp, Email, or Social Media, or download high-resolution printable PDFs & QR codes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Sharing & Personalized Link Generator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Direct Share Link Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              Public Invitation Link
            </h2>
            <p className="text-xs text-slate-500">
              Share this link directly with your guests. When opened, they will experience the animated envelope, live itinerary, interactive map, and automated RSVP form.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                id="public-share-link-input"
                value={personalizedUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 truncate select-all focus:outline-none focus:border-indigo-500"
              />
              <button
                id="copy-invite-link-btn"
                onClick={copyShareLink}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Personalized Guest Link Customizer */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Optional: Generate Personalized VIP Link for a Specific Guest
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={guestNameParam}
                  onChange={(e) => setGuestNameParam(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                {guestNameParam && (
                  <button
                    onClick={() => setGuestNameParam('')}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 1-Click Instant Messaging & Social Channels */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Instant Direct Messaging & Social Sharing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Direct */}
              <a
                id="share-whatsapp-btn"
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-2xs transition-transform active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5" />
                  <div>
                    <span className="block font-bold">Share via WhatsApp</span>
                    <span className="text-[10px] text-emerald-100 font-normal">Pre-filled formatted invitation</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Email Client */}
              <a
                id="share-email-btn"
                href={getEmailShareUrl()}
                className="p-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-2xs transition-transform active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-indigo-300" />
                  <div>
                    <span className="block font-bold">Send via Email</span>
                    <span className="text-[10px] text-slate-300 font-normal">Opens default mail composer</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>

              {/* SMS Direct (Mobile) */}
              <a
                id="share-sms-btn"
                href={getSmsShareUrl()}
                className="p-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-2xs transition-transform active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5" />
                  <div>
                    <span className="block font-bold">Send via SMS</span>
                    <span className="text-[10px] text-sky-100 font-normal">Quick text message link</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Facebook Share */}
              <a
                id="share-facebook-btn"
                href={getFacebookShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition-transform active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5" />
                  <div>
                    <span className="block font-bold">Share to Facebook</span>
                    <span className="text-[10px] text-blue-100 font-normal">Post to event feed</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>
            </div>

            {/* Secondary Social Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <a
                href={getTwitterShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <span>X / Twitter</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a
                href={getPinterestShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <span>Pinterest Pin</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a
                href={getLinkedInShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
          </div>

          {/* High-Resolution Printable & Document Exports */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-300 font-bold block mb-1">
                Print & Archival
              </span>
              <h2 className="text-lg font-bold tracking-tight">
                Download High-Resolution Files
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generate high-definition PDFs for physical printing, framing, or sending as email attachments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                id="export-pdf-download-btn"
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-transform active:scale-95 disabled:opacity-50 flex flex-col items-center justify-center text-center gap-1.5"
              >
                <FileDown className="w-5 h-5 text-white" />
                <span>{isExportingPDF ? 'Rendering PDF...' : 'Download PDF Card'}</span>
              </button>

              <button
                id="export-png-download-btn"
                onClick={handleExportImage}
                disabled={isExportingImage}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-transform active:scale-95 disabled:opacity-50 flex flex-col items-center justify-center text-center gap-1.5"
              >
                <ImageIcon className="w-5 h-5 text-indigo-300" />
                <span>{isExportingImage ? 'Generating PNG...' : 'Download PNG Image'}</span>
              </button>

              <button
                id="print-card-btn"
                onClick={handlePrint}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-transform active:scale-95 flex flex-col items-center justify-center text-center gap-1.5"
              >
                <Printer className="w-5 h-5 text-slate-300" />
                <span>Print Direct</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Stationery QR Code Generator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6 text-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 border border-indigo-100">
                <QrCode className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Physical Stationery QR Code
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Print this high-resolution QR code on your paper invitations, save-the-dates, or welcome signage so guests can scan with their phone camera to access the digital card & RSVP instantly.
              </p>
            </div>

            {/* Rendered Live QR Code Frame */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 inline-block shadow-inner">
              <div className="p-4 bg-white rounded-xl shadow-2xs border border-slate-200">
                <QRCodeSVG
                  value={personalizedUrl}
                  size={180}
                  level="H"
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                  includeMargin={true}
                />
              </div>
              <span className="block text-[11px] font-mono font-semibold text-slate-600 mt-3">
                Scan to RSVP for {event.hosts}
              </span>
            </div>

            {/* Custom QR Code Styling Controls */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  QR Pattern Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{qrColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{qrBgColor}</span>
                </div>
              </div>
            </div>

            {/* Test Guest Experience Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                id="test-guest-view-btn"
                onClick={onPreviewOpen}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Simulate Guest Opening Experience</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
