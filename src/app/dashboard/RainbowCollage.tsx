"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Button, Divider } from "@mui/material";
import { Colors, collageConfig } from "./Collages";

const RainbowCollage = () => {
  const { collages } = useMyContext();
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  //   const [blackAndWhiteCollage, setBlackAndWhiteCollage] = useState<ColorTrack[]>([]);

  console.log(collages);

  const getRainbowCollage = (random: boolean) => {
    let rainbowArray: ColorTrack[] = [];

    (Object.keys(collageConfig) as Colors[]).forEach((color) => {
      if (color === "black" || color === "white") return;
      for (let i = 0; i < collageConfig[color].rainbowCount; i++) {
        //TODO: clean this up
        if (collages[`${color}Displayed`].length <= collageConfig[color].rainbowCount)
          random = false;
        let index = random
          ? Math.floor(Math.random() * (collages[`${color}Displayed`].length - 1))
          : i;
        while (random && rainbowArray.includes(collages[`${color}Displayed`][index]))
          index = Math.floor(Math.random() * (collages[`${color}Displayed`].length - 1));
        if (collages[`${color}Displayed`][index])
          rainbowArray.push(collages[`${color}Displayed`][index]);
      }
    });

    return rainbowArray;
  };

  //   const getBlackAndWhiteCollage = () => {
  //     let blackAndWhiteArray: ColorTrack[] = []

  //     for(let i=0; i<32; i++){
  //         blackAndWhiteArray.push(collages['blackFiltered'][i])
  //         blackAndWhiteArray.push(collages['whiteFiltered'][i])
  //     }

  //     console.log(blackAndWhiteArray, collages)

  //     return blackAndWhiteArray
  //   }

  const collageInfo = () => (
    <div className="w-1/2 flex flex-col justify-center items-center">
      <h1 className="text-xl text-white">Your Top Track Rainbow</h1>
      {(Object.keys(collageConfig) as Colors[]).map((color) => {
        const track = collages[`${color}Filtered`][0];
        const image = track?.album?.images?.[2];
        const name = track?.name;
        const artist = track?.artists?.[0]?.name;
        const lightness = track?.hsl?.[2] || 0;
        return (
          <div
            key={color}
            className="flex flex-row items-center w-2/3"
            style={{
              backgroundColor: `hsl(${track?.hsl?.[0]}, ${track?.hsl?.[1]}%, ${track?.hsl?.[2]}%)`,
            }}
          >
            <p
              className={`p-2 ${lightness! > 80 || (color === "yellow" && lightness! >= 50) ? "text-black" : "text-white"}`}
            >
              {name} - {artist}
            </p>
            <img
              alt={name || "empty"}
              width={64}
              height={64}
              src={image?.url || "empty"}
              className="ml-auto"
            />
          </div>
        );
      })}
      {/* {rainbowCollage.slice(0, 8).map((track, index) => {
          return (
            <div key={index}>{index + 1 + " " + track.name + " - " + track.artists[0].name}</div>
          );
        })} */}
    </div>
  );

  const randomizeCollage = () => {
    setRainbowCollage(getRainbowCollage(true));
  };

  const resetCollage = () => {
    setRainbowCollage(getRainbowCollage(false));
  };

  useEffect(() => {
    setRainbowCollage(getRainbowCollage(false));
  }, []);

  return (
    <div
      className={`snap-center relative h-screen flex flex-row bg-gradient-to-b from-black to-stone-300`}
    >
      {collageInfo()}
      <div
        className={`relative w-1/2 flex flex-col justify-center items-center ml-auto mr-auto content-center items-stretch max-w-lg`}
      >
        <div className="flex flex-row justify-between">
          <Button variant="outlined" onClick={() => randomizeCollage()}>
            Randomize
          </Button>
          <Button variant="outlined" onClick={() => resetCollage()}>
            Reset
          </Button>
        </div>

        <div className="flex flex-row flex-wrap	">
          {rainbowCollage.map((track) => {
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
                <img alt={name} width={64} height={64} src={image.url} />
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default RainbowCollage;
