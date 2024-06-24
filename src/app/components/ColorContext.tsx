"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";
import { getBase64ColorImage, getUniqueImages, removeDuplicatesFromCollage } from "../lib/helper";
import { Collages, Colors, collageConfig } from "../dashboard/Collages";
import TermTabs from "./TermTabs";
import { getTopTracks, getUserProfile } from "../api/spotify";

interface MyContextType {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  sortedColorTracks: ColorTrack[];
  collages: Collages;
  setCollages: React.Dispatch<React.SetStateAction<Collages>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadingColor: boolean;
  loadingTracks: boolean;
  id: string;
  name: string;

  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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
  children: React.ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedColorTracks, setSortedColorTracks] = useState<ColorTrack[]>([]);
  const [collages, setCollages] = useState<Collages>({} as Collages);
  const [long, setLong] = useState<Collages>({} as Collages);
  const [medium, setMedium] = useState<Collages>({} as Collages);
  const [short, setShort] = useState<Collages>({} as Collages);
  const [loadingColor, setLoadingColor] = useState<boolean>(true);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const injectColor = async (tracks: Track[]) => {
    //TODO: Clean list of incomplete tracks
    const uniqueImagesMapEmpty = getUniqueImages(tracks);
    const uniqueImagesMapFilled = await addColor(uniqueImagesMapEmpty);
    setLoadingColor(false);

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

    setCollages(groups);
    setLoadingColor(false);
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
    const test = async () => {
      const user = await getUserProfile();
      setId(user?.id!);
      setName(user?.display_name!);
      const totalTracks: any = await getTopTracks("long_term", 1);
      const poo: any = await getTopTracks("long_term");
      if (poo) injectColor(poo.tracks);
      setLoadingTracks(false);
      console.log(poo);
    };
    if (loggedIn) test();
  }, [loggedIn]);

  useEffect(() => {
    if (!loadingColor)
      setTimeout(() => {
        setLoading(false);
      }, 3000);
  }, [loadingColor]);

  return (
    <MyContext.Provider
      value={{
        tabValue,
        setTabValue,
        sortedColorTracks,
        collages,
        setCollages,
        loading,
        setLoading,
        loadingColor,
        loadingTracks,
        id,
        setLoggedIn,
        name,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
