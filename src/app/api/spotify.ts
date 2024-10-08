"use server";
import { SPOTIFY_API_BASE_URL } from "../lib/constants";
import { verifySession } from "../lib/dal";

export const customFetch = async (url: string, options = {}) => {
  const fetchOptions: RequestInit = {
    ...options,
    next: { revalidate: 86400 },
  };

  return fetch(url, fetchOptions);
};

export const createPlaylist = async (color: string, term: string, user_id: string) => {
  const session = await verifySession();
  const accessToken = session.payload;
  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/v1/users/${user_id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${term} - ${color}`,
        description: "playlist created via mymusicincolor.com",
      }),
    });

    const body: any = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(body));
    }

    return body.id;
  } catch (error: any) {
    console.error("Error creating playlist:", error.message);
  }
};

export const addTracksToPlaylist = async (playlistId: string, trackUris: string[]) => {
  const session = await verifySession();
  const accessToken = session.payload;

  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    const body: any = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(body));
    }

    return body;
  } catch (error: any) {
    console.error("Error adding tracks to playlist:", error.message);
  }
};

export const addImageToPlaylist = async (playlistId: string, imgUrl: string) => {
  const session = await verifySession();
  const accessToken = session.payload;

  const retries = 2;
  let response;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      response = await fetch(`${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/images`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
        body: imgUrl,
      });

      if (response.ok) {
        console.log("Playlist cover image updated successfully");
        return response.status;
      } else {
        console.error(`Attempt ${attempt} failed:`, response.status, response.statusText);
      }
    } catch (error) {
      console.error(`Attempt ${attempt} encountered an error:`, error);
    }

    // Exponential backoff
    await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
  }

  console.error("Failed to update playlist cover image after multiple attempts");
  return response ? response?.status : 504;
};

export const getUserProfile = async () => {
  const session = await verifySession();
  const accessToken = session.payload;
  try {
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

//TODO: Clean this up

export const getTopTracks = async (
  time_range: "short_term" | "medium_term" | "long_term",
  iterations = 0
) => {
  const session = await verifySession();
  const accessToken = session.payload;

  try {
    const res = await customFetch(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks?limit=1&offset=0&time_range=${time_range}&fields=total`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const total = await res.json();

    return await fetchWithOffset<Track>(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks`,
      accessToken.toString(),
      50,
      time_range,
      iterations,
      total.total
    );
  } catch (error: any) {
    console.error("Error fetching top tracks:", error);
  }
};

export const fetchWithOffset = async <T>(
  url: string,
  accessToken: string,
  limit: number,
  timeRange = "short_term",
  iterations = 0,
  total: number
): Promise<T[]> => {
  let offset = 0;
  let allItems: T[] = [];
  let data: SpotifyResponse<T>;
  let count = 0;

  const fields: any = {
    id: true,
    name: true,
    album: {
      images: true,
      id: true,
    },
    artists: {
      id: true,
      name: true,
    },
    uri: true,
    external_urls: {
      spotify: true,
    },
  };

  console.log("TOTAL", total);

  const fieldsString = Object.keys(fields)
    .map((key) => {
      if (typeof fields[key] === "object") {
        return `${key}(${Object.keys(fields[key]).join(",")})`;
      } else {
        return key;
      }
    })
    .join(",");

  const cap = total > 6000 ? 6000 : total;

  let promiseArray = [];
  while (!iterations ? offset < cap : count < iterations) {
    promiseArray.push(
      customFetch(
        `${url}?limit=${limit}&offset=${offset}&time_range=${timeRange}&fields=next,items(${fieldsString})`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((resp) => resp.json())
    );
    offset = offset + limit;
    count = count + 1;
  }

  const responses = await Promise.all(promiseArray);

  const allTopTracks = responses.reduce((accumulator, currentResponse) => {
    if (currentResponse?.items) return [...accumulator, ...currentResponse?.items];
    else return accumulator;
  }, []);

  return { tracks: allTopTracks, total: cap } as any;
};
