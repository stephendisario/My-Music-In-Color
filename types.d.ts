declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

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
  external_urls: {
    spotify: string
  }
}

type RGBColor = [number, number, number];
type HSLColor = [number, number, number];

interface ColorTrack extends Track {
  rgb?: RGBColor;
  hsl?: HSLColor;
  base64Url?: string;
}


interface Album {
  images: ImageObject[];
  id: string
}

interface Artist {
  id: string;
  name: string;
}

type UniqueImagesMap = { [key:string]: {
  hsl?: HSLColor, base64Url?: string 
}}

type Colors = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet' | 'black' | 'white';

type ColorsWithOrWithoutDupes = (Colors | "rainbow") | `${Colors | "rainbow"}Displayed`;

type Collages = {
  [key in ColorsWithOrWithoutDupes]: ColorTrack[];
};
