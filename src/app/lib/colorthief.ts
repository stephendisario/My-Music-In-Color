"use client";
// @ts-ignore
import ColorThief from "colorthief";
import { getBase64ColorImage, rgbToHsl } from "./helper";

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
        if (
          localUniqueImageMap &&
          localUniqueImageMap[url]?.base64Url &&
          localUniqueImageMap[url]?.hsl
        ) {
          unqieImagesMap[url] = localUniqueImageMap[url];
          resolve();
        } else {
          let image = new Image();

          image.onload = async () => {
            const rgb = colorThief.getColor(image, 1);
            const hsl = rgbToHsl(rgb);
            const base64Url = getBase64ColorImage(hsl);

            const imageData = {
              hsl,
              base64Url,
            };
            unqieImagesMap[url] = imageData;
            //add unseen images to local
            addToLocalImageMap[url] = imageData;
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
