"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Button, Divider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getTerm, shuffle } from "../lib/helper";
import TermTabs from "../components/TermTabs";
import { addTracksToPlaylist, createPlaylist } from "../api/spotify";

export const collageConfig = {
  red: {
    rainbowCount: 12,
    hueRange: [0, 10, 350],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-red-800", "from-70%", "to-orange-900"],
  },
  orange: {
    rainbowCount: 8,
    hueRange: [11, 36],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-orange-900", "via-amber-600", "via-80%", "to-yellow-500"],
  },
  yellow: {
    rainbowCount: 8,
    hueRange: [47, 73],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-yellow-500", "from-70%", "to-zinc-900"],
  },
  green: {
    rainbowCount: 12,
    hueRange: [81, 169],
    saturationRange: [23, 100],
    lightnessRange: [15, 80],
    gradient: ["from-zinc-900", "from-10%", "via-green-600", "via-80%", "to-zinc-900"],
  },
  blue: {
    rainbowCount: 12,
    hueRange: [170, 260],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-zinc-900", "from-10%", "via-80%", "via-blue-800", "to-violet-800"],
  },
  violet: {
    rainbowCount: 12,
    hueRange: [260, 340],
    saturationRange: [10, 100],
    lightnessRange: [20, 80],
    gradient: ["from-violet-800", "from-60%", "to-black"],
  },
  black: {
    rainbowCount: 12,
    hueRange: [0, 360],
    saturationRange: [0, 10],
    lightnessRange: [0, 10],
    gradient: ["from-black", "from-60%", "to-stone-700"],
  },
  white: {
    rainbowCount: 12,
    hueRange: [0, 360],
    saturationRange: [0, 100],
    lightnessRange: [90, 100],
    gradient: ["from-stone-700", "from-20%", "to-white"],
  },
};

export type Colors = keyof typeof collageConfig;
export interface Collages {
  [key: string]: ColorTrack[];
}

const Collages = () => {
  const { collages, setCollages, tabValue, id } = useMyContext();
  const [collageSize, setCollageSize] = useState<number[]>(
    Array(Object.keys(collageConfig).length).fill(0)
  );

  const randomizeCollage = (color: Colors) => {
    const array = shuffle(JSON.parse(JSON.stringify(collages[`${color}Displayed`])));
    setCollages((prevState) => ({
      ...prevState,
      [`${color}Displayed`]: array,
    }));
  };

  const resetCollage = (color: Colors) => {
    setCollages((prevState) => ({
      ...prevState,
      [`${color}Displayed`]: prevState[`${color}Filtered`],
    }));
  };

  const handleCreatePlaylist = async (color: Colors, index: number) => {
    const playlistId = await createPlaylist(color, getTerm(tabValue), id);
    await addTracksToPlaylist(
      playlistId,
      collages[`${color}Displayed`]
        .slice(0, collageSize[index] === 0 ? 64 : 25)
        .map((track) => track.uri)
    );
  };

  const collageInfo = (color: Colors) => (
    <div className="w-1/2 flex flex-col justify-center items-center">
      <h1 className="text-xl text-white">Top {color} Tracks</h1>
      {collages[`${color}Filtered`].slice(0, 8).map((track, index) => {
        const image = track?.album?.images?.[2];
        const name = track?.name;
        const artist = track?.artists?.[0]?.name;
        const lightness = track?.hsl?.[2] || 0;
        return (
          <div
            key={index}
            className="flex flex-row items-center w-2/3"
            style={{
              backgroundColor: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
            }}
          >
            <p
              className={`p-2 ${lightness! >= 50 || (color === "yellow" && lightness! >= 50) ? "text-black" : "text-white"}`}
            >
              {name} - {artist}
            </p>
            <Image
              unoptimized
              alt={name || "empty"}
              width={64}
              height={64}
              src={image?.url || "empty"}
              className="ml-auto"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {Object.keys(collages).length !== 0 &&
        (Object.keys(collageConfig) as Colors[]).map((color, index) => (
          <div
            className={`snap-center relative h-screen flex flex-col bg-gradient-to-b ${collageConfig[color as Colors].gradient.join(" ")}`}
            key={color}
          >
            <TermTabs />
            <div className="flex flex-row grow">
              {index % 2 === 0 && collageInfo(color)}
              <div
                className={`relative w-1/2 flex flex-col justify-center items-center ml-auto mr-auto content-center items-stretch ${collageSize[index] === 1 ? "max-w-xs" : "max-w-lg"}`}
              >
                <div className="flex flex-row justify-center absolute top-0 left-0 right-0 mt-16">
                  <Tabs
                    value={collageSize[index]}
                    onChange={(e, v) =>
                      setCollageSize((prevState) => {
                        const newState = [...prevState];
                        newState[index] = v;
                        return newState;
                      })
                    }
                    aria-label="basic tabs example"
                  >
                    <Tab label="8 x 8" />
                    <Tab label="5 x 5" />
                  </Tabs>
                </div>

                <div className="flex flex-row justify-between">
                  <Button variant="outlined" onClick={() => randomizeCollage(color)}>
                    Randomize
                  </Button>
                  <Button variant="outlined" onClick={() => handleCreatePlaylist(color, index)}>
                    Create Playlist
                  </Button>
                  <Button variant="outlined" onClick={() => resetCollage(color)}>
                    Reset
                  </Button>
                </div>

                <div className="flex flex-row flex-wrap	">
                  {collages[`${color}Displayed`]
                    .slice(0, collageSize[index] === 0 ? 64 : 25)
                    .map((track) => {
                      const image = track.album.images?.[2];
                      const name = track.name;
                      const artist = track.artists[0].name;
                      return (
                        <Tooltip
                          PopperProps={{ disablePortal: true }}
                          key={track.id}
                          arrow
                          title={
                            <div>
                              <h1>{name}</h1>
                              <Divider />
                              <h3>{artist}</h3>
                            </div>
                          }
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
                                color: track?.hsl?.[2] && track?.hsl?.[2] > 50 ? "black" : "white",
                                fontSize: "16px",
                                "& .MuiTooltip-arrow": {
                                  color: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
                                },
                              },
                            },
                          }}
                        >
                          <Image unoptimized alt={name} width={64} height={64} src={image.url} />
                        </Tooltip>
                      );
                    })}
                </div>
              </div>
              {index % 2 !== 0 && collageInfo(color)}
            </div>
          </div>
        ))}
    </>
  );
};
export default Collages;
