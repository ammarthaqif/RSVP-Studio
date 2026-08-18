import { EventInvitation, RSVPResponse } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
}

export function calculateCountdown(targetDate: string, targetTime: string = '16:00') {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };

  try {
    const [year, month, day] = targetDate.split('-').map(Number);
    const [hours, minutes] = targetTime.split(':').map(Number);
    const target = new Date(year, month - 1, day, hours || 0, minutes || 0);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours: hoursRemaining,
      minutes: minutesRemaining,
      seconds: secondsRemaining,
      isPast: false,
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }
}

// Generate Google Calendar Link
export function createGoogleCalendarUrl(event: EventInvitation): string {
  const startDateFormatted = event.date.replace(/-/g, '');
  const startTimeFormatted = event.time ? event.time.replace(':', '') + '00' : '160000';
  const endDateTime = `${startDateFormatted}T${startTimeFormatted}`;
  
  // Assuming 5 hours event if no end time
  const endDateFormatted = event.endDate ? event.endDate.replace(/-/g, '') : startDateFormatted;
  const endTimeFormatted = event.endTime ? event.endTime.replace(':', '') + '00' : '220000';
  const dates = `${startDateFormatted}T${startTimeFormatted}/${endDateFormatted}T${endTimeFormatted}`;

  const details = `${event.headline}\n${event.subtitle}\n\nVenue: ${event.venue.name}, ${event.venue.address}, ${event.venue.city}\nDress Code: ${event.dressCode}\nRSVP Deadline: ${event.rsvpDeadline}`;
  const location = `${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.state || ''} ${event.venue.country}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate standard .ics download for Apple Calendar / Outlook
export function downloadICSFile(event: EventInvitation) {
  const startDate = event.date.replace(/-/g, '');
  const startTime = event.time ? event.time.replace(':', '') + '00' : '160000';
  const endDate = event.endDate ? event.endDate.replace(/-/g, '') : startDate;
  const endTime = event.endTime ? event.endTime.replace(':', '') + '00' : '220000';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celebration Studio//Digital Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@celebrationstudio.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startDate}T${startTime}`,
    `DTEND:${endDate}T${endTime}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.headline} - ${event.subtitle}\\nDress Code: ${event.dressCode}\\nRSVP by: ${event.rsvpDeadline}`,
    `LOCATION:${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.state || ''}, ${event.venue.country}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.slug || 'invitation'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Navigation links
export function getGoogleMapsDirectionsUrl(venue: EventInvitation['venue']): string {
  const query = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}, ${venue.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getAppleMapsUrl(venue: EventInvitation['venue']): string {
  const query = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}, ${venue.country}`);
  return `https://maps.apple.com/?q=${query}&ll=${venue.latitude},${venue.longitude}`;
}

export function getWazeUrl(venue: EventInvitation['venue']): string {
  return `https://waze.com/ul?ll=${venue.latitude},${venue.longitude}&navigate=yes`;
}

// Export Invitation to High-Res PDF
export async function exportInvitationToPDF(elementId: string, filename: string = 'invitation.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    window.print();
  }
}

// Export Invitation as Image (PNG)
export async function exportInvitationToImage(elementId: string, filename: string = 'invitation-card.png') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Failed to export image:', error);
  }
}

// Export RSVPs to CSV
export function exportRSVPsToCSV(rsvps: RSVPResponse[], eventTitle: string) {
  const headers = [
    'Guest Name',
    'Email',
    'Phone',
    'Status',
    'Attending Count',
    'Plus One Names',
    'Meal Preference',
    'Dietary Notes',
    'Song Request',
    'Message to Host',
    'Check-In Code',
    'Checked In',
    'Submitted At',
  ];

  const rows = rsvps.map(r => [
    `"${r.guestName.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    r.attendingCount,
    `"${(r.plusOneNames || []).join(', ').replace(/"/g, '""')}"`,
    `"${(r.mealPreference || '').replace(/"/g, '""')}"`,
    `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
    `"${(r.songRequest || '').replace(/"/g, '""')}"`,
    `"${(r.messageToHost || '').replace(/"/g, '""')}"`,
    `"${r.checkInCode}"`,
    r.checkedIn ? 'Yes' : 'No',
    `"${r.submittedAt}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rsvps.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
