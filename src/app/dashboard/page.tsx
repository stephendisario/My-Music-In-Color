"use client";
import React, { Suspense, useEffect, useState } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import ContentWrapper from "./ContentWrapper";
import Welcome from "./Welcome";
import Collage from "../components/Collage";
import { Collages, Colors, collageConfig } from "./Collages";
import { getUniqueImages, removeDuplicatesFromCollage } from "../lib/helper";
import { addColor } from "../lib/colorthief";
import { MyContextProvider, useMyContext } from "../components/ColorContext";
import "../login/login.css";

export const fetchCache = "force-cache";

const Dashboard = () => {
  const { collages, id, loading, loadingColor, loadingTracks, setLoggedIn } = useMyContext();

  const [currentColor, setCurrentColor] = useState<any>("red");
  const [count, setCount] = useState<number>(0);
  const [isToggled, setIsToggled] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Call handleResize once to set the initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const text = "mymusicincolor";
  const repeatedText = Array(100)
    .fill(text)
    .join(!isMobile ? "\u00A0\u00A0\u00A0\u00A0\u00A0" : "\u00A0\u00A0"); // Repeat and join with non-breaking spaces
  const repeatedTextMiddle = Array(100).fill(text).join("\u00A0\u00A0"); // Repeat and join with non-breaking spaces

  useEffect(() => {
    setLoggedIn(true);
  }, []);

  const gradients: any = {
    red: "from-red-500 to-red-800",
    orange: "from-orange-500 to-orange-800",
    yellow: "from-yellow-500 to-yellow-800",
    green: "from-green-500 to-green-800",
    blue: "from-blue-500 to-blue-800",
    violet: "from-violet-500 to-violet-800",
  };

  const stuff = () => (
    <div
      className={`relative h-screen flex flex-col items-center justify-center rainbow-background`}
    >
      <div className="absolute h-screen w-screen text-8xl opacity-50 flex flex-col overflow-hidden text-black">
        <div>
          <div className={`${isMobile ? "mobile-move-text" : "move-text"}`}>{repeatedText}</div>
          <div className={`${isMobile ? "mobile-move-text-far" : "move-text-far"}`}>
            {repeatedText}
          </div>
        </div>

        <div className="mt-auto mb-auto border-top border-2 border-bottom border-white">
          <div className={`text-white text-5xl ${isMobile ? "mobile-move-text-b" : "move-text-b"}`}>
            {repeatedTextMiddle}
          </div>
        </div>

        <div className="">
          <div className={`${isMobile ? "mobile-move-text" : "move-text"}`}>{repeatedText}</div>
          <div className={`${isMobile ? "mobile-move-text-far" : "move-text-far"}`}>
            {repeatedText}
          </div>
        </div>
      </div>
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 z-30 text-center">
        <div>Fetching Tracks {loadingTracks ? "..." : " DONE!"}</div>
        <div>Extracting Colors {loadingColor ? "..." : " DONE!"}</div>
        <div>Generating Collages {loading ? "..." : " DONE!"}</div>
      </div>
    </div>
  );

  return loading ? stuff() : <Collage color="red" index={0} collages={collages} id={id} />;
};
export default Dashboard;
