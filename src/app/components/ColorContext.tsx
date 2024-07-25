"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";
import {
  getParams,
  getRainbowCollage,
  getUniqueImages,
  removeDuplicatesFromCollage,
} from "../lib/helper";
import { getTopTracks, getUserProfile } from "../api/spotify";
import { collageConfig } from "../lib/constants";

interface MyContextType {
  collages: Collages;
  setCollages: React.Dispatch<React.SetStateAction<Collages>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadingColor: boolean;
  loadingTracks: boolean;
  id: string;
  name: string;
  totalTracks: number;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
  isMobile: boolean;
  collageParameters: any;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [collages, setCollages] = useState<Collages>({} as Collages);
  const [loadingColor, setLoadingColor] = useState<boolean>(true);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [totalTracks, setTotalTracks] = useState<number>(0);
  const [collageParameters, setCollageParameters] = useState<{
    red: { width: string; size: number };
    orange: { width: string; size: number };
    yellow: { width: string; size: number };
    green: { width: string; size: number };
    blue: { width: string; size: number };
    violet: { width: string; size: number };
    black: { width: string; size: number };
    white: { width: string; size: number };
    rainbow: { width: string; size: number };
  }>();

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Call handleResize once to set the initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    const groups = groupTracks(fillTracksWithColor);

    setCollages(groups);
    setLoadingColor(false);
  };

  const groupTracks = (colorTracks: ColorTrack[]) => {
    let groups = (Object.keys(collageConfig) as Colors[]).reduce((acc: Collages, color) => {
      acc[color] = [];
      acc[`${color}Displayed`] = [];
      return acc;
    }, {} as Collages);

    const colorTracksCleaned = removeDuplicatesFromCollage(colorTracks);

    colorTracksCleaned.forEach((track) => {
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

    let params = {} as any;
    (Object.keys(collageConfig) as Colors[]).forEach((color) => {
      const tracks = groups[color].slice(0, 64);
      params[color] = getParams(tracks.length);
      groups[`${color}Displayed`] = tracks;
    });

    const rainbow = getRainbowCollage(true, groups);

    groups["rainbow"] = rainbow;
    groups["rainbowDisplayed"] = rainbow;

    params["rainbow"] = getParams(rainbow.length);

    setCollageParameters(params);

    return groups;
  };

  useEffect(() => {
    const fetches = async () => {
      const user = await getUserProfile();
      setId(user?.id!);
      setName(user?.display_name!);
      const totalTracks: any = await getTopTracks("long_term", 1);
      setTotalTracks(totalTracks.total);
      const allTracks: any = await getTopTracks("long_term");
      if (allTracks) injectColor(allTracks.tracks);
      setLoadingTracks(false);
      console.log(allTracks);
    };
    if (loggedIn) fetches();
  }, [loggedIn]);

  return (
    <MyContext.Provider
      value={{
        collageParameters,
        collages,
        setCollages,
        loading,
        setLoading,
        loadingColor,
        loadingTracks,
        id,
        setLoggedIn,
        loggedIn,
        name,
        totalTracks,
        isMobile,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
