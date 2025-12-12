export interface User {
  id: string;
  email: string;
  role: "tenant" | "provider" | "admin";
  name: string;
}

const AUTH_KEY = "soberStay_auth";

export function saveAuth(user: User) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getAuth(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export async function logout() {
  try {
    await fetch("/api/auth/logout", { credentials: "include" });
  } catch (e) {
    console.error("Logout error:", e);
  }
  clearAuth();
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
