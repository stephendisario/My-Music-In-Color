import React, { Suspense } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";

export const fetchCache = "force-cache";

const Dashboard = async () => {
  const user = await getUserProfile();
  const loadingTracks = await getTopTracks("short_term", 1);

  return (
    <div className="contents">
      <Welcome user={user!} loadingTracks={loadingTracks!} />
      <Suspense fallback={<div>POOP!</div>}>
        <ContentWrapper />
      </Suspense>
    </div>
  );
};
export default Dashboard;
