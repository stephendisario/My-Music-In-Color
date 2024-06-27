"use client";
import React, { useEffect, useRef, useState } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";
import { Button } from "@mui/material";
import NavBar from "../components/NavBar";
import "./login.css";

const Login = () => {
  const image = useRef<HTMLDivElement>(null);
  const codeVerifier = generateRandomString(64);
  const text = "mymusicincolor";
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
  const repeatedText = Array(100)
    .fill(text)
    .join(!isMobile ? "\u00A0\u00A0\u00A0\u00A0\u00A0" : "\u00A0\u00A0"); // Repeat and join with non-breaking spaces
  const repeatedTextMiddle = Array(100).fill(text).join("\u00A0\u00A0"); // Repeat and join with non-breaking spaces

  useEffect(() => {
    localStorage.setItem("codeVerifier", codeVerifier);
    const test = localStorage.getItem("colorMap");
    const obj = test ? JSON.parse(test) : undefined;
    if (obj) console.log("localstore size", Object.keys(obj).length);
  }, [codeVerifier]);

  const animationStyle1 = { animation: `moveRight 24s linear infinite` };
  const animationStyle2 = {
    animation: `moveRight 25s linear infinite`,
  };
  const animationStyle3 = {
    animation: `moveRight 20s linear infinite`,
  };

  if (image.current) {
    const poo = image.current;
    poo.animate([{ transform: `translateX(-200%)` }, { transform: `translateX(0%)` }], {
      duration: 10 * 1000, // Adjust duration as needed
      fill: "forwards",
      easing: "linear",
      delay: 0,
      iterations: Infinity,
    });
  }

  return (
    <div className="flex relative h-screen justify-center items-center rainbow-background">
      <div className="absolute top-0 left-0 w-full h-full">
        <NavBar showLogout={false} />
      </div>
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

      <button
        className="mt-[66%] sm:mt-[19%] opacity-50 text-black font-bold border-2 border-black rounded-full text-3xl text-nowrap self-center	hover:bg-[rgba(0,0,0,.1)] w-[150px] z-30"
        onClick={() => login(codeVerifier)}
      >
        log in
      </button>
    </div>
  );
};

export default Login;
