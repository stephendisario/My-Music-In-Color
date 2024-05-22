"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./styles.css";
import { generateRandomNumber } from "../lib/helper";
import { logout } from "../actions/auth";
import AnimatedImage from "../components/AnimatedImage";
import BackgroundPizzaGrid from "../components/BackgroundPizzaGrid";
import BackgroundInColour from "../components/BackgroundPizzaGrid";
import TriangleSlice from "../components/BackgroundPizzaGrid";
import InColourBackground from "../components/BackgroundPizzaGrid";

interface WelcomeProps {
  user: User;
  loadingTracks: Track[];
}

const Welcome: React.FC<WelcomeProps> = ({ user, loadingTracks }) => {
  return (
    <div className="snap-center relative h-screen">
      <InColourBackground />
      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <button onClick={() => logout()}>Log Out</button>
        {/* Other content */}
        <div className="flex w-full h-full flex-col justify-center items-center pb-16">
          {/* Your main content goes here */}
          <h1 className="text-5xl font-bold mb-4">Hi {user.display_name.split(" ")[0]}</h1>
          {/* <p className="text-lg">Loading your Color Profile...</p> */}
        </div>
      </div>

      {/* Floating Images */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-x-hidden">
        {loadingTracks.slice(0, 22).map((track, index) => {
          return <AnimatedImage url={track.album.images[0].url} key={index} />;
        })}
      </div>
    </div>
  );
};
export default Welcome;
