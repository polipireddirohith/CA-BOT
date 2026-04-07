export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchFromAPI = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};
