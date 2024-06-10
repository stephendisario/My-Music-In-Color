"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { Button, Divider } from "@mui/material";
import { Collages, Colors, collageConfig } from "./Collages";
import TermTabs from "../components/TermTabs";
import { addTracksToPlaylist, createPlaylist } from "../api/spotify";
import { getTerm, toHslString } from "../lib/helper";
import CustomTooltip from "../components/CustomTooltip";
import Collage from "../components/Collage";

const RainbowCollage = () => {
  return (
    <div
      className={`snap-center relative h-screen flex flex-col bg-gradient-to-b from-black to-stone-300`}
    >
      <TermTabs color="white" />
      <Collage color="rainbow" index={0} />
    </div>
  );
};
export default RainbowCollage;
