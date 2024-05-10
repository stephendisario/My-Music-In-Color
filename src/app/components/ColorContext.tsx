"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addColor } from "../lib/colorthief";

interface MyContextType {
  colorTracks: ColorTrack[];
  loading: boolean;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

interface MyContextProviderProps {
  initialValue: Track[];
  children: React.ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ initialValue, children }) => {
  const [colorTracks, setColorTracks] = useState<ColorTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const color = await addColor(initialValue);
      setColorTracks(color);
      setLoading(false);
    };

    fetchData();
  }, [initialValue]);

  return <MyContext.Provider value={{ colorTracks, loading }}>{children}</MyContext.Provider>;
};
