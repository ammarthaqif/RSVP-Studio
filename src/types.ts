export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'gala' 
  | 'anniversary' 
  | 'babyshower' 
  | 'party' 
  | 'corporate' 
  | 'engagement';

export type TemplateTheme = 
  | 'classic-gold' 
  | 'romantic-botanical' 
  | 'modern-slate' 
  | 'royal-velvet' 
  | 'boho-sunset' 
  | 'art-deco' 
  | 'rustic-garden' 
  | 'neon-party';

export interface VenueLocation {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  directionsNote?: string;
  parkingInfo?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GiftRegistryItem {
  id: string;
  title: string;
  url: string;
  note?: string;
}

export interface AccommodationItem {
  id: string;
  name: string;
  address: string;
  bookingCode?: string;
  link?: string;
  notes?: string;
}

export interface EventCustomization {
  fontFamily: 'serif' | 'cormorant' | 'cinzel' | 'script' | 'alex' | 'montserrat' | 'sans';
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  cardBorder: 'gold-foil' | 'floral-frame' | 'minimal-double' | 'vintage-filigree' | 'none';
  envelopeColor: 'cream' | 'burgundy' | 'navy' | 'emerald' | 'charcoal' | 'rose';
  envelopeWaxSeal: 'initials' | 'heart' | 'rings' | 'flower' | 'crown' | 'party';
  showCountdown: boolean;
  showMap: boolean;
  showGallery: boolean;
  showItinerary: boolean;
  showGuestbook: boolean;
  showGiftRegistry: boolean;
  showDressCode: boolean;
  showFaq: boolean;
  showAccommodations: boolean;
  showMusicPlayer: boolean;
  monogramText?: string;
}

export interface EventInvitation {
  id: string;
  slug: string;
  eventType: EventType;
  templateTheme: TemplateTheme;
  title: string;
  hosts: string;
  headline: string;
  subtitle: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "16:00"
  endDate?: string;
  endTime?: string;
  timezone: string;
  rsvpDeadline: string; // YYYY-MM-DD
  venue: VenueLocation;
  heroImage: string;
  galleryImages: string[];
  musicUrl?: string;
  dressCode: string;
  storyText: string;
  welcomeMessage?: string;
  itinerary: ItineraryItem[];
  faqs: FAQItem[];
  giftRegistry: GiftRegistryItem[];
  accommodations: AccommodationItem[];
  customization: EventCustomization;
  rsvps?: RSVPResponse[];
  guestbook?: GuestbookEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface RSVPResponse {
  id: string;
  eventId: string;
  guestName: string;
  email: string;
  phone?: string;
  status: 'attending' | 'declined';
  attendingCount: number; // 1 + plus-ones
  plusOneNames: string[];
  mealPreference: string;
  dietaryNotes?: string;
  songRequest?: string;
  messageToHost?: string;
  submittedAt: string;
  checkInCode: string;
  checkedIn: boolean;
}

export interface GuestbookEntry {
  id: string;
  eventId: string;
  authorName: string;
  message: string;
  emoji: string;
  photoUrl?: string;
  createdAt: string;
}

export type ViewMode = 'editor' | 'guest-view' | 'rsvp-tracker' | 'share-hub' | 'templates';
