import React, { Suspense } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";

const Dashboard = async () => {
  const user = await getUserProfile();
  const loadingTracks = await getTopTracks("short_term", 1);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-scroll">
      <Suspense fallback={<p>Loading User...</p>}>
        {user && loadingTracks && <Welcome user={user} loadingTracks={loadingTracks} />}
      </Suspense>
      <Suspense>
        <ContentWrapper />
      </Suspense>
    </div>
  );
};
export default Dashboard;
