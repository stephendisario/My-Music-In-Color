"use client";
import React, { useEffect, useRef, useState } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";
import { Button } from "@mui/material";
import NavBar from "../components/NavBar";
import MovingText from "../components/MovingText";
import SpotifyLogo from "../components/SpotifyLogo";

const Login = () => {
  const codeVerifier = generateRandomString(64);

  useEffect(() => {
    localStorage.setItem("codeVerifier", codeVerifier);
    const test = localStorage.getItem("colorMap");
    const obj = test ? JSON.parse(test) : undefined;
    if (obj) console.log("localstore size", Object.keys(obj).length);
  }, [codeVerifier]);

  return (
    <div className="flex flex-col relative h-[calc(100dvh)] sm:h-screen justify-center items-center rainbow-background">
      <div className="absolute top-0 left-0 w-full h-full">
        <NavBar showLogout={false} />
      </div>
      {/* <MovingText /> */}
      <div className="absolute top-[25%] translate-y-[-50%] flex flex-col">
        <p className="text-5xl sm:text-8xl">mymusicincolor</p>
        <p className="text-lg sm:text-3xl opacity-90 mt-1">explore the colors of your music</p>
      </div>
      <button
        className=" text-white border-2 border-white rounded-full text-3xl hover:bg-[rgba(0,0,0,.1)] z-30 py-3 px-4 sm:px-12"
        onClick={() => login(codeVerifier)}
      >
        log in with Spotify
      </button>
    </div>
  );
};

export default Login;
