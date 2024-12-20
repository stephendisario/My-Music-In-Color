"use client";
import React, { useEffect } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";
import NavBar from "../components/NavBar";
import { useMyContext } from "../components/ColorContext";

const Login = () => {
  const codeVerifier = generateRandomString(64);

  const { setLoggedIn } = useMyContext();

  useEffect(() => {
    setLoggedIn(false);
    localStorage.setItem("codeVerifier", codeVerifier);
    const test = localStorage.getItem("colorMap");
    const obj = test ? JSON.parse(test) : undefined;
    if (obj) console.log("localstore size", Object.keys(obj).length);
  }, [codeVerifier]);

  return (
    <div className="flex flex-col relative h-[calc(100dvh)] sm:h-screen justify-center items-center rainbow-background">
      <div className="absolute top-0 left-0 w-full h-full">
        <NavBar />
      </div>
      <div className="absolute top-[33%] translate-y-[-50%] flex flex-col">
        <p className="text-5xl sm:text-8xl">mymusicincolor</p>
        <p className="text-lg sm:text-3xl opacity-90 mt-1 text-center">
          explore your colorful musaics
        </p>
      </div>
      <button
        className="absolute top-[66%] translate-y-[-50%] bg-white text-black mix-blend-lighten active:bg-[rgba(255,255,255,.8)] sm:hover:bg-[rgba(255,255,255,.8)] rounded-full text-3xl z-30 py-3 px-8 sm:px-12"
        onClick={() => login(codeVerifier)}
      >
        log in with Spotify
      </button>
      <p className="absolute top-[72%] text-lg opacity-90 text-center">
        by logging in, you agree to the <br />
        <a href="/end-user-agreement" className="text-blue-300 hover:underline">
          End User Agreement
        </a>
        &nbsp;and&nbsp;
        <a href="/privacy-policy" className="text-blue-300 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default Login;
