import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

/**
 * GET /api/db-check
 * Tests the MongoDB Atlas connection and returns the result as JSON.
 * Visit this route in the browser (or curl it) to confirm the DB credentials work.
 */
export async function GET() {
  const result = await pingDatabase();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
