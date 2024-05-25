import React from "react";
import { getTopTracks } from "../api/spotify";
import { MyContextProvider } from "../components/ColorContext";
import Collages from "./Collages";
import AllImages from "./AllImages";

const ContentWrapper = async () => {
  return (
    <>
      <Collages />
      <AllImages />
    </>
  );
};
export default ContentWrapper;
