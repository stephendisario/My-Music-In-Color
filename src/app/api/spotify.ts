import { verifySession } from "../lib/dal";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com";

export const getUserProfile = async () => {
  try {
    const session = await verifySession();
    const accessToken = session.payload;
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/v1/me`, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Function to fetch user's top tracks
export const getTopTracks = async (timeRange = "medium_term") => {
  try {
    const session = await verifySession();
    const accessToken = session.payload;
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks?time_range=${timeRange}`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};
