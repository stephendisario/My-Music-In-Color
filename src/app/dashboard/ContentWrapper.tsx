import React from "react";
import { getTopTracks } from "../api/spotify";
import { MyContextProvider } from "../components/ColorContext";
import Collages from "./Collages";

const ContentWrapper = async () => {
  const topTracks = await getTopTracks("medium_term");

  return (
    topTracks && (
      <MyContextProvider initialValue={topTracks}>
        <Collages />
      </MyContextProvider>
    )
  );
};
export default ContentWrapper;
