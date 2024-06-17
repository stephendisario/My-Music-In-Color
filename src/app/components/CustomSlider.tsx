import React from "react";

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
        style={{
          ...gradientStyle,
          // Custom styles for the thumb
          WebkitAppearance: "none",
          appearance: "none",
        }}
        onChange={handleChange}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 30px; /* Width of the thumb */
          height: 30px; /* Height of the thumb */
          background: white; /* Color of the thumb */
          cursor: pointer;
          border-radius: 50%; /* Make the thumb a circle */
        }

        input[type="range"]::-moz-range-thumb {
          width: 30px; /* Width of the thumb */
          height: 30px; /* Height of the thumb */
          background: white; /* Color of the thumb */
          cursor: pointer;
          border-radius: 50%; /* Make the thumb a circle */
        }
      `}</style>
    </div>
  );
};

export default CustomSlider;
