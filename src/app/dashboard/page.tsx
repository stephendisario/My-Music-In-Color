"use client";
import React, { useEffect, useState } from "react";
import Collage from "../components/Collage";
import { useMyContext } from "../components/ColorContext";
import MovingText from "../components/MovingText";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

const Dashboard = () => {
  const { loading, loadingColor, loadingTracks, setLoggedIn, totalTracks } = useMyContext();
  const [progress, setProgress] = useState<number>(0);
  const [text, setText] = useState<string>("sizing up your top tracks");

  useEffect(() => {
    setLoggedIn(true);
  }, [setLoggedIn]);

  const step = async () => {
    if (totalTracks && loadingTracks && loadingColor) {
      setProgress(20);
      setText(`fetching your ${totalTracks} top tracks`);
      return;
    }
    if (!loadingTracks && loadingColor) {
      setProgress(50);
      setText(`extracting dominant colors \n (hang tight, this takes a moment)`);
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
      <MovingText />
      <div className="sm:w-2/3 w-[80%]  h-full z-30 flex flex-col justify-center">
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
        <p className="text-3xl h-20 mr-auto">{text}</p>
      </div>
    </div>
  );

  return progress !== 101 && loading ? loadingPage() : <Collage />;
};
export default Dashboard;
