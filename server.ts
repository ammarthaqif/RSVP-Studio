import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PRESET_TEMPLATES, INITIAL_RSVPS, INITIAL_GUESTBOOK } from './src/data/presets';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory data store with initial sample presets
let eventsStore = [...PRESET_TEMPLATES];
let rsvpsStore = [...INITIAL_RSVPS];
let guestbookStore = [...INITIAL_GUESTBOOK];

// Initialize Google GenAI client (lazy / server-side safe)
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all events
app.get('/api/events', (req, res) => {
  res.json(eventsStore);
});

// GET single event by id or slug
app.get('/api/events/:id', (req, res) => {
  const event = eventsStore.find(e => e.id === req.params.id || e.slug === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// CREATE new event
app.post('/api/events', (req, res) => {
  const newEvent = {
    ...req.body,
    id: req.body.id || `event-${Date.now()}`,
    slug: req.body.slug || `event-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  eventsStore.unshift(newEvent);
  res.status(201).json(newEvent);
});

// UPDATE event
app.put('/api/events/:id', (req, res) => {
  const index = eventsStore.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  eventsStore[index] = {
    ...eventsStore[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(eventsStore[index]);
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  eventsStore = eventsStore.filter(e => e.id !== req.params.id);
  rsvpsStore = rsvpsStore.filter(r => r.eventId !== req.params.id);
  guestbookStore = guestbookStore.filter(g => g.eventId !== req.params.id);
  res.json({ success: true });
});

// GET RSVPs for an event
app.get('/api/events/:id/rsvps', (req, res) => {
  const eventRsvps = rsvpsStore.filter(r => r.eventId === req.params.id);
  res.json(eventRsvps);
});

// SUBMIT RSVP
app.post('/api/events/:id/rsvp', (req, res) => {
  const eventId = req.params.id;
  const { guestName, email, phone, status, attendingCount, plusOneNames, mealPreference, dietaryNotes, songRequest, messageToHost } = req.body;

  if (!guestName || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Generate a random 6-character check-in code
  const codePrefix = guestName.slice(0, 2).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const checkInCode = `${codePrefix}-${randomDigits}`;

  const newRsvp = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    eventId,
    guestName,
    email,
    phone: phone || '',
    status: status || 'attending',
    attendingCount: status === 'attending' ? (Number(attendingCount) || 1) : 0,
    plusOneNames: plusOneNames || [],
    mealPreference: mealPreference || '',
    dietaryNotes: dietaryNotes || '',
    songRequest: songRequest || '',
    messageToHost: messageToHost || '',
    submittedAt: new Date().toISOString(),
    checkInCode,
    checkedIn: false,
  };

  rsvpsStore.unshift(newRsvp);

  // If there is a heartfelt message to host, also post it to guestbook automatically
  if (messageToHost && messageToHost.trim().length > 3) {
    guestbookStore.unshift({
      id: `gb-${Date.now()}`,
      eventId,
      authorName: guestName,
      message: messageToHost.trim(),
      emoji: status === 'attending' ? '🥂' : '💌',
      createdAt: new Date().toISOString(),
    });
  }

  res.status(201).json(newRsvp);
});

// CHECK-IN guest
app.patch('/api/events/:id/rsvps/:rsvpId/checkin', (req, res) => {
  const rsvp = rsvpsStore.find(r => r.id === req.params.rsvpId && r.eventId === req.params.id);
  if (!rsvp) {
    return res.status(404).json({ error: 'RSVP not found' });
  }
  rsvp.checkedIn = req.body.checkedIn !== undefined ? req.body.checkedIn : !rsvp.checkedIn;
  res.json(rsvp);
});

// DELETE RSVP
app.delete('/api/events/:id/rsvps/:rsvpId', (req, res) => {
  rsvpsStore = rsvpsStore.filter(r => r.id !== req.params.rsvpId);
  res.json({ success: true });
});

// GET Guestbook messages
app.get('/api/events/:id/guestbook', (req, res) => {
  const entries = guestbookStore.filter(g => g.eventId === req.params.id);
  res.json(entries);
});

// POST Guestbook message
app.post('/api/events/:id/guestbook', (req, res) => {
  const { authorName, message, emoji } = req.body;
  if (!authorName || !message) {
    return res.status(400).json({ error: 'Author name and message are required' });
  }

  const newEntry = {
    id: `gb-${Date.now()}`,
    eventId: req.params.id,
    authorName,
    message,
    emoji: emoji || '✨',
    createdAt: new Date().toISOString(),
  };

  guestbookStore.unshift(newEntry);
  res.status(201).json(newEntry);
});

// ==================== AI COPILOT ENDPOINTS ====================

// AI Wording Generator
app.post('/api/ai/generate-wording', async (req, res) => {
  try {
    const { eventType, tone, hosts, title, details, language } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // High-quality fallback text if API key is not yet set
      const defaultPhrasings = [
        {
          headline: 'Together with their families',
          subtitle: `Request the honor of your presence to celebrate the ${eventType || 'event'} of ${hosts || 'our beloved hosts'}`,
          storyText: `We are overjoyed to welcome you to our special celebration. Surrounded by the warmth of family, cherished friendships, and memorable moments, we invite you to laugh, dance, and celebrate with us.`,
          dressCode: 'Formal / Elegant Attire requested',
          welcomeNote: 'Your presence is the greatest gift of all as we gather for an unforgettable milestone.'
        },
        {
          headline: 'A Joyous Milestone & Celebration',
          subtitle: `Join us under the stars as we toast to new beginnings, love, and laughter with ${hosts || 'us'}`,
          storyText: `Every great moment in life is made brighter when shared with the people we treasure most. We cannot wait to raise a glass and make lifelong memories together.`,
          dressCode: 'Cocktail Chic & Festive Colors',
          welcomeNote: 'Pack your dancing shoes and highest spirits for an evening of magic.'
        }
      ];
      return res.json({ suggestions: defaultPhrasings });
    }

    const prompt = `You are a world-class luxury invitation designer and copywriter.
Generate 3 distinct creative invitation wording options for this event:
- Event Type: ${eventType || 'Wedding / Celebration'}
- Tone: ${tone || 'Romantic & Elegant'} (e.g. Romantic, Formal Luxury, Playful Modern, Poetic, Royal, or Festive)
- Names / Hosts: ${hosts || 'The Hosts'}
- Event Title / Focus: ${title || 'Our Celebration'}
- Additional Details / Special Requests: ${details || 'None provided'}
- Language: ${language || 'English'}

Return ONLY a JSON array where each object has these exact string fields:
[
  {
    "headline": "Short top eyebrow/greeting (e.g. Together with their families / Join us for an evening of magic)",
    "subtitle": "Formal invitation invite line",
    "storyText": "Heartfelt 2-3 sentence narrative / our story / welcome story for the invitation card",
    "dressCode": "Clear and stylish dress code description",
    "welcomeNote": "Warm short message to guests"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ suggestions: parsed });
  } catch (error: any) {
    console.error('Gemini wording generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate invitation copy' });
  }
});

// AI Itinerary Suggestion
app.post('/api/ai/suggest-itinerary', async (req, res) => {
  try {
    const { eventType, startTime, endTime, theme } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        itinerary: [
          { time: startTime || '4:00 PM', title: 'Guest Arrival & Welcome Refreshments', description: 'Champagne toast & artisan canapés.', icon: 'GlassWater' },
          { time: '4:45 PM', title: 'Main Ceremony / Event Opening', description: 'Opening speeches and main celebration ceremony.', icon: 'Heart' },
          { time: '6:00 PM', title: 'Cocktail Reception & Photos', description: 'Signature drinks and live entertainment.', icon: 'Sparkles' },
          { time: '7:15 PM', title: 'Grand Banquet Dinner', description: 'Curated multi-course dinner & toasts.', icon: 'Utensils' },
          { time: '9:00 PM', title: 'Live Music & Dancing', description: 'Dessert bar, dancing, and late-night festivities.', icon: 'Music' },
        ]
      });
    }

    const prompt = `Create a realistic, chronological timeline itinerary for a ${eventType || 'wedding/event'}.
Start time: ${startTime || '4:00 PM'}, End time: ${endTime || '11:00 PM'}.
Theme/Style: ${theme || 'Elegant celebration'}.

Return ONLY a JSON array of 4 to 6 timeline items with this format:
[
  {
    "time": "4:00 PM",
    "title": "Short title",
    "description": "1 sentence description",
    "icon": "One of: Heart, Sparkles, Utensils, Music, GlassWater, Camera, Mic, Gift"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ itinerary: parsed });
  } catch (error: any) {
    console.error('AI itinerary error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
  }
});

// ==================== VITE & STATIC SERVER ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Celebration Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
