"use client";
import React from "react";
import Collages from "./Collages";
import AllImages from "./AllImages";
import PieChart from "./PieChart";
import { MyContextProvider, useMyContext } from "../components/ColorContext";
import RainbowCollage from "./RainbowCollage";
import { getTopTracks, getUserProfile } from "../api/spotify";
import Collage from "../components/Collage";

const ContentWrapper = () => {
  const { collages, id, loading, loadingColor, loadingTracks } = useMyContext();

  const stuff = () => (
    <div className={`relative h-screen flex flex-col items-center justify-center`}>
      <div>Fetching Tracks {loadingTracks ? "..." : " DONE!"}</div>
      <div>Extracting Colors {loadingColor ? "..." : " DONE!"}</div>
      <div>Generating Collages {loading ? "..." : " DONE!"}</div>
    </div>
  );

  return loading ? stuff() : <Collage color="red" index={0} collages={collages} id={id} />;
};
export default ContentWrapper;
