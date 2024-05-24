"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";

const collageConfig = {
  red: {
    hueRange: [0, 10],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-red-800", "from-70%", "to-orange-900"],
  },
  orange: {
    hueRange: [11, 36],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-orange-900", "via-amber-600", "via-80%", "to-yellow-600"],
  },
  yellow: {
    hueRange: [37, 80],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-yellow-600", "from-60%", "via-yellow-500", "via-90%", "to-green-600"],
  },
  green: {
    hueRange: [81, 169],
    saturationRange: [23, 100],
    lightnessRange: [15, 80],
    gradient: ["from-green-600", "from-80%", "to-blue-800"],
  },
  blue: {
    hueRange: [170, 260],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-blue-800", "from-60%", "to-violet-800"],
  },
  violet: {
    hueRange: [260, 340],
    saturationRange: [10, 100],
    lightnessRange: [20, 80],
    gradient: ["from-violet-800", "from-60%", "to-black"],
  },
  black: {
    hueRange: [0, 360],
    saturationRange: [0, 10],
    lightnessRange: [0, 10],
    gradient: ["from-black", "from-60%", "to-stone-700"],
  },
  white: {
    hueRange: [0, 360],
    saturationRange: [0, 100],
    lightnessRange: [90, 100],
    gradient: ["from-stone-700", "from-20%", "to-white"],
  },
  // rainbow: {
  //   hueRange: [-1,-1],
  //   saturationRange: [0, 100],
  //   lightnessRange: [80, 100],
  //   gradient: ['from-stone-800','from-20%', 'to-white']
  // }
};

interface Collages {
  [key: string]: ColorTrack[];
}

const Collages = () => {
  const { colorTracks, loading } = useMyContext();
  const [collages, setCollages] = useState<Collages>({} as Collages);

  console.log(collages);

  const groupTracks = useCallback(() => {
    let groups = Object.keys(collageConfig).reduce((acc: Collages, color) => {
      acc[color] = [];
      acc[`${color}Filtered`] = [];
      return acc;
    }, {});

    colorTracks.forEach((track) => {
      if (!track.hsl) return;
      const hue = track.hsl[0];
      const saturation = track.hsl[1];
      const lightness = track.hsl[2];

      (Object.keys(collageConfig) as Array<keyof typeof collageConfig>).forEach((color) => {
        if (hue >= collageConfig[color].hueRange[0] && hue <= collageConfig[color].hueRange[1]) {
          groups[color].push(track);
          if (
            saturation >= collageConfig[color].saturationRange[0] &&
            saturation <= collageConfig[color].saturationRange[1] &&
            lightness >= collageConfig[color].lightnessRange[0] &&
            lightness <= collageConfig[color].lightnessRange[1]
          ) {
            groups[`${color}Filtered`].push(track);
          }
        }
      });
    });

    // (Object.keys(collageConfig) as Array<keyof typeof collageConfig>).forEach((color,index) => {
    //   for(let i=0;i<11;i++){

    //   if(index !== Object.keys(collageConfig).length -1) groups['rainbowFiltered'].push(groups[`${color}Filtered`][i])
    //   }
    // })

    return groups;
  }, [colorTracks]);

  useEffect(() => {
    if (!loading) {
      setCollages(groupTracks());
    }
  }, [loading, groupTracks]);

  const collageInfo = (color: string) => (
    <div className="w-1/2 flex flex-col justify-center items-center">
      <div>
        <p>Top {color} Tracks</p>
        {collages[`${color}Filtered`].slice(0, 8).map((track, index) => {
          return (
            <div key={index}>{index + 1 + " " + track.name + " - " + track.artists[0].name}</div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {Object.keys(collages).length !== 0 &&
        Object.keys(collageConfig).map((color, index) => (
          <div
            className={`snap-center relative h-screen z-30 flex flex-row bg-gradient-to-b ${collageConfig[color as keyof typeof collageConfig].gradient.join(" ")}`}
            key={color}
          >
            {index % 2 === 0 && collageInfo(color)}
            <div className="flex flex-row flex-wrap justify-center w-1/2 items-center ml-auto mr-auto content-center max-w-lg	">
              {collages[`${color}Filtered`].slice(0, 64).map((track) => {
                const image = track.album.images?.[2];
                const name = track.name;
                const artist = track.artists[0].name;
                return (
                  <Tooltip
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
                        },
                      },
                    }}
                  >
                    <Image unoptimized alt={name} width={64} height={64} src={image.url} />
                  </Tooltip>
                );
              })}
            </div>
            {index % 2 !== 0 && collageInfo(color)}
          </div>
        ))}
    </>
  );
};
export default Collages;
