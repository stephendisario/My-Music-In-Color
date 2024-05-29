"use client";
import React, { useState } from "react";
import Collages, { Collages as Cols } from "./Collages";
import AllImages from "./AllImages";
import PieChart from "./PieChart";
import { useMyContext } from "../components/ColorContext";
import RainbowCollage from "./RainbowCollage";

const ContentWrapper = () => {
  const { loading } = useMyContext();

  return !loading ? (
    <>
      <PieChart />
      <RainbowCollage />
      <Collages />
      <AllImages />
    </>
  ) : (
    <div>poop</div>
  );
};
export default ContentWrapper;
