import { verifySession } from "../lib/dal";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com";

const customFetch = async (url: string, options = {}) => {
  const fetchOptions: RequestInit = {
    ...options,
    cache: "force-cache", // Set cache option to force cache
  };

  return fetch(url, fetchOptions);
};

export const getUserProfile = async () => {
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

    return body;
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
  }
};

export const getTopTracks = async (time_range: "short_term" | "medium_term" | "long_term") => {
  try {
    const session = await verifySession();
    const accessToken = session.payload;
    return await fetchWithOffset<Track>(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks`,
      accessToken.toString(),
      50,
      time_range
    );
  } catch (error: any) {
    console.error("Error fetching top tracks:", error.message);
  }
};

const fetchWithOffset = async <T>(
  url: string,
  accessToken: string,
  limit: number,
  timeRange: string
): Promise<T[]> => {
  let offset = 0;
  let allItems: T[] = [];
  let data: SpotifyResponse<T>;

  do {
    const response = await customFetch(
      `${url}?limit=${limit}&offset=${offset}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(response));
    }

    allItems = allItems.concat(data.items);
    offset = offset + limit;
  } while (data.next);

  return allItems;
};
