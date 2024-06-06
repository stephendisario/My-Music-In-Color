type User = {
    display_name: string;
    images: ImageObject[]
    id: string;
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
  artists: Artist[];
  duration_ms: number;
  album: Album;
  uri: string;
}

type RGBColor = [number, number, number];
type HSLColor = [number, number, number];

interface ColorTrack extends Track {
  rgb?: RGBColor;
  hsl?: HSLColor;
}


interface Album {
  images: ImageObject[];
  id: string
}

interface Artist {
  id: string;
  name: string;
}

type UniqueImagesMap = { [key: string]: number[] }