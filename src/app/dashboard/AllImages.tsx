"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";
import { HuePicker } from "react-color";
import { binarySearch } from "../lib/helper";

const AllImages = () => {
const { colorTracks, sortedColorTracks, loading } = useMyContext();
const [huePickerColor, setHuePickerColor] = useState({ h: 0, s: 0, l: 0 });
const [colorTrackSlice, setColorTrackSlice] = useState<ColorTrack[]>([])

function findHueRange( target: number, range: number): ColorTrack[] {
    const lowBound = target - range;
    const highBound = target + range;

    const startIdx = binarySearch(sortedColorTracks, lowBound);
    const endIdx = binarySearch(sortedColorTracks, highBound + 1);

    return sortedColorTracks.slice(startIdx, endIdx);
    }

    useEffect(() => {
    if(!loading) setColorTrackSlice(findHueRange(huePickerColor.h, 10))
    }, [huePickerColor, loading])

    

  return (
    <div className={`snap-start relative h-screen overflow-auto`}>
      <div className="sticky inset-x-0 top-0 z-20 flex justify-center mt-8">
        <div className="bg-gray-800 text-white rounded-md p-4 shadow-md">
          {" "}
          <HuePicker
            color={huePickerColor}
            onChange={(color) => {
              setHuePickerColor(color.hsl);
            }}
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center w-full ml-auto mr-auto">
        {colorTracks
          .filter((track) => Math.abs(track.hsl?.[0]! - huePickerColor.h) <= 10)
          .map((track) => {
            const image = track.album.images?.[2];
            const name = track.name;
            const artist = track.artists[0].name;
            return (
              <Tooltip
                arrow
                key={track.id}
                sx={{
                  "& .MuiTooltip-arrow": {
                    color: "red", // Change this to your desired color
                  },
                }}
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
                    },
                  },
                  arrow: {
                    color: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
                    sx: {
                      // bgcolor: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
                    },
                  },
                }}
              >
                <Image alt={name} width={64} height={64} src={image.url} className="z-10" />
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
};
export default AllImages;
