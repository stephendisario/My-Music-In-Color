"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useMyContext } from "../components/ColorContext";
import { Colors, collageConfig } from "./Collages";
import TermTabs from "../components/TermTabs";
import { toHslString } from "../lib/helper";

// Register necessary components from Chart.js to keep the bundle size small
Chart.register(ArcElement, Tooltip, Legend);

const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Violet", "Black", "White"];

const PieChart = () => {
  const { collages } = useMyContext();
  const [data, setData] = useState<any>();
  const [yourColor, setYourColor] = useState<Colors>();

  useEffect(() => {
    setData({
      labels: colors,
      datasets: [
        {
          label: "Tracks",
          data: (Object.keys(collageConfig) as Colors[]).map((color) => collages[color]?.length),
          backgroundColor: (Object.keys(collageConfig) as Colors[]).map(
            (color) => toHslString(collages[color]?.[0]?.hsl) || color
          ),
          borderColor: ["Red", "Orange", "Yellow", "Green", "Blue", "Violet", "Black", "White"],
          borderWidth: 0,
        },
      ],
    });

    setYourColor(
      (Object.keys(collageConfig) as Colors[]).reduce((acc, color) => {
        if (collages[color]?.length > collages[acc]?.length) return color;
        return acc;
      }, "red")
    );
  }, [collages]);

  return (
    <div
      className={`snap-start relative h-screen flex flex-col justify-center items-center`}
      style={{
        background: `linear-gradient(to bottom, ${yourColor === "black" ? "" : toHslString(collages[yourColor || "red"]?.[0].hsl)}, rgba(0, 0, 0, 1))`,
      }}
    >
      {/* <TermTabs color="white" /> */}
      <div className="flex flex-row grow w-full">
        <div className="w-1/2">{data && <Pie data={data} />}</div>
        <div className="mx-auto">Your Color: {yourColor}</div>
      </div>
    </div>
  );
};

export default PieChart;
