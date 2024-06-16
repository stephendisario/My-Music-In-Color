import React, { useState } from "react";

const CustomSlider = ({ value, onChange }: { value: number; onChange: any }) => {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  const gradientStyle = {
    background:
      "linear-gradient(to right , red 0%, orange 12.5%, yellow 25%, green 37.5%, blue 50%, violet 62.5%, black 75%, white 87.5%, red 89%, orange 90.5%, yellow 92%, green 93.5%, blue 95%, violet 100%)",
  };

  return (
    <div className="w-4/5 sm:w-1/3">
      <input
        type="range"
        min="0"
        max="80"
        step={value >= 70 ? "5" : "10"}
        value={value}
        className="w-full h-6 outline-none appearance-none"
        style={gradientStyle}
        onChange={handleChange}
      />
    </div>
  );
};

export default CustomSlider;
