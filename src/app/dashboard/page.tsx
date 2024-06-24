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

export const fetchCache = "force-cache";

const Dashboard = () => {
  const { collages, id, loading, loadingColor, loadingTracks, setLoggedIn } = useMyContext();

  useEffect(() => {
    setLoggedIn(true);
  }, []);

  const stuff = () => (
    <div className={`relative h-screen flex flex-col items-center justify-center`}>
      <div>Fetching Tracks {loadingTracks ? "..." : " DONE!"}</div>
      <div>Extracting Colors {loadingColor ? "..." : " DONE!"}</div>
      <div>Generating Collages {loading ? "..." : " DONE!"}</div>
      <div className="mt-2">This will be animated and fun and look nicer</div>
    </div>
  );

  return loading ? stuff() : <Collage color="red" index={0} collages={collages} id={id} />;
};
export default Dashboard;
