import { handleError } from "../utils/errorHandler";

const API_URL = process.env.API_URL;

/**
 * Fetches all the necessary data for the landing page from a single endpoint.
 * This includes new arrivals, best sellers, featured products, and categories.
 * The data is revalidated once a day.
 * @returns A promise that resolves to an object containing landing page data.
 */
export async function fetchLandingPageData() {
  const res = await fetch(`${process.env.API_URL}/products/landing-page`, {
    next: { revalidate: 86400, tags: ["landing-page"] }, // Revalidate once a day (86400 seconds)
  });

  if (!res.ok) {
    await handleError(res, "fetchLandingPageData");
  }

  return await res.json();
}
