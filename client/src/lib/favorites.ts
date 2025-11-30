const FAVORITES_KEY = "soberStay_favorites";

export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(propertyId: string) {
  const favorites = getFavorites();
  if (!favorites.includes(propertyId)) {
    favorites.push(propertyId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(propertyId: string) {
  const favorites = getFavorites();
  const filtered = favorites.filter(id => id !== propertyId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(propertyId: string): boolean {
  return getFavorites().includes(propertyId);
}

export function toggleFavorite(propertyId: string): boolean {
  if (isFavorite(propertyId)) {
    removeFavorite(propertyId);
    return false;
  } else {
    addFavorite(propertyId);
    return true;
  }
}
