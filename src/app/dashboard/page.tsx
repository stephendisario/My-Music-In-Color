"use client";
import React, { useEffect, useState } from "react";
import Collage from "../components/Collage";
import { useMyContext } from "../components/ColorContext";
import MovingText from "../components/MovingText";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

export const maxDuration = 20;

const Dashboard = () => {
  const { loading, loadingColor, loadingTracks, setLoggedIn, totalTracks } = useMyContext();
  const [progress, setProgress] = useState<number>(0);
  const [text, setText] = useState<string>("sizing up your top tracks");

  useEffect(() => {
    setLoggedIn(true);
  }, [setLoggedIn]);

  const step = async () => {
    if (totalTracks && loadingTracks && loadingColor) {
      let formattedNumber = totalTracks.toString();
      if (totalTracks >= 1000) {
        formattedNumber = formattedNumber[0] + "," + formattedNumber.substring(1);
      }

      setProgress(20);
      setText(`fetching your ${formattedNumber} top tracks`);
      return;
    }
    if (!loadingTracks && loadingColor) {
      setProgress(50);
      setText(`extracting dominant colors`);
    }
    if (!loadingColor) {
      setProgress(80);
      setText("designing your musaics");
      setTimeout(() => {
        setProgress(90);
        setText("wrapping up");
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => setProgress(101), 500);
        }, 1000);
      }, 1000);
    }
  };

  useEffect(() => {
    step();
  }, [totalTracks, loadingTracks, loadingColor]);

  const loadingPage = () => (
    <div
      className={`relative h-[calc(100dvh)] sm:h-screen flex flex-col items-center rainbow-background`}
    >
      <div className="absolute top-[33%] translate-y-[-50%] flex flex-col">
        <p className="text-5xl sm:text-8xl">mymusicincolor</p>
        <p className="text-lg sm:text-3xl opacity-90 mt-1 text-center">
          explore your colorful musaics
        </p>
      </div>
      <div className="sm:w-[661px] w-[330px] absolute top-[66%] translate-y-[-50%] z-30 flex flex-col justify-center items-center">
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            width: "100%",
            height: 10,
            borderRadius: 5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              background: "rgba(255,255,255,0.5)",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              background:
                "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)",
            },
          }}
        />
        <p className="text-xl sm:text-3xl h-16 pt-2 pb-20 sm:pb-24">
          {text}
          <br />
          {progress === 50 && "(hang tight, this takes a moment)"}
        </p>
        <CircularProgress color="inherit" size={30} />
      </div>
    </div>
  );

  return progress !== 101 && loading ? loadingPage() : <Collage />;
};
export default Dashboard;
