import { Divider, Tooltip } from "@mui/material";
import React from "react";
import { toHslString } from "../lib/helper";

const CustomTooltip = ({
  track,
  children,
}: {
  track: ColorTrack;
  children: React.ReactElement;
}) => {
  return (
    <Tooltip
      PopperProps={{ disablePortal: true }}
      arrow
      title={
        <div>
          <h1>{track?.name}</h1>
          <Divider />
          <h3>{track?.artists?.[0].name}</h3>
        </div>
      }
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: toHslString(track?.hsl),
            color: track?.hsl?.[2] && track?.hsl?.[2] > 50 ? "black" : "white",
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
