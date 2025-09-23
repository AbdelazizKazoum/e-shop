"use server";

import { handleError } from "../utils/errorHandler";

const API_URL = process.env.API_URL;

export async function fetchTopBrands() {
  const res = await fetch(`${API_URL}/brands?page=1&limit=5`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    await handleError(res, "fetchTopBrands");
  }
  return (await res.json())?.data || [];
}

// Fetch all brands
export async function fetchAllBrands() {
  const res = await fetch(`${API_URL}/brands/all`, {
    next: { revalidate: 60 },
  });

  console.log("🚀 ~ fetchAllBrands ~ res:", res);
  if (!res.ok) {
    await handleError(res, "fetchAllBrands");
  }
  return (await res.json()) || [];
}
