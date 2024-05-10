import { SPOTIFY_API_BASE_URL } from "../lib/constants";
import { verifySession } from "../lib/dal";

export const customFetch = async (url: string, options = {}) => {
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

export const getTopTracks = async (
  time_range: "short_term" | "medium_term" | "long_term",
  iterations = 0
) => {
  try {
    console.log(time_range, iterations, "1");
    const session = await verifySession();
    const accessToken = session.payload;
    return await fetchWithOffset<Track>(
      `${SPOTIFY_API_BASE_URL}/v1/me/top/tracks`,
      accessToken.toString(),
      50,
      time_range,
      iterations
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
  iterations = 0
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
    },
    artists: {
      id: true,
      name: true,
    },
  };

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
  while (!iterations ? offset < 10000 : offset < 50) {
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
    console.log(count);
  }

  const responses = await Promise.all(promiseArray);

  const allTopTracks = responses.reduce((accumulator, currentResponse) => {
    return [...accumulator, ...currentResponse.items];
  }, []);

  return allTopTracks;

  // do {
  //   const response = await customFetch(
  //     `${url}?limit=${limit}&offset=${offset}&time_range=${timeRange}&fields=next,items(${fieldsString})`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   data = await response.json();

  //   if (!response.ok) {
  //     throw new Error(JSON.stringify(response));
  //   }

  //   // const strippedData = data.items.map((track) => extractRequiredFields(track));

  //   allItems = allItems.concat(data.items);
  //   offset = offset + limit;
  //   count = count + 1;
  //   console.log(count)
  // } while (!iterations ? data.next : count < iterations);

  // return allItems;
};

// const extractRequiredFields = (track: any): any => {
//   return {
//     id: track.id,
//     name: track.name,
//     album: {
//       images: track.album.images,
//     },
//     artists: track.artists.map((artist: any) => ({
//       id: artist.id,
//       name: artist.name,
//     })),
//   };
// };
