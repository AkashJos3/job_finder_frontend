// Format timestamp: "Today 2:30 PM", "Yesterday 11:45 AM", or "Mar 2, 9:00 AM"
export function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` ${time}`;
}

// Returns a date-only label like "Today", "Yesterday", "Monday, Mar 3"
export function getDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

// Convert "HH:MM" (e.g. "14:30") to user-friendly time (e.g. "2:30 PM")
export function formatTime24to12(time24: string | undefined): string {
  if (!time24) return '';
  const [hourStr, minute] = time24.split(':');
  if (!hourStr || !minute) return time24;
  
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  
  return `${hour}:${minute} ${ampm}`;
}

// Format a shift date to a friendly label (e.g. "Oct 12, 2026")
export function formatShiftDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
