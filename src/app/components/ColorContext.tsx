"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";
import { getBase64ColorImage, getUniqueImages, removeDuplicatesFromCollage } from "../lib/helper";
import { Collages, Colors, collageConfig } from "../dashboard/Collages";
import TermTabs from "./TermTabs";
import { getTopTracks } from "../api/spotify";

interface MyContextType {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  sortedColorTracks: ColorTrack[];
  collages: Collages;
  setCollages: React.Dispatch<React.SetStateAction<Collages>>;
  loading: boolean;
  long: Collages;
  medium: Collages;
  short: Collages;
  id: string;
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
  longTermTracks: Track[];
  children: React.ReactNode;
  id: string;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({
  longTermTracks,
  id,
  children,
}) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedColorTracks, setSortedColorTracks] = useState<ColorTrack[]>([]);
  const [collages, setCollages] = useState<Collages>({} as Collages);
  const [long, setLong] = useState<Collages>({} as Collages);
  const [medium, setMedium] = useState<Collages>({} as Collages);
  const [short, setShort] = useState<Collages>({} as Collages);

  const injectColor = async (tracks: Track[], term: "long_term" | "medium_term" | "short_term") => {
    //TODO: Clean list of incomplete tracks
    const uniqueImagesMapEmpty = getUniqueImages(tracks);
    const uniqueImagesMapFilled = await addColor(uniqueImagesMapEmpty);

    const fillTracksWithColor: ColorTrack[] = tracks.map((track) => {
      const url = track?.album?.images?.[2]?.url;
      if (!url) return track;

      const imgData = uniqueImagesMapFilled[url];
      return { ...track, ...{ hsl: imgData.hsl, base64Url: imgData.base64Url } } as ColorTrack;
    });

    const deepCopy: ColorTrack[] = JSON.parse(JSON.stringify(fillTracksWithColor));

    const sorted = deepCopy.sort((a, b) => {
      if (a.hsl === undefined) return 1;
      if (b.hsl === undefined) return -1;
      return a.hsl[0] - b.hsl[0];
    });

    const groups = groupTracks(fillTracksWithColor);

    if (term === "long_term") {
      setCollages(groups);
      setSortedColorTracks(sorted);
      setLoading(false);
      setLong(groups);
    } else if (term === "medium_term") {
      setMedium(groups);
    } else if (term === "short_term") {
      setShort(groups);
    }
  };

  const groupTracks = (colorTracks: ColorTrack[]) => {
    let groups = (Object.keys(collageConfig) as Colors[]).reduce((acc: Collages, color) => {
      acc[color] = [];
      acc[`${color}WithoutDupes`] = [];
      return acc;
    }, {} as Collages);

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
          if (
            saturation >= collageConfig[color].saturationRange[0] &&
            saturation <= collageConfig[color].saturationRange[1] &&
            lightness >= collageConfig[color].lightnessRange[0] &&
            lightness <= collageConfig[color].lightnessRange[1]
          ) {
            groups[color].push(track);
          }
        }
      });
    });

    (Object.keys(collageConfig) as Colors[]).forEach((color) => {
      groups[`${color}WithoutDupes`] = removeDuplicatesFromCollage(groups[color]);
    });

    return groups;
  };

  useEffect(() => {
    injectColor(longTermTracks, "long_term");
  }, []);

  const injections = async () => {
    const topMediumTracks = await getTopTracks("medium_term");
    const topShortTracks = await getTopTracks("short_term");
    injectColor(topMediumTracks!, "medium_term");
    injectColor(topShortTracks!, "short_term");
  };

  // useEffect(() => {
  //   if (!loading) injections();
  // }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MyContext.Provider
      value={{
        tabValue,
        setTabValue,
        sortedColorTracks,
        collages,
        setCollages,
        loading,
        long,
        medium,
        short,
        id,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
