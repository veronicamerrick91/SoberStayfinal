type EventType = 'view' | 'click' | 'inquiry' | 'tour_request' | 'application';

interface AnalyticsEvent {
  listingId: number;
  eventType: EventType;
  city?: string;
  state?: string;
}

const recentEvents = new Map<string, number>();
const DEBOUNCE_MS = 5000;

function getEventKey(event: AnalyticsEvent): string {
  return `${event.listingId}-${event.eventType}`;
}

function shouldTrack(event: AnalyticsEvent): boolean {
  const key = getEventKey(event);
  const lastTime = recentEvents.get(key);
  const now = Date.now();
  
  if (lastTime && now - lastTime < DEBOUNCE_MS) {
    return false;
  }
  
  recentEvents.set(key, now);
  return true;
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!shouldTrack(event)) {
    return;
  }
  
  const payload = JSON.stringify(event);
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/events', new Blob([payload], { type: 'application/json' }));
  } else {
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {});
  }
}

export function trackListingView(listingId: number, city?: string, state?: string): void {
  trackEvent({ listingId, eventType: 'view', city, state });
}

export function trackListingClick(listingId: number): void {
  trackEvent({ listingId, eventType: 'click' });
}

export function trackInquiry(listingId: number): void {
  trackEvent({ listingId, eventType: 'inquiry' });
}

export function trackTourRequest(listingId: number): void {
  trackEvent({ listingId, eventType: 'tour_request' });
}

export function trackApplication(listingId: number): void {
  trackEvent({ listingId, eventType: 'application' });
}

// Site-wide visitor tracking for admin analytics
const siteViewDebounce = new Map<string, number>();
const SITE_VIEW_DEBOUNCE_MS = 30000; // 30 seconds between same page views

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('siteSessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('siteSessionId', sessionId);
  }
  return sessionId;
}

export function trackPageView(page: string): void {
  const key = page;
  const lastTime = siteViewDebounce.get(key);
  const now = Date.now();
  
  if (lastTime && now - lastTime < SITE_VIEW_DEBOUNCE_MS) {
    return;
  }
  
  siteViewDebounce.set(key, now);
  
  const payload = JSON.stringify({
    page,
    sessionId: getSessionId()
  });
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track-visit', new Blob([payload], { type: 'application/json' }));
  } else {
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {});
  }
}
