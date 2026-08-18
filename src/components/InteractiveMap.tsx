import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Car, Info } from 'lucide-react';
import { VenueLocation } from '../types';
import { getGoogleMapsDirectionsUrl, getAppleMapsUrl, getWazeUrl } from '../utils/helpers';

interface InteractiveMapProps {
  venue: VenueLocation;
  accentColor?: string;
  theme?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ venue, accentColor = '#c59b27' }) => {
  const [copied, setCopied] = useState(false);

  const fullAddress = `${venue.name}, ${venue.address}, ${venue.city}, ${venue.state ? `${venue.state}, ` : ''}${venue.country}`;

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // OpenStreetMap embed coordinates bounding box calculation
  const lat = venue.latitude || 38.5134;
  const lon = venue.longitude || -122.4682;
  const bboxDelta = 0.008;
  const bbox = `${lon - bboxDelta},${lat - bboxDelta},${lon + bboxDelta},${lat + bboxDelta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div id="venue-map-section" className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="p-1.5 rounded-lg text-white text-xs font-semibold"
              style={{ backgroundColor: accentColor }}
            >
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {venue.name}
            </h3>
          </div>
          <p className="text-slate-500 text-sm">
            {venue.address}, {venue.city}, {venue.state ? `${venue.state} ` : ''}{venue.country}
          </p>
        </div>

        <button
          id="copy-address-btn"
          onClick={copyAddressToClipboard}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors w-fit"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Address Copied' : 'Copy Address'}</span>
        </button>
      </div>

      {/* Interactive Map Embed Container */}
      <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
        <iframe
          title={`Map of ${venue.name}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={osmEmbedUrl}
          className="w-full h-full filter saturate-95 contrast-105"
        />

        {/* Floating Venue Pin Badge Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800 pointer-events-none">
          <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          <span>{venue.name}</span>
        </div>
      </div>

      {/* Directions & Navigation Buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <a
          id="open-google-maps-btn"
          href={getGoogleMapsDirectionsUrl(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-transform active:scale-[0.98]"
        >
          <Navigation className="w-3.5 h-3.5 text-indigo-300" />
          <span>Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
        </a>

        <a
          id="open-apple-maps-btn"
          href={getAppleMapsUrl(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Apple Maps</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
        </a>

        <a
          id="open-waze-btn"
          href={getWazeUrl(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-xs font-semibold border border-indigo-200 transition-colors"
        >
          <Car className="w-3.5 h-3.5 text-indigo-600" />
          <span>Waze Navigation</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
        </a>
      </div>

      {/* Additional Venue Notes & Parking */}
      {(venue.directionsNote || venue.parkingInfo) && (
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          {venue.directionsNote && (
            <div className="flex items-start gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-medium">Arrival Instructions:</strong>
                <span>{venue.directionsNote}</span>
              </div>
            </div>
          )}
          {venue.parkingInfo && (
            <div className="flex items-start gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
              <Car className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-medium">Parking & Valet:</strong>
                <span>{venue.parkingInfo}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
