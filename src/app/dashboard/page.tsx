import React, { Suspense } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";
import { MyContextProvider } from "../components/ColorContext";
import { cookies } from "next/headers";
import { decrypt } from "../lib/session";
import { redirect } from "next/navigation";
// export const dynamic = "force-dynamic";

const Dashboard = async () => {

  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.payload) {
    redirect("/login");
  }

  const user = await getUserProfile(session.payload);
  const loadingTracks = await getTopTracks("short_term", 1, session.payload);
  const topTracks = await getTopTracks("long_term", 0, session.payload);

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
