import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag); // ✅ refresh all fetches with this tag
    return NextResponse.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path); // ✅ refresh a specific page
    return NextResponse.json({ revalidated: true, path });
  }

  return NextResponse.json(
    { message: "Path or tag is required" },
    { status: 400 }
  );
}
