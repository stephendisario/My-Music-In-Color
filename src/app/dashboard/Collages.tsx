"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";

const colors: ["red", "orange", "yellow", "green", "blue"] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
];

const defaults = {
  Red: {
    hueRange: [0, 10],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  Orange: {
    hueRange: [11, 36],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  Yellow: {
    hueRange: [37, 80],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  Green: {
    hueRange: [81, 169],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
  Blue: {
    hueRange: [170, 320],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
  },
};

type Collages = {
  raw: {
    red: ColorTrack[];
    orange: ColorTrack[];
    yellow: ColorTrack[];
    green: ColorTrack[];
    blue: ColorTrack[];
  };
  filtered: {
    red: ColorTrack[];
    orange: ColorTrack[];
    yellow: ColorTrack[];
    green: ColorTrack[];
    blue: ColorTrack[];
  };
};

const Collages = () => {
  const { colorTracks, loading } = useMyContext();

  const [collages, setCollages] = useState<Collages>({} as Collages);

  console.log(collages);

  const groupTracks = () => {
    let red: ColorTrack[] = [];
    let orange: ColorTrack[] = [];
    let yellow: ColorTrack[] = [];
    let green: ColorTrack[] = [];
    let blue: ColorTrack[] = [];

    let redFiltered: ColorTrack[] = [];
    let orangeFiltered: ColorTrack[] = [];
    let yellowFiltered: ColorTrack[] = [];
    let greenFiltered: ColorTrack[] = [];
    let blueFiltered: ColorTrack[] = [];

    colorTracks.forEach((track) => {
      if (!track.hsl) return;
      const hue = track.hsl[0];
      const saturation = track.hsl[1];
      const lightness = track.hsl[2];
      if (hue >= defaults.Red.hueRange[0] && hue <= defaults.Red.hueRange[1]) {
        red.push(track);
        if (
          saturation >= defaults.Red.saturationRange[0] &&
          saturation <= defaults.Red.saturationRange[1] &&
          lightness >= defaults.Red.lightnessRange[0] &&
          lightness <= defaults.Red.lightnessRange[1]
        )
          redFiltered.push(track);
      }
      if (hue >= defaults.Orange.hueRange[0] && hue <= defaults.Orange.hueRange[1]) {
        orange.push(track);
        if (
          saturation >= defaults.Orange.saturationRange[0] &&
          saturation <= defaults.Orange.saturationRange[1] &&
          lightness >= defaults.Orange.lightnessRange[0] &&
          lightness <= defaults.Orange.lightnessRange[1]
        )
          orangeFiltered.push(track);
      }
      if (hue >= defaults.Yellow.hueRange[0] && hue <= defaults.Yellow.hueRange[1]) {
        yellow.push(track);
        if (
          saturation >= defaults.Yellow.saturationRange[0] &&
          saturation <= defaults.Yellow.saturationRange[1] &&
          lightness >= defaults.Yellow.lightnessRange[0] &&
          lightness <= defaults.Yellow.lightnessRange[1]
        )
          yellowFiltered.push(track);
      }
      if (hue >= defaults.Green.hueRange[0] && hue <= defaults.Green.hueRange[1]) {
        green.push(track);
        if (
          saturation >= defaults.Green.saturationRange[0] &&
          saturation <= defaults.Green.saturationRange[1] &&
          lightness >= defaults.Green.lightnessRange[0] &&
          lightness <= defaults.Green.lightnessRange[1]
        )
          greenFiltered.push(track);
      }
      if (hue >= defaults.Blue.hueRange[0] && hue <= defaults.Blue.hueRange[1]) {
        blue.push(track);
        if (
          saturation >= defaults.Blue.saturationRange[0] &&
          saturation <= defaults.Blue.saturationRange[1] &&
          lightness >= defaults.Blue.lightnessRange[0] &&
          lightness <= defaults.Blue.lightnessRange[1]
        )
          blueFiltered.push(track);
      }
    });

    return {
      raw: {
        red,
        orange,
        yellow,
        green,
        blue,
      },
      filtered: {
        red: redFiltered,
        orange: orangeFiltered,
        yellow: yellowFiltered,
        green: greenFiltered,
        blue: blueFiltered,
      },
    };
  };

  useEffect(() => {
    if (!loading) {
      setCollages(groupTracks());
    }
  }, [loading]);

  return (
    <>
      {Object.keys(collages).length !== 0 &&
        colors.map((color, index) => (
          <div className="snap-center relative h-screen flex flex-row" key={color}>
            {index % 2 === 0 && (
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div>
                  <p>Top {color} Tracks</p>
                  {collages.filtered[color].slice(0, 8).map((track, index) => {
                    return <div key={index}>{index + 1 + " " + track.name}</div>;
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-row flex-wrap justify-center w-1/2 items-center ml-auto mr-auto content-center max-w-lg	">
              {collages.filtered[color].slice(0, 64).map((track) => {
                const images = track.album.images;
                const name = track.name;
                const image = images.reduce((maxHeightObj, currentObj) => {
                  return currentObj.height < maxHeightObj.height ? currentObj : maxHeightObj;
                }, images[0]);

                return <Image alt={name} width={64} height={64} src={image.url} key={track.id} />;
              })}
            </div>
            {index % 2 !== 0 && (
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div>
                  <p>Top {color} Tracks</p>
                  {collages.filtered[color].slice(0, 8).map((track, index) => {
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
