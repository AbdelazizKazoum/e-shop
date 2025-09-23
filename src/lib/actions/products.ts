// lib/api/products.ts
"use server";

import { handleError } from "../utils/errorHandler";

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not defined");

export async function fetchProducts(page = 1, limit = 10) {
  const res = await fetch(
    `${API_URL}/products/client?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    await handleError(res, "fetchProducts");
  }
  return (await res.json())?.data || [];
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/categories`, {
    next: { revalidate: 10 }, // update every 10s
  });

  if (!res.ok) {
    await handleError(res, "fetchCategories");
  }
  return (await res.json()) || [];
}

export async function getProductByName(name: string) {
  const res = await fetch(`${API_URL}/products/name/${name}`);

  if (!res.ok) {
    await handleError(res, "getProductByName");
  }
  return (await res.json()) || [];
}

export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 10 }, // update every 10s
  });

  if (!res.ok) {
    await handleError(res, "getProductById");
  }
  return (await res.json()) || [];
}
