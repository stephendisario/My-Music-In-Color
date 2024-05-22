"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";
import { getUniqueImages } from "../lib/helper";

interface MyContextType {
  colorTracks: ColorTrack[];
  sortedColorTracks: ColorTrack[];
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
  const [sortedColorTracks, setSortedColorTracks] = useState<ColorTrack[]>([])

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

      setColorTracks(fillTracksWithColor);
      setSortedColorTracks(sorted)
      setLoading(false);
    };

    injectColor();
  }, [initialValue]);

  return <MyContext.Provider value={{ colorTracks, sortedColorTracks, loading }}>{children}</MyContext.Provider>;
};
