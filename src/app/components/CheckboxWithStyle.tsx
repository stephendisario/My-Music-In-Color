import React, { useState } from "react";

const CheckboxWithStyle = ({
  color,
  hideDuplicates,
  setHideDuplicates,
}: {
  color: string;
  hideDuplicates: boolean;
  setHideDuplicates: any;
}) => {
  let bgColor;

  if (color === "red") bgColor = "bg-red-600";
  if (color === "orange") bgColor = "bg-orange-400";
  if (color === "yellow") bgColor = "bg-yellow-300";
  if (color === "green") bgColor = "bg-green-600";
  if (color === "blue") bgColor = "bg-blue-600";
  if (color === "violet") bgColor = "bg-violet-500";
  if (color === "black") bgColor = "bg-stone-600";
  if (color === "white") bgColor = "bg-stone-600";
  if (color === "rainbow") bgColor = "bg-stone-600";

  const handleChange = () => {
    setHideDuplicates((prevState: any) => !prevState);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="hidden"
        checked={hideDuplicates}
        onChange={handleChange}
        id="styled-checkbox"
      />
      <label htmlFor="styled-checkbox" className="relative cursor-pointer">
        <div className="hover:bg-[rgba(0,0,0,0.06)] w-9 h-9 flex justify-center items-center rounded-full">
          <div
            className={`w-5 h-5 border-2 ${bgColor} border-black text-black flex items-center justify-center rounded-sm`}
          >
            A
          </div>
          {!hideDuplicates && (
            <div
              className={`w-5 h-5 border-2 ${bgColor} border-black text-black flex items-center justify-center rounded-sm absolute left-[40%] bottom-[40%]`}
            >
              A
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default CheckboxWithStyle;
