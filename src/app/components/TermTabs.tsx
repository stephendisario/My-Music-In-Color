"use client";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useMyContext } from "./ColorContext";

export default function TermTabs({ color }: { color: string }) {
  const { tabValue, setTabValue, setCollages, long, medium, short } = useMyContext();

  return (
    <Tabs
      value={tabValue}
      onChange={(_e, newValue: number) => {
        setTabValue(newValue);
        setCollages(newValue === 0 ? long : newValue === 1 ? medium : short);
      }}
      centered
      sx={{
        "& .MuiTab-root": {
          color: color, // Custom color for tab text
        },
        "& .Mui-selected": {
          color: color, // Custom color for selected tab text
        },
        "& .MuiTabs-indicator": {
          backgroundColor: color, // Custom color for the indicator
        },
      }}
    >
      <Tab label="One Year" />
      <Tab label="Six Months" />
      <Tab label="One Month" />
    </Tabs>
  );
}
