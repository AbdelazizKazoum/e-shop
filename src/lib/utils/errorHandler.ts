export async function handleError(res: Response, context: string) {
  const errorMsg = await res.text();
  console.error(`[${context}] Error ${res.status}: ${errorMsg}`);
  throw new Error(`[${context}] Failed: ${res.status} ${errorMsg}`);
}
