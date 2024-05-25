"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";
import { HuePicker } from "react-color";
import { binarySearch } from "../lib/helper";

const AllImages = () => {
  const { sortedColorTracks, loading } = useMyContext();
  const [huePickerColor, setHuePickerColor] = useState({ h: 0, s: 100, l: 50 });
  const [colorTrackSlice, setColorTrackSlice] = useState<ColorTrack[]>([]);

  function findHueRange(target: number, range: number): ColorTrack[] {
    const lowBound = target - range;
    const highBound = target + range;

    const startIdx = binarySearch(sortedColorTracks, lowBound);
    const endIdx = binarySearch(sortedColorTracks, highBound + 1);

    return sortedColorTracks.slice(startIdx, endIdx);
  }

  useEffect(() => {
    if (!loading) {
      const tracksInHueRange = findHueRange(huePickerColor.h, 10);
      const vibrantTracks = tracksInHueRange.filter(
        (track) => track.hsl?.[1]! > 50 && track.hsl?.[2]! > 20 && track.hsl?.[2]! < 80
      );
      setColorTrackSlice(vibrantTracks);
    }
  }, [huePickerColor, loading]);

  console.log(huePickerColor);
  return (
    <div
      className={`snap-start relative h-screen overflow-auto`}
      style={{
        background: `linear-gradient(to bottom, hsl(${huePickerColor.h}, ${huePickerColor.s}%, ${huePickerColor.l}%), #000000)`,
      }}
    >
      <div className="sticky inset-x-0 top-0 z-20 flex justify-center">
        <div className="p-4">
          {" "}
          <HuePicker
            color={huePickerColor}
            onChange={(color) => {
              setHuePickerColor({ h: color.hsl.h, s: color.hsl.s * 100, l: color.hsl.l * 100 });
            }}
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center w-full ml-auto mr-auto">
        {colorTrackSlice.map((track) => {
          const image = track.album.images?.[2];
          const name = track.name;
          const artist = track.artists[0].name;
          return (
            <Tooltip
              PopperProps={{ disablePortal: true }}
              arrow
              key={track.id}
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
              <Image
                unoptimized
                alt={name}
                width={64}
                height={64}
                src={image.url}
                className="z-10"
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
export default AllImages;
