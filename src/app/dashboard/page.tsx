import React, { Suspense } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";
import { MyContextProvider } from "../components/ColorContext";

const Dashboard = async () => {
  const user = await getUserProfile();
  const loadingTracks = await getTopTracks("short_term", 1);
  const topTracks = await getTopTracks("long_term");

  return (
    <MyContextProvider initialValue={topTracks!}>
      <div className="snap-y snap-mandatory snap-always	h-screen overflow-scroll">
        <Suspense fallback={<p>Loading User...</p>}>
          {user && loadingTracks && <Welcome user={user} loadingTracks={loadingTracks} />}
        </Suspense>
        <Suspense fallback={<p>Loading Data...</p>}>{topTracks && <ContentWrapper />}</Suspense>
      </div>
    </MyContextProvider>
  );
};
export default Dashboard;
