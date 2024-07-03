"use client";
import React, { useEffect } from "react";
import Collage from "../components/Collage";
import { useMyContext } from "../components/ColorContext";
import MovingText from "../components/MovingText";

export const fetchCache = "force-cache";

const Dashboard = () => {
  const { loading, loadingColor, loadingTracks, setLoggedIn, totalTracks } = useMyContext();

  useEffect(() => {
    setLoggedIn(true);
  }, []);

  const loadingPage = () => (
    <div
      className={`relative h-screen flex flex-col items-center justify-center rainbow-background`}
    >
      <MovingText />
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 z-30 text-center">
        <div>
          Fetching {totalTracks} Tracks {loadingTracks ? "..." : " DONE!"}
        </div>
        <div>Extracting Colors {loadingColor ? "..." : " DONE!"}</div>
        <div>Generating Collages {loading ? "..." : " DONE!"}</div>
      </div>
    </div>
  );

  return loading ? loadingPage() : <Collage />;
};
export default Dashboard;
