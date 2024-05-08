type User = {
    display_name: string;
    images: ImageObject[]
  }
  
type ImageObject = {
    url: string;
    height: number;
    width: number;
}

interface SpotifyResponse<T> {
  items: T[];
  total: number;
  limit: number;
  next: string | null
}

interface Track {
    id: string;
    name: string;
    artist: string;
    duration_ms: number;
    // Define other properties of a track as needed
  }