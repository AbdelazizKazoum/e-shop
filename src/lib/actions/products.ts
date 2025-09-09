// lib/api/products.ts
"use server";

const API_URL = process.env.API_URL;
export async function fetchProducts(page = 1, limit = 10) {
  const res = await fetch(
    `${API_URL}/products/client?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return (await res.json())?.data || [];
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/categories`, {
    next: { revalidate: 10 }, // update every 1h
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return (await res.json()) || [];
}

export async function getProductByName(name: string) {
  const res = await fetch(`${API_URL}/products/name/${name}`);

  if (!res.ok) throw new Error("Failed to fetch product");
  return (await res.json()) || [];
}

export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 10 }, // update every 1h
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  return (await res.json()) || [];
}
