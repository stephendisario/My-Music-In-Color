export const clientId = "53e53a540f804d048a8f6fc2c653ee0e";
export const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/callback";
export const authorizationEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";
export const scope =
  "user-read-private user-read-email playlist-read-private user-library-read user-top-read";
export const SPOTIFY_API_BASE_URL = "https://api.spotify.com";
