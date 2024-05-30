"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useMyContext } from "../components/ColorContext";
import { Colors, collageConfig } from "./Collages";

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
          data: [
            collages["redFiltered"].length,
            collages["orangeFiltered"].length,
            collages["yellowFiltered"].length,
            collages["greenFiltered"].length,
            collages["blueFiltered"].length,
            collages["violetFiltered"].length,
            collages["blackFiltered"].length,
            collages["whiteFiltered"].length,
          ],
          backgroundColor: [
            "rgba(255, 0, 0, 0.6)",
            "rgba(255, 165, 0, 0.6)",
            "rgba(255, 255, 0, 0.6)",
            "rgba(0, 128, 0, 0.6)",
            "rgba(0, 0, 255, 0.6)",
            "rgba(238, 130, 238, 0.6)",
            "rgba(0, 0, 0, 0.6)",
            "rgba(255, 255, 255, 0.6)",
          ],
          borderColor: ["Red", "Orange", "Yellow", "Green", "Blue", "Violet", "Black", "White"],
          borderWidth: 1,
        },
      ],
    });

    setYourColor(
      (Object.keys(collageConfig) as Colors[]).reduce((acc, color) => {
        if (collages[`${color}Filtered`].length > collages[`${acc}Filtered`].length) return color;
        return acc;
      }, "red")
    );
  }, [collages]);

  return (
    <div
      className={`snap-center relative h-screen flex flex-row justify-center items-center`}
      style={{
        background: `linear-gradient(to bottom, ${yourColor === "black" ? "" : yourColor}, rgba(0, 0, 0, 1))`,
      }}
    >
      <div style={{ width: "50%", height: "75%" }}>{data && <Pie data={data} />}</div>
      <div className="mx-auto">Your Color: {yourColor}</div>
    </div>
  );
};

export default PieChart;
