"use client";
import React from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";

const AllImages = () => {
  const { colorTracks, loading } = useMyContext();

  return (
    <div className={`snap-start relative h-screen flex flex-row overflow-auto`}>
      <div className="flex flex-row flex-wrap justify-center w-full items-center ml-auto mr-auto content-center">
        {colorTracks.map((track) => {
          const image = track.album.images?.[2];
          const name = track.name;
          const artist = track.artists[0].name;
          return (
            <Tooltip
              arrow
              key={track.id}
              sx={{
                '& .MuiTooltip-arrow': {
                    color: 'red', // Change this to your desired color
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
                    }
                }
              }}
            >
              <Image
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
