"use client";
import React, { Suspense, useEffect, useState } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";
import Collage from "../components/Collage";
import { Collages, Colors, collageConfig } from "./Collages";
import { getUniqueImages, removeDuplicatesFromCollage } from "../lib/helper";
import { addColor } from "../lib/colorthief";
import { MyContextProvider, useMyContext } from "../components/ColorContext";
import MovingText from "../components/MovingText";

export const fetchCache = "force-cache";

const Dashboard = () => {
  const { collages, id, loading, loadingColor, loadingTracks, setLoggedIn, totalTracks } = useMyContext();

  useEffect(() => {
    setLoggedIn(true);
  }, []);

  const stuff = () => (
    <div
      className={`relative h-screen flex flex-col items-center justify-center rainbow-background`}
    >
      <MovingText />
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 z-30 text-center">
        <div>Fetching {totalTracks} Tracks {loadingTracks ? "..." : " DONE!"}</div>
        <div>Extracting Colors {loadingColor ? "..." : " DONE!"}</div>
        <div>Generating Collages {loading ? "..." : " DONE!"}</div>
      </div>
    </div>
  );

  return loading ? stuff() : <Collage color="red" index={0} collages={collages} id={id} />;
};
export default Dashboard;
