// lib/api/products.ts
"use server";

import { handleError } from "../utils/errorHandler";

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not defined");

/**
 * Fetches a paginated list of products.
 * The data is revalidated once a day and can be revalidated on-demand using the "products" or "products-list" tags.
 * @param page - The page number to fetch. Defaults to 1.
 * @param limit - The number of products per page. Defaults to 10.
 * @returns A promise that resolves to an array of products.
 */
export async function fetchProducts(page = 1, limit = 10) {
  const res = await fetch(
    `${API_URL}/products/client?page=${page}&limit=${limit}`,
    { next: { revalidate: 86400, tags: ["products", "products-list"] } }
  );
  if (!res.ok) {
    await handleError(res, "fetchProducts");
  }
  return (await res.json())?.data || [];
}

/**
 * Fetches all product categories.
 * The data is revalidated once a day and can be revalidated on-demand using the "categories" tag.
 * @returns A promise that resolves to an array of categories.
 */
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/categories`, {
    next: { revalidate: 86400, tags: ["categories"] },
  });

  if (!res.ok) {
    await handleError(res, "fetchCategories");
  }
  return (await res.json()) || [];
}

/**
 * Fetches a single product by its name.
 * The data is revalidated once a day and can be revalidated on-demand using the "products" or "product-${name}" tags.
 * @param name - The name of the product to fetch.
 * @returns A promise that resolves to the product object.
 */
export async function getProductByName(name: string) {
  const res = await fetch(`${API_URL}/products/name/${name}`, {
    next: { revalidate: 86400, tags: ["products", `product-${name}`] },
  });

  if (!res.ok) {
    await handleError(res, "getProductByName");
  }
  return (await res.json()) || [];
}

/**
 * Fetches a single product by its ID.
 * The data is revalidated once a day and can be revalidated on-demand using the "products" or "product-${id}" tags.
 * @param id - The ID of the product to fetch.
 * @returns A promise that resolves to the product object.
 */
export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 86400, tags: ["products", `product-${id}`] },
  });

  if (!res.ok) {
    await handleError(res, "getProductById");
  }
  return (await res.json()) || [];
}
