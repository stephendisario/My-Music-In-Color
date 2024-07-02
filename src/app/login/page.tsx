"use client";
import React, { useEffect, useRef, useState } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";
import { Button } from "@mui/material";
import NavBar from "../components/NavBar";
import MovingText from "../components/MovingText";

const Login = () => {
  const codeVerifier = generateRandomString(64);

  useEffect(() => {
    localStorage.setItem("codeVerifier", codeVerifier);
    const test = localStorage.getItem("colorMap");
    const obj = test ? JSON.parse(test) : undefined;
    if (obj) console.log("localstore size", Object.keys(obj).length);
  }, [codeVerifier]);

  return (
    <div className="flex relative h-screen justify-center items-center rainbow-background">
      <div className="absolute top-0 left-0 w-full h-full">
        <NavBar showLogout={false} />
      </div>
      <MovingText />
      <button
        className="mt-[66%] sm:mt-[19%] opacity-80 text-white font-bold border-2 border-white rounded-full text-3xl text-nowrap self-center	hover:bg-[rgba(0,0,0,.1)] w-[150px] z-30"
        onClick={() => login(codeVerifier)}
      >
        log in
      </button>
    </div>
  );
};

export default Login;
