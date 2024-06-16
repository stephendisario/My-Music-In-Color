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
            style={{ background: color }}
            className="w-5 h-5 border-2 bg-red-500 border-black text-black flex items-center justify-center rounded-sm"
          >
            A
          </div>
          {!hideDuplicates && (
            <div className="w-5 h-5 border-2 bg-red-500 border-black text-black flex items-center justify-center rounded-sm absolute left-1/3 bottom-1/3">
              A
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default CheckboxWithStyle;
