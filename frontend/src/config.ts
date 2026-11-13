const url = import.meta.env.VITE_API_BASE_URL;

if (!url) {
  throw new Error("VITE_API_BASE_URL is not set. Define it in frontend/.env or frontend/.env.local.");
}

/** Base URL of the backend API, read from frontend/.env (override in .env.local). */
export const API_BASE_URL: string = url;
