"use client";
import { Divider, Tooltip, tooltipClasses } from "@mui/material";
import React, { useState } from "react";
import { toHslString } from "../lib/helper";
import black from "../../../public/Spotify_Icon_RGB_Black.png";
import white from "../../../public/Spotify_Icon_RGB_White.png";
import Image from "next/image";
import { useMyContext } from "./ColorContext";

const CustomTooltip = ({
  track,
  children,
}: {
  track: ColorTrack;
  children: React.ReactElement;
}) => {
  const { isMobile } = useMyContext();

  const [open, setOpen] = useState<boolean>(false);
  const [isMove, setIsMove] = useState<boolean>(false);

  const textColor = track?.hsl?.[2] && track?.hsl?.[2] > 50 ? "black" : "white";
  const spotifyURI = track.uri;
  const webURL = track?.external_urls?.spotify;

  const handleLinkClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMobile) window.location.href = spotifyURI;
    else window.open(webURL, "_blank", "noopener,noreferrer");
  };

  const handleClose = (e: any) => {
    setOpen(false);
  };

  const handleTouchEnd = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (!isMove) setOpen(true);
    setIsMove(false);
  };

  const handleTouchMove = () => {
    setIsMove(true);
  };

  return (
    <Tooltip
      open={isMobile ? open : undefined}
      onClose={isMobile ? handleClose : undefined}
      onTouchEndCapture={isMobile ? handleTouchEnd : undefined}
      onTouchMoveCapture={isMobile ? handleTouchMove : undefined}
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
          <div className="flex flex-row gap-2 font sans items-center justify-end leading-tight">
            <div className="min-w-[20px]">
              <Image
                unoptimized
                src={textColor === "black" ? black : white}
                alt="Spotify Icon"
                width={20}
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg font-medium">{track?.name}</p>
              <p className="opacity-80">{track?.artists?.[0].name}</p>
            </div>
          </div>
        </a>
      }
      slotProps={{
        tooltip: {
          sx: {
            paddingX: "8px",
            paddingTop: "4px",
            maxWidth: isMobile ? "100%" : "600px",
            bgcolor: toHslString(track?.hsl),
            color: textColor,
            fontSize: "16px",
            "& .MuiTooltip-arrow": {
              color: toHslString(track?.hsl),
            },
          },
        },
        popper: {
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
              {
                marginTop: "8px",
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
