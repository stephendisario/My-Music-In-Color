import { verifySession } from "@/app/lib/dal";
import { customFetch, fetchWithOffset } from "../spotify";
import { SPOTIFY_API_BASE_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const time_range = req.nextUrl.searchParams.get("time_range");
    const session = await verifySession();
    const accessToken = session.payload;
    const body = await fetchWithOffset<Track>(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks`,
      accessToken.toString(),
      50,
      time_range ?? undefined
    );
    return Response.json(body);
  } catch (error: any) {
    console.error("Error fetching top tracks:", error);
  }
}
