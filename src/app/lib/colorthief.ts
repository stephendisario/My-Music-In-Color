"use client";
// @ts-ignore
import ColorThief from "colorthief";
import { rgbToHsl } from "./helper";

const colorThief = new ColorThief();

export const addColor = async (unqieImagesMap: UniqueImagesMap): Promise<UniqueImagesMap> => {
  const colorMap = localStorage.getItem("colorMap");
  const localUniqueImageMap: UniqueImagesMap | undefined = colorMap
    ? JSON.parse(colorMap)
    : undefined;

  const addToLocalImageMap: UniqueImagesMap = {};

  await Promise.all(
    Object.keys(unqieImagesMap).map(async (url) => {
      return new Promise<void>((resolve) => {
        //if users local storage has the image color, use that
        if (localUniqueImageMap && localUniqueImageMap[url]) {
          unqieImagesMap[url] = localUniqueImageMap[url];
          resolve();
        } else {
          let image = new Image();

          image.onload = async () => {
            const rgb = colorThief.getColor(image, 1);
            const hsl = rgbToHsl(rgb);
            unqieImagesMap[url] = hsl;
            //add unseen images to local
            addToLocalImageMap[url] = hsl;
            resolve();
          };

          image.src = url;
          image.crossOrigin = "Anonymous";
        }
      });
    })
  );

  console.log(Object.keys(addToLocalImageMap).length);

  localStorage.setItem(
    "colorMap",
    JSON.stringify({ ...localUniqueImageMap, ...addToLocalImageMap })
  );

  return unqieImagesMap;
};
