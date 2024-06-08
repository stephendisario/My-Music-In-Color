import React from "react";
import Collages from "./Collages";
import AllImages from "./AllImages";
import PieChart from "./PieChart";
import { MyContextProvider } from "../components/ColorContext";
import RainbowCollage from "./RainbowCollage";
import { getTopTracks, getUserProfile } from "../api/spotify";

const ContentWrapper = async () => {
  const topLongTracks = await getTopTracks("long_term");
  const user = await getUserProfile();

  return (
    <MyContextProvider longTermTracks={topLongTracks!} id={user!.id}>
      {/* <PieChart /> */}
      <RainbowCollage />
      <Collages />
      <AllImages />
    </MyContextProvider>
  );
};
export default ContentWrapper;
