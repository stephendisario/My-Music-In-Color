import React, { Suspense } from "react";
import { getUserProfile } from "../api/spotify";
import Image from "next/image";
import TopTracks from "./topTracks";

const Dashboard = async () => {
  const user = await getUserProfile();

  //get image with highest resolution
  const image = user?.images.reduce((maxHeightObj, currentObj) => {
    return currentObj.height > maxHeightObj.height ? currentObj : maxHeightObj;
  }, user?.images[0]);

  return (
    <main className="flex flex-col items-center p-24">
      <Suspense fallback={<p>Loading User...</p>}>
        <Image alt="profile picture" width={150} height={150} src={image?.url || ""} />
        <p>Wasup {user?.display_name}</p>
      </Suspense>
      <Suspense fallback={<p>Loading Top Tracks...</p>}>
        <TopTracks />
      </Suspense>
    </main>
  );
};
export default Dashboard;
