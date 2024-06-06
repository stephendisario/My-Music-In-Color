"use client";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useMyContext } from "./ColorContext";

export default function TermTabs() {
  const { tabValue, setTabValue, setCollages, long, medium, short } = useMyContext();

  return (
    <Tabs
      value={tabValue}
      onChange={(_e, newValue: number) => {
        setTabValue(newValue);
        setCollages(newValue === 0 ? long : newValue === 1 ? medium : short);
      }}
      centered
    >
      <Tab label="One Year" />
      <Tab label="Six Months" />
      <Tab label="One Month" />
    </Tabs>
  );
}
