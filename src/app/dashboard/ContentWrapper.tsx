import React from "react";
import { getTopTracks } from "../api/spotify";
import { MyContextProvider } from "../components/ColorContext";
import Collages from "./Collages";
import AllImages from "./AllImages";

const ContentWrapper = async () => {
  const topTracks = await getTopTracks("long_term");

  return (
    topTracks && (
      <MyContextProvider initialValue={topTracks}>
        <Collages />
        <AllImages />
      </MyContextProvider>
    )
  );
};
export default ContentWrapper;
