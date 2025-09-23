import { handleError } from "../utils/errorHandler";

const API_URL = process.env.API_URL;

/**
 * Fetches all the necessary data for the landing page from a single endpoint.
 * This includes new arrivals, best sellers, featured products, and categories.
 * The data is revalidated every 60 seconds.
 * @returns A promise that resolves to an object containing landing page data.
 */
export async function fetchLandingPageData() {
  const res = await fetch(`${API_URL}/products/landing-page`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    await handleError(res, "fetchLandingPageData");
  }

  return await res.json();
}
