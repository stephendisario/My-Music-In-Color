import React from "react";
import { getTopTracks } from "../api/spotify";

const TopTracks = async () => {
  const topTracks = await getTopTracks("short_term");

  return <p>top track: {topTracks?.[0].name}</p>;
};
export default TopTracks;
