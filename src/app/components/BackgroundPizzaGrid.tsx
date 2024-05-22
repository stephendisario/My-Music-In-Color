import React, { useEffect, useState } from "react";

const InColourBackground = () => {
  // Define an array of colors
  const colors = [
    "#881e7e",
    "#5a2579",
    "#3c297e",
    "#1a3d8d",
    "#1b60ab",
    "#2883c6",
    "#179cd7",
    "#22a09e",
    "#209b6b",
    "#1a9d3f",
    "#5fb236",
    "#b0cb21",
    "#efe51f",
    "#fbd615",
    "#f6a515",
    "#f07b17",
    "#e6471d",
    "#e72f2a",
    "#dd0736",
    "#df0657",
    "#df1b6e",
    "#e5177b",
    "#d80481",
    "#bf0f7f",
  ];

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the counter
      setCounter((prevCounter) => prevCounter + 1);
    }, 50);

    // Cleanup function to clear the interval when component unmounts or effect is re-run
    return () => clearInterval(intervalId);
  }, []);

  // Calculate the angle for each slice
  const angle = 360 / colors.length;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Create slices dynamically */}
      {colors.map((color, index) => (
        <div
          key={index}
          className="absolute inset-0 transform-center"
          style={{
            clipPath: `polygon(50% 50%, ${50 + Math.cos((index * angle * Math.PI) / 180) * 100}% ${50 + Math.sin((index * angle * Math.PI) / 180) * 100}%, ${50 + Math.cos(((index + 1) * angle * Math.PI) / 180) * 100}% ${50 + Math.sin(((index + 1) * angle * Math.PI) / 180) * 100}%)`,
          }}
        >
          <div
            className={`absolute inset-0`}
            style={{ background: counter <= index ? "rgba(0,0,0,0)" : color }}
          />
        </div>
      ))}
    </div>
  );
};

export default InColourBackground;
