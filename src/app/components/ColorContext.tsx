"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";
import { getUniqueImages } from "../lib/helper";
import { Collages, Colors, collageConfig } from "../dashboard/Collages";

interface MyContextType {
  colorTracks: ColorTrack[];
  sortedColorTracks: ColorTrack[];
  collages: Collages;
  setCollages: React.Dispatch<React.SetStateAction<Collages>>;
  loading: boolean;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

interface MyContextProviderProps {
  initialValue: Track[];
  children: React.ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ initialValue, children }) => {
  const [colorTracks, setColorTracks] = useState<ColorTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedColorTracks, setSortedColorTracks] = useState<ColorTrack[]>([]);
  const [collages, setCollages] = useState<Collages>({} as Collages);

  const groupTracks = (colorTracks: ColorTrack[]) => {
    let groups = (Object.keys(collageConfig) as Colors[]).reduce((acc: Collages, color) => {
      acc[color] = [];
      acc[`${color}Filtered`] = [];
      acc[`${color}Displayed`] = [];
      return acc;
    }, {});

    colorTracks.forEach((track) => {
      if (!track.hsl) return;
      const hue = track.hsl[0];
      const saturation = track.hsl[1];
      const lightness = track.hsl[2];

      (Object.keys(collageConfig) as Colors[]).forEach((color) => {
        if (
          (hue >= collageConfig[color].hueRange[0] && hue <= collageConfig[color].hueRange[1]) ||
          (color === "red" && hue >= collageConfig[color].hueRange[2])
        ) {
          groups[color].push(track);
          if (
            saturation >= collageConfig[color].saturationRange[0] &&
            saturation <= collageConfig[color].saturationRange[1] &&
            lightness >= collageConfig[color].lightnessRange[0] &&
            lightness <= collageConfig[color].lightnessRange[1]
          ) {
            groups[`${color}Filtered`].push(track);
            groups[`${color}Displayed`].push(track);
          }
        }
      });
    });

    return groups;
  };

  useEffect(() => {
    const injectColor = async () => {
      const uniqueImagesMapEmpty = getUniqueImages(initialValue);
      const uniqueImagesMapFilled = await addColor(uniqueImagesMapEmpty);

      const fillTracksWithColor: ColorTrack[] = initialValue.map((track) => {
        const url = track.album.images?.[2].url;
        if (!url) return track;
        else return { ...track, hsl: uniqueImagesMapFilled[url] } as ColorTrack;
      });

      const deepCopy: ColorTrack[] = JSON.parse(JSON.stringify(fillTracksWithColor));

      const sorted = deepCopy.sort((a, b) => {
        if (a.hsl === undefined) return 1;
        if (b.hsl === undefined) return -1;
        return a.hsl[0] - b.hsl[0];
      });

      const groups = groupTracks(fillTracksWithColor);

      setCollages(groups);
      setColorTracks(fillTracksWithColor);
      setSortedColorTracks(sorted);
      setLoading(false);
    };

    if (initialValue) injectColor();
  }, [initialValue]);

  return (
    <MyContext.Provider value={{ colorTracks, sortedColorTracks, collages, setCollages, loading }}>
      {children}
    </MyContext.Provider>
  );
};
