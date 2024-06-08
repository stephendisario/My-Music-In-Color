"use client";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getRainbowCollage, getTerm, toHslString } from "../lib/helper";
import CustomTooltip from "../components/CustomTooltip";
import { Colors, collageConfig } from "../dashboard/Collages";
import { addTracksToPlaylist, createPlaylist } from "../api/spotify";
import { Alert, Button } from "@mui/material";

const Collage = ({ color, index }: { color: Colors | "rainbow"; index: number }) => {
  const { collages, tabValue, id } = useMyContext();
  const [collageSize, setCollageSize] = useState<number>(0);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(false);
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  const [rainbowCollageWithoutDupes, setRainbowCollageWithoutDupes] = useState<ColorTrack[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const collageToUse = hideDuplicates ? rainbowCollageWithoutDupes : rainbowCollage;

  const toggleDuplicates = () => {
    setHideDuplicates((prevState) => !prevState);
  };

  const handleCollageSize = (value: number) => {
    setCollageSize(value);
  };

  const handleCreatePlaylist = async (tracks: ColorTrack[]) => {
    const playlistId = await createPlaylist(color, getTerm(tabValue), id);
    await addTracksToPlaylist(
      playlistId,
      tracks.map((track) => track.uri)
    );
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  useEffect(() => {
    if (color === "rainbow") {
      setRainbowCollage(getRainbowCollage(false, collages));
      setRainbowCollageWithoutDupes(getRainbowCollage(true, collages));
    }
  }, [collages]);

  const info = () => {
    const tracks =
      color === "rainbow"
        ? (Object.keys(collageConfig) as Colors[]).map((color) => collages[color]?.[0])
        : collages[color].slice(0, 8);

    return (
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-xl text-white">
          Top {color} Tracks - {getTerm(tabValue)}
        </h1>
        {tracks.map((track, index) => {
          const image = track?.album?.images?.[2]?.url;
          const name = track?.name;
          const artist = track?.artists?.[0]?.name;
          const lightness = track?.hsl?.[2] || 0;
          const spotifyUrl = track?.external_urls?.spotify;
          return (
            <div
              className="w-2/3"
              style={{
                backgroundColor: toHslString(track?.hsl),
              }}
              key={index}
            >
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center"
              >
                <p
                  className={`p-2 ${lightness! >= 50 || (color === "yellow" && lightness! >= 50) ? "text-black" : "text-white"}`}
                >
                  {name} - {artist}
                </p>
                <Image
                  unoptimized
                  alt={name}
                  width={64}
                  height={64}
                  src={image}
                  className="ml-auto"
                />
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  const art = () => {
    const allTracks =
      color === "rainbow"
        ? collageToUse
        : hideDuplicates
          ? collages[`${color}WithoutDupes`]
          : collages[color];
    const tracks = allTracks.slice(0, collageSize === 0 ? 64 : 25);

    return (
      <div
        className={`relative w-1/2 flex flex-col justify-center items-center ml-auto mr-auto content-center items-stretch ${collageSize === 1 ? "max-w-xs" : "max-w-lg"}`}
      >
        <div className="flex flex-row justify-center absolute top-0 left-0 right-0 mt-16">
          <Tabs
            value={collageSize}
            onChange={(_e, v) => handleCollageSize(v)}
            aria-label="basic tabs example"
          >
            <Tab label="8 x 8" />
            <Tab label="5 x 5" />
          </Tabs>
        </div>

        <div className="flex flex-row justify-between">
          <Button variant="outlined" onClick={() => toggleDuplicates()}>
            {hideDuplicates ? "Show Duplicates" : "Hide Duplicates"}
          </Button>
          <Button variant="outlined" onClick={() => handleCreatePlaylist(tracks)}>
            Create Playlist
          </Button>
        </div>

        <div className="flex flex-row flex-wrap	">
          {tracks.map((track) => {
            const image = track?.album?.images?.[2]?.url;
            const name = track?.name;
            const spotifyUrl = track?.external_urls?.spotify;
            return (
              <CustomTooltip track={track} key={track.id}>
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
                  <Image unoptimized alt={name} width={64} height={64} src={image} />
                </a>
              </CustomTooltip>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row grow">
      {showAlert && (
        <Alert severity="success" className="absolute w-1/2 mx-auto left-1/4">
          Playlist Saved Successfully!
        </Alert>
      )}
      {index % 2 === 0 && info()}
      {art()}
      {index % 2 !== 0 && info()}
    </div>
  );
};
export default Collage;
