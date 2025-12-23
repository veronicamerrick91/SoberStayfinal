import { getAuth } from "./auth";

const FAVORITES_KEY = "soberStay_favorites";

let serverFavorites: string[] | null = null;

export async function fetchServerFavorites(): Promise<string[]> {
  const user = getAuth();
  if (!user || user.role !== "tenant") {
    return [];
  }
  try {
    const res = await fetch("/api/tenant/favorites", { credentials: "include" });
    if (res.ok) {
      serverFavorites = await res.json();
      return serverFavorites || [];
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
  return [];
}

function getLocalFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getFavorites(): string[] {
  const user = getAuth();
  if (user && user.role === "tenant" && serverFavorites !== null) {
    return serverFavorites;
  }
  return getLocalFavorites();
}

export async function addFavorite(propertyId: string): Promise<void> {
  const user = getAuth();
  if (user && user.role === "tenant") {
    try {
      await fetch(`/api/tenant/favorites/${propertyId}`, { 
        method: "POST", 
        credentials: "include" 
      });
      if (serverFavorites && !serverFavorites.includes(propertyId)) {
        serverFavorites.push(propertyId);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  } else {
    const favorites = getLocalFavorites();
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }
}

export async function removeFavorite(propertyId: string): Promise<void> {
  const user = getAuth();
  if (user && user.role === "tenant") {
    try {
      await fetch(`/api/tenant/favorites/${propertyId}`, { 
        method: "DELETE", 
        credentials: "include" 
      });
      if (serverFavorites) {
        serverFavorites = serverFavorites.filter(id => id !== propertyId);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  } else {
    const favorites = getLocalFavorites();
    const filtered = favorites.filter(id => id !== propertyId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  }
}

export function isFavorite(propertyId: string): boolean {
  return getFavorites().includes(propertyId);
}

export async function toggleFavorite(propertyId: string): Promise<boolean> {
  if (isFavorite(propertyId)) {
    await removeFavorite(propertyId);
    return false;
  } else {
    await addFavorite(propertyId);
    return true;
  }
}
