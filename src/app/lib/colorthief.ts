"use client";
// @ts-ignore
import ColorThief from "colorthief";
import { rgbToHsl } from "./helper";

const colorThief = new ColorThief();

export const addColor = async (tracks: Track[]): Promise<ColorTrack[]> => {
  const newColorMap: Record<string, HSLColor> = {};

  const colorMap = localStorage.getItem("colorMap");

  let colorTracks: ColorTrack[];

  if (!colorMap) {
    colorTracks = await Promise.all(
      tracks.map(async (track) => {
        const url = track.album.images[2].url;

        return new Promise((resolve, reject) => {
          if (!url) {
            //TODO: CLEAN THIS UP
            resolve({ ...track, hsl: [0, 0, 0] });
          }

          let image = new Image();

          image.src = url;
          image.crossOrigin = "Anonymous";

          image.onload = async () => {
            const rgb = colorThief.getColor(image);
            const hsl = rgbToHsl(rgb);
            newColorMap[url] = hsl;
            resolve({ ...track, hsl });
          };
        });
      })
    );

    localStorage.setItem("colorMap", JSON.stringify(newColorMap));
  } else {
    const map = JSON.parse(colorMap);
    colorTracks = tracks.map((track) => ({
      ...track,
      hsl: map[track.album.images[2].url],
    }));
  }

  return colorTracks;
};
