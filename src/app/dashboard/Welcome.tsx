"use client";
import React from "react";
import "./styles.css";
import { logout } from "../actions/auth";
import AnimatedImage from "../components/AnimatedImage";
import InColourBackground from "../components/InColourBackground";
import SpotifyLogo from "../components/SpotifyLogo";
import NavBar from "../components/NavBar";

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
        <NavBar showLogout={true} />
        {/* Other content */}
        <div className="flex w-full h-full flex-col justify-center items-center pb-16">
          {/* Your main content goes here */}
          <h1 className="text-5xl font-bold">Hi {user.display_name.split(" ")[0]}</h1>
          <div className="absolute bottom-0 left-auto pb-3">
            <SpotifyLogo color="white" />
          </div>
          {/* <h3 className="text-xl font-bold mb-4">
            {loading ? "Loading Colors..." : "Colors ready, please scroll"}
          </h3> */}
          {/* <p className="text-lg">Loading your Color Profile...</p> */}
        </div>
      </div>

      {/* Floating Images */}
      <div className="absolute top-0 left-0 w-full h-full overflow-x-hidden">
        {loadingTracks.slice(0, 22).map((track, index) => {
          return <AnimatedImage track={track} key={index} />;
        })}
      </div>
    </div>
  );
};
export default Welcome;
