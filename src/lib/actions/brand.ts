const API_URL = process.env.API_URL;

export async function fetchTopBrands() {
  const res = await fetch(`${API_URL}/brands?page=1&limit=5`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch brands");
  return (await res.json())?.data || [];
}
