import { EventInvitation } from '../types';

export const PRESET_TEMPLATES: EventInvitation[] = [
  {
    id: 'wedding-sophia-liam',
    slug: 'sophia-and-liam-wedding',
    eventType: 'wedding',
    templateTheme: 'classic-gold',
    title: 'The Wedding Celebration of Sophia & Liam',
    hosts: 'Sophia Isabella & Liam Alexander',
    headline: 'Together with their families',
    subtitle: 'Request the honor of your presence as they exchange vows & celebrate love',
    date: '2026-09-19',
    time: '16:30',
    endDate: '2026-09-19',
    endTime: '23:30',
    timezone: 'PST (Pacific Standard Time)',
    rsvpDeadline: '2026-08-25',
    venue: {
      name: 'Villa Bella Vista Vineyard & Estate',
      address: '1480 Meadowood Lane',
      city: 'St. Helena',
      state: 'CA',
      country: 'United States',
      postalCode: '94574',
      latitude: 38.5134,
      longitude: -122.4682,
      directionsNote: 'Follow the private cypress road past the lower vineyard. Complimentary valet parking is provided at the main portico.',
      parkingInfo: 'Valet parking available at estate entrance. Shuttle departs every 30 mins from Napa Valley Lodge.'
    },
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
    ],
    dressCode: 'Black Tie Optional (Floor-length gowns, tuxedos or dark formal suits)',
    storyText: 'From a chance encounter in a cozy San Francisco bookshop to mountain hikes around Lake Tahoe and sunsets in Tuscany, our journey together has been filled with laughter, adventure, and boundless love. We cannot wait to celebrate the beginning of our next chapter surrounded by the people who mean the world to us.',
    welcomeMessage: 'We are thrilled to celebrate our special day with our closest family and cherished friends.',
    itinerary: [
      {
        id: 'itin-1',
        time: '4:00 PM',
        title: 'Guest Arrival & Welcome Champagne',
        description: 'Mingle in the Olive Grove with sparkling wine and artisan hors d’oeuvres.',
        icon: 'GlassWater'
      },
      {
        id: 'itin-2',
        time: '4:30 PM',
        title: 'Wedding Ceremony',
        description: 'Vows exchanged in the Vineyard Amphitheater overlooking Napa Valley.',
        icon: 'Heart'
      },
      {
        id: 'itin-3',
        time: '5:30 PM',
        title: 'Cocktail Hour & Sunset Photos',
        description: 'Signature craft cocktails, jazz quartet, and vineyard garden strolls.',
        icon: 'Sparkles'
      },
      {
        id: 'itin-4',
        time: '7:00 PM',
        title: 'Gourmet Dinner & Speeches',
        description: 'Four-course farm-to-table dinner paired with estate reserve wines.',
        icon: 'Utensils'
      },
      {
        id: 'itin-5',
        time: '9:00 PM',
        title: 'Dancing & Late Night Bites',
        description: 'Live 8-piece band, espresso martini bar, and warm churros under the stars.',
        icon: 'Music'
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question: 'Are children invited?',
        answer: 'While we love your little ones, our wedding ceremony and reception will be an adults-only celebration.'
      },
      {
        id: 'faq-2',
        question: 'Is there transportation provided?',
        answer: 'Yes! Complimentary round-trip shuttles will run between Napa Valley Lodge, Harvest Inn, and the venue from 3:15 PM until 12:30 AM.'
      },
      {
        id: 'faq-3',
        question: 'Can I bring a plus one?',
        answer: 'Please refer to your digital RSVP form. If a plus-one is included, you will see the option to add their name.'
      }
    ],
    giftRegistry: [
      {
        id: 'reg-1',
        title: 'Honeymoon in Amalfi & Positano Fund',
        url: 'https://registry.example.com/sophia-liam-amalfi',
        note: 'Help us create unforgettable memories in Italy!'
      },
      {
        id: 'reg-2',
        title: 'Crate & Barrel Home Registry',
        url: 'https://crateandbarrel.com/registry/sophia-liam',
        note: 'Kitchen and dining essentials for our new home.'
      }
    ],
    accommodations: [
      {
        id: 'acc-1',
        name: 'Napa Valley Lodge',
        address: '2230 Madison St, Yountville, CA 94599',
        bookingCode: 'SOPHIALIAM26',
        link: 'https://napavalleylodge.com',
        notes: 'Room block held until August 1st. Shuttle pickup location.'
      },
      {
        id: 'acc-2',
        name: 'Harvest Inn Napa',
        address: '1 Main St, St Helena, CA 94574',
        bookingCode: 'SLWEDDING',
        link: 'https://harvestinn.com',
        notes: '5 minutes from venue with vineyard views.'
      }
    ],
    customization: {
      fontFamily: 'cormorant',
      accentColor: '#c59b27',
      backgroundColor: '#fbf9f5',
      cardColor: '#ffffff',
      textColor: '#292524',
      cardBorder: 'gold-foil',
      envelopeColor: 'cream',
      envelopeWaxSeal: 'initials',
      showCountdown: true,
      showMap: true,
      showGallery: true,
      showItinerary: true,
      showGuestbook: true,
      showGiftRegistry: true,
      showDressCode: true,
      showFaq: true,
      showAccommodations: true,
      showMusicPlayer: true,
      monogramText: 'S & L'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gala-aurora-luminary',
    slug: 'aurora-luminary-gala-2026',
    eventType: 'gala',
    templateTheme: 'royal-velvet',
    title: 'The 12th Annual Luminary Charity Gala',
    hosts: 'The Aurora Foundation for Ocean Preservation',
    headline: 'An Evening of Elegance, Philanthropy & Wonder',
    subtitle: 'Under the High Patronage of Global Conservation Leaders',
    date: '2026-10-24',
    time: '18:30',
    endDate: '2026-10-24',
    endTime: '23:30',
    timezone: 'EST (Eastern Standard Time)',
    rsvpDeadline: '2026-10-01',
    venue: {
      name: 'The Metropolitan Grand Rotunda',
      address: '1000 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10028',
      latitude: 40.7794,
      longitude: -73.9632,
      directionsNote: 'Grand Entrance on 82nd Street. Private security check-in at the VIP West Porte-Cochère.',
      parkingInfo: 'Complimentary private chauffeur valet provided at the 82nd Street rotunda.'
    },
    heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80'
    ],
    dressCode: 'White Tie / Royal Midnight Blue & Gold Formal',
    storyText: 'Join 400 global luminaries, scientists, and philanthropists for a transformative evening dedicated to safeguarding marine ecosystems. Together, our goal is to fund three major coral reef restoration sanctuaries across the Pacific.',
    welcomeMessage: 'Your attendance fuels vital ocean conservation projects around the globe.',
    itinerary: [
      {
        id: 'itin-g1',
        time: '6:30 PM',
        title: 'Red Carpet & Champagne Reception',
        description: 'Curated photography, silent auction preview, and live harpist performance.',
        icon: 'Sparkles'
      },
      {
        id: 'itin-g2',
        time: '7:30 PM',
        title: 'Keynote & Philanthropy Address',
        description: 'Opening remarks by renowned oceanographers and foundation directors.',
        icon: 'Mic'
      },
      {
        id: 'itin-g3',
        time: '8:15 PM',
        title: 'Grand Banquet Dinner & Live Auction',
        description: 'Curated 5-star sustainable seafood and vegan gourmet tasting menu.',
        icon: 'Utensils'
      },
      {
        id: 'itin-g4',
        time: '10:00 PM',
        title: 'Symphonic Live Concert & Celebration',
        description: 'Orchestral performance followed by dessert soiree and dancing.',
        icon: 'Music'
      }
    ],
    faqs: [
      {
        id: 'faq-g1',
        question: 'Are table sponsorships tax-deductible?',
        answer: 'Yes, 85% of all ticket purchases and table sponsorships qualify for federal 501(c)(3) tax deductions.'
      },
      {
        id: 'faq-g2',
        question: 'What is the dress code protocol?',
        answer: 'White Tie or Black Tie with midnight blue and gilded gold accents encouraged.'
      }
    ],
    giftRegistry: [],
    accommodations: [
      {
        id: 'acc-g1',
        name: 'The Carlyle, A Rosewood Hotel',
        address: '35 E 76th St, New York, NY 10021',
        bookingCode: 'AURORAGALA26',
        link: 'https://rosewoodhotels.com',
        notes: 'VIP partner hotel 6 blocks from the venue.'
      }
    ],
    customization: {
      fontFamily: 'cinzel',
      accentColor: '#d4af37',
      backgroundColor: '#0a1128',
      cardColor: '#121b36',
      textColor: '#f8fafc',
      cardBorder: 'gold-foil',
      envelopeColor: 'navy',
      envelopeWaxSeal: 'crown',
      showCountdown: true,
      showMap: true,
      showGallery: true,
      showItinerary: true,
      showGuestbook: true,
      showGiftRegistry: false,
      showDressCode: true,
      showFaq: true,
      showAccommodations: true,
      showMusicPlayer: false,
      monogramText: 'AF'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bday-maya-boho-30',
    slug: 'maya-golden-30th-birthday',
    eventType: 'birthday',
    templateTheme: 'boho-sunset',
    title: "Maya's Golden 30th Birthday Sunset Soirée",
    hosts: 'Maya Lin',
    headline: 'Chapter 30: Blooming & Thriving',
    subtitle: 'Join us for golden hour cocktails, rooftop beats & delicious memories',
    date: '2026-07-11',
    time: '17:00',
    endDate: '2026-07-11',
    endTime: '23:00',
    timezone: 'PST (Pacific Standard Time)',
    rsvpDeadline: '2026-06-25',
    venue: {
      name: 'The Terracotta Palm Rooftop',
      address: '742 South Hill Street',
      city: 'Los Angeles',
      state: 'CA',
      country: 'United States',
      postalCode: '90014',
      latitude: 34.0453,
      longitude: -118.2547,
      directionsNote: 'Take the golden elevator to the 14th floor rooftop. Look for the pampas grass archway.',
      parkingInfo: 'Valet parking at building garage ($15) or nearby public lots on 8th Street.'
    },
    heroImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
    ],
    dressCode: 'Boho Sunset Chic (Earthy tones, terracotta, ochre, flowing linen & desert glam)',
    storyText: 'Thirty trips around the sun! Let’s celebrate with mezcal cocktails, wood-fired tacos, disco vibes, and an unforgettable California sunset.',
    welcomeMessage: 'No gifts required—just your wonderful energy and dancing shoes!',
    itinerary: [
      {
        id: 'itin-b1',
        time: '5:00 PM',
        title: 'Golden Hour Cocktails & Grazing Table',
        description: 'Craft mezcal margaritas, passionfruit mocktails & artisan charcuterie.',
        icon: 'GlassWater'
      },
      {
        id: 'itin-b2',
        time: '6:30 PM',
        title: 'Taco Fiesta & Sunset Toast',
        description: 'Gourmet street taco bar with fresh handmade tortillas and rooftop salsa toast.',
        icon: 'Utensils'
      },
      {
        id: 'itin-b3',
        time: '8:00 PM',
        title: 'Birthday Cake & Sparklers',
        description: 'Matcha strawberry layered birthday cake & sparkler moment.',
        icon: 'Sparkles'
      },
      {
        id: 'itin-b4',
        time: '8:30 PM',
        title: 'DJ Set & Rooftop Dancing',
        description: 'Nu-disco and deep house tunes till late.',
        icon: 'Music'
      }
    ],
    faqs: [
      {
        id: 'faq-b1',
        question: 'Should I bring gifts?',
        answer: 'Your presence is the best gift! If you wish, contribute a favorite vinyl record or book.'
      },
      {
        id: 'faq-b2',
        question: 'Are vegan/gluten-free options available?',
        answer: 'Yes! The taco bar has delicious grilled mushroom, jackfruit, and GF corn tortillas.'
      }
    ],
    giftRegistry: [],
    accommodations: [],
    customization: {
      fontFamily: 'alex',
      accentColor: '#e07a5f',
      backgroundColor: '#fefae0',
      cardColor: '#ffffff',
      textColor: '#3d405b',
      cardBorder: 'floral-frame',
      envelopeColor: 'rose',
      envelopeWaxSeal: 'flower',
      showCountdown: true,
      showMap: true,
      showGallery: true,
      showItinerary: true,
      showGuestbook: true,
      showGiftRegistry: false,
      showDressCode: true,
      showFaq: true,
      showAccommodations: false,
      showMusicPlayer: false,
      monogramText: 'M 30'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_RSVPS = [
  {
    id: 'rsvp-1',
    eventId: 'wedding-sophia-liam',
    guestName: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (415) 555-0192',
    status: 'attending',
    attendingCount: 2,
    plusOneNames: ['Dr. Julian Vance'],
    mealPreference: 'Prime Filet Mignon',
    dietaryNotes: 'Gluten-free for guest 2',
    songRequest: 'Can’t Take My Eyes Off You - Frankie Valli',
    messageToHost: 'Cannot wait to celebrate you two gorgeous souls! Counting down the days!',
    submittedAt: '2026-07-28T14:22:00Z',
    checkInCode: 'SL-8921',
    checkedIn: false
  },
  {
    id: 'rsvp-2',
    eventId: 'wedding-sophia-liam',
    guestName: 'Marcus Sterling',
    email: 'marcus.s@example.com',
    phone: '+1 (415) 555-0144',
    status: 'attending',
    attendingCount: 1,
    plusOneNames: [],
    mealPreference: 'Pan-Seared Chilean Sea Bass',
    dietaryNotes: 'None',
    songRequest: 'September - Earth, Wind & Fire',
    messageToHost: 'Honored to be there with you Liam brother! Let’s party.',
    submittedAt: '2026-07-29T10:15:00Z',
    checkInCode: 'SL-4389',
    checkedIn: true
  },
  {
    id: 'rsvp-3',
    eventId: 'wedding-sophia-liam',
    guestName: 'Clara & David Chen',
    email: 'clara.chen@example.com',
    phone: '+1 (510) 555-9011',
    status: 'attending',
    attendingCount: 2,
    plusOneNames: ['David Chen'],
    mealPreference: 'Truffle Wild Mushroom Risotto (Vegetarian)',
    dietaryNotes: 'Vegetarian',
    songRequest: 'Lover - Taylor Swift',
    messageToHost: 'Wishing you both a lifetime of happiness, joy, and laughter!',
    submittedAt: '2026-07-30T19:04:00Z',
    checkInCode: 'SL-7712',
    checkedIn: false
  },
  {
    id: 'rsvp-4',
    eventId: 'wedding-sophia-liam',
    guestName: 'Oliver Wright',
    email: 'oliver.wright@example.com',
    phone: '+1 (310) 555-6677',
    status: 'declined',
    attendingCount: 0,
    plusOneNames: [],
    mealPreference: '',
    dietaryNotes: '',
    songRequest: '',
    messageToHost: 'So sorry I will be out of the country for a prior commitment. Sending you both all our love from London!',
    submittedAt: '2026-07-31T09:12:00Z',
    checkInCode: 'SL-0098',
    checkedIn: false
  }
];

export const INITIAL_GUESTBOOK = [
  {
    id: 'gb-1',
    eventId: 'wedding-sophia-liam',
    authorName: 'Aunt Beatrice & Uncle Robert',
    message: 'Sophia, seeing you find your soulmate in Liam brings tears of joy to our eyes. May your home always be filled with warmth and harmony!',
    emoji: '🥂',
    createdAt: '2026-08-01T11:00:00Z'
  },
  {
    id: 'gb-2',
    eventId: 'wedding-sophia-liam',
    authorName: 'College Squad (Maya, Ben, Tara)',
    message: 'To the best couple in history! We remember when you first met in SF and now look at you! Ready to burn the dance floor in Napa!',
    emoji: '✨',
    createdAt: '2026-08-02T16:30:00Z'
  },
  {
    id: 'gb-3',
    eventId: 'wedding-sophia-liam',
    authorName: 'The Henderson Family',
    message: 'Congratulations on this magnificent milestone. Wishing you endless years of health, laughter, and great wine!',
    emoji: '💍',
    createdAt: '2026-08-03T08:15:00Z'
  }
];

export const sampleEvents = PRESET_TEMPLATES;
