import { differenceInDays } from "date-fns";
import { getAuth } from "./auth";

export interface EngagementStats {
  applicationsSubmitted: number;
  homesViewed: number;
  approvalsReceived: number;
  savedHomes: number;
}

export interface RecoveryBadge {
  id: string;
  name: string;
  days: number;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

const STORAGE_KEY = "tenant_engagement";
const VIEWED_HOMES_KEY = "viewed_homes";

export function getEngagementStats(): EngagementStats {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    applicationsSubmitted: 0,
    homesViewed: 0,
    approvalsReceived: 0,
    savedHomes: 0
  };
}

export function updateEngagementStats(updates: Partial<EngagementStats>): EngagementStats {
  const current = getEngagementStats();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function incrementStat(stat: keyof EngagementStats): EngagementStats {
  const current = getEngagementStats();
  current[stat] = (current[stat] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current;
}

export function getDaysClean(sobrietyDate: string | undefined): number {
  if (!sobrietyDate) return 0;
  try {
    const date = new Date(sobrietyDate);
    if (isNaN(date.getTime())) return 0;
    if (date > new Date()) return 0;
    return differenceInDays(new Date(), date);
  } catch {
    return 0;
  }
}

export function getRecoveryBadges(sobrietyDate: string | undefined): RecoveryBadge[] {
  const daysClean = getDaysClean(sobrietyDate);
  const sobrietyDateObj = sobrietyDate ? new Date(sobrietyDate) : undefined;
  
  const milestones = [
    { id: "7days", name: "7 Days Clean", days: 7, icon: "🌱" },
    { id: "30days", name: "30 Days Clean", days: 30, icon: "🌿" },
    { id: "90days", name: "90 Days Clean", days: 90, icon: "🌳" },
    { id: "180days", name: "6 Months Clean", days: 180, icon: "⭐" },
    { id: "365days", name: "1 Year Clean", days: 365, icon: "🏆" },
  ];

  return milestones.map(milestone => {
    const unlocked = daysClean >= milestone.days;
    let unlockedDate: Date | undefined;
    if (unlocked && sobrietyDateObj) {
      unlockedDate = new Date(sobrietyDateObj);
      unlockedDate.setDate(unlockedDate.getDate() + milestone.days);
    }
    return {
      ...milestone,
      unlocked,
      unlockedDate
    };
  });
}

export function getNextStep(stats: EngagementStats): { title: string; action: string; path: string } {
  if (stats.savedHomes === 0) {
    return {
      title: "Save Your First Home",
      action: "Browse listings and save homes you're interested in",
      path: "/browse"
    };
  }
  if (stats.applicationsSubmitted === 0) {
    return {
      title: "Submit an Application",
      action: "Apply to one of your saved homes",
      path: "/tenant-dashboard?tab=saved"
    };
  }
  if (stats.approvalsReceived === 0) {
    return {
      title: "Check Application Status",
      action: "Follow up on your pending applications",
      path: "/tenant-dashboard?tab=applications"
    };
  }
  return {
    title: "Keep Exploring",
    action: "Discover more housing options",
    path: "/browse"
  };
}

export interface ViewedHome {
  propertyId: string;
  viewedAt: string;
}

let serverViewedHomes: ViewedHome[] | null = null;

export async function fetchServerViewedHomes(): Promise<ViewedHome[]> {
  const user = getAuth();
  if (!user || user.role !== "tenant") {
    return [];
  }
  try {
    const res = await fetch("/api/tenant/viewed-homes", { credentials: "include" });
    if (res.ok) {
      serverViewedHomes = await res.json();
      return serverViewedHomes || [];
    }
  } catch (error) {
    console.error("Error fetching viewed homes:", error);
  }
  return [];
}

function getLocalViewedHomes(): ViewedHome[] {
  const stored = localStorage.getItem(VIEWED_HOMES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export function getViewedHomes(): ViewedHome[] {
  const user = getAuth();
  if (user && user.role === "tenant" && serverViewedHomes !== null) {
    return serverViewedHomes;
  }
  return getLocalViewedHomes();
}

export async function addViewedHome(propertyId: string): Promise<ViewedHome[]> {
  const user = getAuth();
  if (user && user.role === "tenant") {
    try {
      await fetch(`/api/tenant/viewed-homes/${propertyId}`, { 
        method: "POST", 
        credentials: "include" 
      });
      const newEntry = { propertyId, viewedAt: new Date().toISOString() };
      if (serverViewedHomes === null) {
        serverViewedHomes = [];
      }
      if (!serverViewedHomes.find(v => v.propertyId === propertyId)) {
        serverViewedHomes.unshift(newEntry);
      }
      return serverViewedHomes;
    } catch (error) {
      console.error("Error adding viewed home:", error);
    }
  } else {
    const viewed = getLocalViewedHomes();
    const exists = viewed.find(v => v.propertyId === propertyId);
    if (!exists) {
      viewed.unshift({ propertyId, viewedAt: new Date().toISOString() });
      localStorage.setItem(VIEWED_HOMES_KEY, JSON.stringify(viewed.slice(0, 50)));
    }
    return viewed;
  }
  return [];
}

export function resetViewedHomesCache(): void {
  serverViewedHomes = null;
}

const TOUR_REQUESTS_KEY = "tour_requests";

export type TourStatus = "pending" | "approved" | "denied";

export interface TourRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  time: string;
  status: TourStatus;
  createdAt: string | Date;
  tenantName?: string;
  tenantEmail?: string;
  tourType?: "virtual" | "in-person";
  responseDate?: string;
  providerMessage?: string;
  providerNotes?: string;
}

export function getTourRequests(): TourRequest[] {
  const stored = localStorage.getItem(TOUR_REQUESTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export function addTourRequest(request: Omit<TourRequest, "id" | "createdAt" | "status">): TourRequest[] {
  const tours = getTourRequests();
  const newTour: TourRequest = {
    ...request,
    id: `tour_${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  tours.unshift(newTour);
  localStorage.setItem(TOUR_REQUESTS_KEY, JSON.stringify(tours));
  return tours;
}

export function hasPendingTours(): boolean {
  return getTourRequests().some(t => t.status === "pending");
}

export function updateTourStatus(tourId: string, status: TourStatus, providerMessage?: string): TourRequest[] {
  const tours = getTourRequests();
  const tour = tours.find(t => t.id === tourId);
  if (tour) {
    tour.status = status;
    tour.responseDate = new Date().toISOString();
    if (providerMessage) {
      tour.providerMessage = providerMessage;
    }
    localStorage.setItem(TOUR_REQUESTS_KEY, JSON.stringify(tours));
  }
  return tours;
}

// Clear all tour requests (for testing/cleanup)
export function clearTourRequests(): void {
  localStorage.removeItem(TOUR_REQUESTS_KEY);
}

// Filter tour requests to only include those with valid property IDs
export async function getValidTourRequests(validPropertyIds: number[]): Promise<TourRequest[]> {
  const tours = getTourRequests();
  const validIdStrings = validPropertyIds.map(id => String(id));
  return tours.filter(tour => validIdStrings.includes(String(tour.propertyId)));
}

// Seed sample tour requests for testing
export function seedTestTourRequests(listings: Array<{id: number, propertyName: string}>): TourRequest[] {
  // Clear existing tour requests first
  clearTourRequests();
  
  if (listings.length < 2) return [];
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);
  const futureDateStr = futureDate.toISOString().split('T')[0];
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2);
  const pastDateStr = pastDate.toISOString().split('T')[0];
  
  const testTours: TourRequest[] = [
    {
      id: "tour_test_1",
      propertyId: String(listings[0].id),
      propertyName: listings[0].propertyName,
      date: futureDateStr,
      time: "10:00 AM",
      status: "pending",
      tourType: "in-person",
      createdAt: new Date().toISOString(),
      tenantName: "Jamie Rivera",
      tenantEmail: "testtenant@soberstay.com",
    },
    {
      id: "tour_test_2",
      propertyId: String(listings[1].id),
      propertyName: listings[1].propertyName,
      date: pastDateStr,
      time: "2:00 PM",
      status: "approved",
      tourType: "virtual",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      responseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      providerMessage: "Looking forward to meeting you! Join via Zoom link we'll email.",
      tenantName: "Jamie Rivera",
      tenantEmail: "testtenant@soberstay.com",
    }
  ];
  
  localStorage.setItem(TOUR_REQUESTS_KEY, JSON.stringify(testTours));
  return testTours;
}
