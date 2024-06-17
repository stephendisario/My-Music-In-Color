import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import ShowDuplicatesIcon from "@mui/icons-material/LibraryAdd"; // Example icon
import HideDuplicatesIcon from "@mui/icons-material/LibraryAddCheck"; // Example icon
import { useMyContext } from "./ColorContext";
import Image from "next/image";

const CustomCheckbox = () => {
  const { sortedColorTracks } = useMyContext();
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prevState) => !prevState);
    // Additional logic to handle showing/hiding duplicates
  };

  const image = sortedColorTracks?.[0]?.album?.images?.[1]?.url;

  return (
    <div onClick={() => handleChange()} className="cursor-pointer mr-10 flex flex-row">
      <div style={{ width: "10%", height: "auto" }}>
        <Image
          unoptimized
          alt={"test"}
          width={300}
          height={300}
          src={image}
          className=" w-full h-full"
        />
      </div>
      {checked && (
        <div style={{ width: "10%", height: "auto" }}>
          <Image
            unoptimized
            alt={"test"}
            width={300}
            height={300}
            src={image}
            className="ml-[-30px] mb-[30px] w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default CustomCheckbox;
