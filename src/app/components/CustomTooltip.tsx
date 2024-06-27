"use client";
import { Divider, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { toHslString } from "../lib/helper";
import black from "../../../public/Spotify_Icon_RGB_Black.png";
import white from "../../../public/Spotify_Icon_RGB_White.png";
import Image from "next/image";

const CustomTooltip = ({
  track,
  children,
}: {
  track: ColorTrack;
  children: React.ReactElement;
}) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const textColor = track?.hsl?.[2] && track?.hsl?.[2] > 50 ? "black" : "white";
  const spotifyURI = track.uri;
  const webURL = track?.external_urls?.spotify;
  // const [open, setOpen] = useState(false);

  const handleLinkClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMobile) window.location.href = spotifyURI;
    else window.open(webURL, "_blank", "noopener,noreferrer");
  };

  return (
    <Tooltip
      // onTouchMoveCapture={(e) => setOpen(false)}
      // onTouchStartCapture={() => setOpen(true)}
      // open={open}
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      PopperProps={{ disablePortal: true }}
      arrow
      title={
        <a
          href={isMobile ? spotifyURI : webURL}
          onClick={handleLinkClick}
          onTouchEnd={handleLinkClick}
        >
          <div className="flex flex-col gap-2">
            <div>
              <h1>{track?.name}</h1>
              <Divider />
              <h3>{track?.artists?.[0].name}</h3>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                unoptimized
                src={textColor === "black" ? black : white}
                alt="Spotify Icon"
                width={20}
              />
              <p className="">play on spotify</p>
            </div>
          </div>
        </a>
      }
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: toHslString(track?.hsl),
            color: textColor,
            fontSize: "16px",
            "& .MuiTooltip-arrow": {
              color: toHslString(track?.hsl),
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
