import { Collages, Colors, collageConfig } from "../dashboard/Collages";

export const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function rgbToHsl(rgb: RGBColor): HSLColor {
  let [r, g, b] = rgb.map((c) => c / 255);

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h: number = 0,
    s: number,
    l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
}

export const getUniqueImages = (tracks: Track[]) => {
  const uniqueImagesMap: UniqueImagesMap = {};
  tracks.forEach((track) => {
    const url = track?.album?.images?.[2]?.url;
    if (!url) {
      console.log(track);
      return;
    }
    if (!uniqueImagesMap[url]) uniqueImagesMap[url] = {};
    return;
  });
  return uniqueImagesMap;
};

export function binarySearch(arr: ColorTrack[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid].hsl![0] < target) {
      low = mid + 1;
    } else if (arr[mid].hsl![0] > target) {
      high = mid - 1;
    } else {
      return mid;
    }
  }

  return low;
}

export function shuffle(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function getTerm(tabValue: number) {
  return tabValue === 0 ? "my last year" : tabValue === 1 ? "my last six months" : "my last month";
}

export const removeDuplicatesFromCollage = (tracks: ColorTrack[]) => {
  const seenIds = new Set<string>();
  return tracks.filter((track) => {
    if (
      seenIds.has(track.album.id) ||
      (seenIds.has(track.artists?.[0]?.name) && seenIds.has(track.name))
    ) {
      return false;
    } else {
      seenIds.add(track.album.id);
      seenIds.add(track.name);
      seenIds.add(track.artists?.[0]?.name);
      return true;
    }
  });
};

export const toHslString = (hsl: HSLColor | undefined) => {
  return hsl ? `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` : "";
};

export const getRainbowCollage = (isHide: boolean, collages: Collages) => {
  let rainbowArray: ColorTrack[] = [];

  (Object.keys(collageConfig) as Colors[]).forEach((color) => {
    const tracks = isHide ? collages[`${color}WithoutDupes`] : collages[color];

    if (color === "black" || color === "white") return;
    for (let i = 0; i < collageConfig[color].rainbowCount; i++) {
      if (tracks[i]) rainbowArray.push(tracks[i]);
    }
  });

  return rainbowArray;
};

export const getBase64ColorImage = (hsl: HSLColor) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx!.fillStyle = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  ctx!.fillRect(0, 0, 1, 1);
  return canvas.toDataURL();
};
