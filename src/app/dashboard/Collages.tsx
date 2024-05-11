"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";

const collageConfig = {
  red: {
    hueRange: [0, 10],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  orange: {
    hueRange: [11, 36],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  yellow: {
    hueRange: [37, 80],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  green: {
    hueRange: [81, 169],
    saturationRange: [23, 100],
    lightnessRange: [15, 80],
  },
  blue: {
    hueRange: [170, 320],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  black: {
    hueRange: [0, 360],
    saturationRange: [0, 10],
    lightnessRange: [0, 10],
  },
};

interface Collages {
  [key: string]: ColorTrack[];
}

const Collages = () => {
  const { colorTracks, loading } = useMyContext();
  const [collages, setCollages] = useState<Collages>({} as Collages);

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
    return groups;
  }, [colorTracks]);

  useEffect(() => {
    if (!loading) {
      setCollages(groupTracks());
    }
  }, [loading, groupTracks]);

  return (
    <>
      {Object.keys(collages).length !== 0 &&
        Object.keys(collageConfig).map((color, index) => (
          <div className="snap-center relative h-screen flex flex-row" key={color}>
            {index % 2 === 0 && (
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div>
                  <p>Top {color} Tracks</p>
                  {collages[`${color}Filtered`].slice(0, 8).map((track, index) => {
                    return <div key={index}>{index + 1 + " " + track.name}</div>;
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-row flex-wrap justify-center w-1/2 items-center ml-auto mr-auto content-center max-w-lg	">
              {collages[`${color}Filtered`].slice(0, 64).map((track) => {
                const image = track.album.images?.[2];
                const name = track.name;
                return <Image alt={name} width={64} height={64} src={image.url} key={track.id} />;
              })}
            </div>
            {index % 2 !== 0 && (
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div>
                  <p>Top {color} Tracks</p>
                  {collages[`${color}Filtered`].slice(0, 8).map((track, index) => {
                    return <div key={index}>{index + 1 + " " + track.name}</div>;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  );
};
export default Collages;
