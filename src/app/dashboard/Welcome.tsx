"use client";
import React, { Suspense, useEffect, useState } from "react";
import { getTopTracks, getUserProfile } from "../api/spotify";
import Image from "next/image";
import TopTracks from "./ContentWrapper";
import "./styles.css";
import { generateRandomNumber } from "../lib/helper";

interface WelcomeProps {
  user: User;
  loadingTracks: Track[];
}

const Welcome: React.FC<WelcomeProps> = ({ user, loadingTracks }) => {
  const [userClient, setUserClient] = useState(user);
  const [loadingTracksClient, setLoadingTracksClient] = useState(loadingTracks);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the counter to force a rerender
      setCounter((prevCounter) => prevCounter + 1);
    }, 15000); // Rerender every 10 seconds (10000 milliseconds)

    // Cleanup function to clear the interval if the component unmounts or the effect is re-executed
    return () => clearInterval(intervalId);
  }, []); // Empty dependency ar

  console.log("render");

  return (
    <div className="snap-center relative h-screen">
      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full z-10">
        {/* Other content */}
        <div className="container mx-auto py-16">
          {/* Your main content goes here */}
          <h1 className="text-4xl font-bold mb-4">Welcome, {userClient.display_name}</h1>
          <p className="text-lg">Loading your Color Profile... {counter}</p>
        </div>
      </div>

      {/* Floating Images */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-x-hidden">
        {loadingTracksClient.map((track, index) => {
          return (
            <Image
              alt="index"
              width={150}
              height={150}
              src={track.album.images[0].url}
              className="floating-image duration-[2500ms]"
              style={{
                left: `${generateRandomNumber()}%`,
                top: `${index % 2 === 0 ? generateRandomNumber() : generateRandomNumber() + 100}%`,
              }}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Welcome;
