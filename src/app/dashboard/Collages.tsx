"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Button, Divider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getTerm, removeDuplicatesFromCollage, shuffle } from "../lib/helper";
import TermTabs from "../components/TermTabs";
import { addTracksToPlaylist, createPlaylist } from "../api/spotify";
import CustomTooltip from "../components/CustomTooltip";
import Collage from "../components/Collage";

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
    gradient: ["from-orange-900", "via-amber-600", "via-80%", "to-yellow-600"],
  },
  yellow: {
    rainbowCount: 8,
    hueRange: [47, 73],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-yellow-600", "from-70%", "to-zinc-900"],
  },
  green: {
    rainbowCount: 12,
    hueRange: [79, 169],
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

type ColorsWithOrWithoutDupes = Colors | `${Colors}WithoutDupes`;

export type Collages = {
  [key in ColorsWithOrWithoutDupes]: ColorTrack[];
};

const Collages = () => {
  const { loading } = useMyContext();

  return (
    !loading &&
    (Object.keys(collageConfig) as Colors[]).map((color, index) => (
      <div
        className={`p-safe-t p-safe-r p-safe-b p-safe-l snap-start relative h-screen flex flex-col bg-gradient-to-b ${collageConfig[color as Colors].gradient.join(" ")}`}
        key={color}
      >
        <TermTabs color={color === "black" ? "white" : color} />
        <Collage color={color} index={index} />
      </div>
    ))
  );
};
export default Collages;
