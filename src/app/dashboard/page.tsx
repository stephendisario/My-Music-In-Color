import React, { Suspense } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";
import { MyContextProvider } from "../components/ColorContext";
import { unstable_noStore as noStore } from "next/cache";

const Dashboard = async () => {
  const user = await getUserProfile();
  const loadingTracks = await getTopTracks("short_term", 1);
  const topTracks = await getTopTracks("long_term");
  noStore()

  return (
    <MyContextProvider initialValue={topTracks!}>
      <div className="snap-y snap-mandatory snap-always	h-screen overflow-scroll">
        <Welcome user={user!} loadingTracks={loadingTracks!} />
        <ContentWrapper />
      </div>
    </MyContextProvider>
  );
};
export default Dashboard;
