import { SPOTIFY_API_BASE_URL } from "../lib/constants";
import { verifySession } from "../lib/dal";

export const customFetch = async (url: string, options = {}) => {
  const fetchOptions: RequestInit = {
    ...options,
    // cache: "force-cache"
  };

  return fetch(url, fetchOptions);
};

export const getUserProfile = async (accessToken: {}) => {
  try {
    // const session = await verifySession();
    // const accessToken = session.payload;
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
  iterations = 0,
  accessToken: {}
) => {
  try {
    // const session = await verifySession();
    // const accessToken = session.payload;

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

  let promiseArray = [];
  while (!iterations ? offset < total : count < iterations) {
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
    return [...accumulator, ...currentResponse.items];
  }, []);

  return allTopTracks;
};
