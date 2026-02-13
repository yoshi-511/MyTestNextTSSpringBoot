export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setAuth(token: string, username: string, email: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
}

export function getUsername(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("username") || "";
}

export function getEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("email") || "";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
