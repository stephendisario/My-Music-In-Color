import { verifySession } from "@/app/lib/dal";
import { customFetch } from "../spotify";
import { SPOTIFY_API_BASE_URL } from "@/app/lib/constants";

export async function GET() {
  try {
    const session = await verifySession();
    const accessToken = session.payload;
    const response = await customFetch(`${SPOTIFY_API_BASE_URL}/v1/me`, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const body: User = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(body));
    }

    console.log(body);

    return Response.json(body);
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
  }
}
