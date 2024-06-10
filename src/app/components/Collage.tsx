"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getRainbowCollage, getTerm, toHslString } from "../lib/helper";
import CustomTooltip from "../components/CustomTooltip";
import { Colors, collageConfig } from "../dashboard/Collages";
import { addImageToPlaylist, addTracksToPlaylist, createPlaylist } from "../api/spotify";
import { Alert, Button, Snackbar } from "@mui/material";
import { toJpeg, toPng } from "html-to-image";
import SpotifyLogo from "./SpotifyLogo";

const Collage = ({ color, index }: { color: Colors | "rainbow"; index: number }) => {
  const { collages, tabValue, id } = useMyContext();
  const [collageSize, setCollageSize] = useState<number>(0);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(false);
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  const [rainbowCollageWithoutDupes, setRainbowCollageWithoutDupes] = useState<ColorTrack[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const collageToUse = hideDuplicates ? rainbowCollageWithoutDupes : rainbowCollage;

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
    // const dataUrl = await handleDownload(artRef, false)
    // await addImageToPlaylist(playlistId, dataUrl!)

    setOpenSnackbar(true);
  };

  const handleDownload = useCallback(
    async (currRef: any, isDownload: boolean) => {
      const ref = currRef;
      if (ref.current === null) {
        return;
      }

      const node = ref.current;
      const scale = 2; // Adjust the scale factor as needed

      const width = node.offsetWidth * scale;
      const height = node.offsetHeight * scale;

      const backgroundColor = color === "rainbow" || color === "white" ? "white" : "black";

      try {
        const dataUrl = await toJpeg(node, {
          cacheBust: true,
          backgroundColor,
          width,
          height,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${node.offsetWidth}px`,
            height: `${node.offsetHeight}px`,
          },
        });

        if (isDownload) {
          console.log(dataUrl);
          const link = document.createElement("a");
          link.download = `${getTerm(tabValue)} - ${color}`;
          link.href = dataUrl;
          link.click();
        } else return dataUrl;
      } catch (error: any) {
        console.error("Error downloading image", error.message);
      }
    },
    [infoRef, artRef]
  );

  useEffect(() => {
    if (color === "rainbow") {
      setRainbowCollage(getRainbowCollage(false, collages));
      setRainbowCollageWithoutDupes(getRainbowCollage(true, collages));
    }
  }, [collages]);

  const logos = () => {
    const logosColor = color === "rainbow" || color === "white" ? "black" : "white";
    return (
      <div className={`my-2 px-2 flex flex-row items-center`}>
        <div className="mr-auto" style={{ color: logosColor }}>
          {getTerm(tabValue)}
          <p>mymusicincolor.com</p>
        </div>
        <SpotifyLogo color={logosColor} />
      </div>
    );
  };

  const info = () => {
    const tracks =
      color === "rainbow"
        ? (Object.keys(collageConfig) as Colors[]).map((color) => collages[color]?.[0])
        : collages[color].slice(0, 8);

    return (
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center invisible">
          <Tabs value={0}>
            <Tab label="8 x 8" />
            <Tab label="5 x 5" />
          </Tabs>
        </div>
        <Button onClick={() => handleDownload(infoRef, true)}>Download Image</Button>
        <div ref={infoRef} className="w-2/3 flex flex-row flex-wrap justify-center">
          {tracks.map((track, index) => {
            const image = track?.album?.images?.[1]?.url;
            const name = track?.name;
            const artist = track?.artists?.[0]?.name;
            const lightness = track?.hsl?.[2] || 0;
            const spotifyUrl = track?.external_urls?.spotify;
            return (
              <div
                className="w-full"
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
          <div className="w-full">{logos()}</div>
        </div>
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
        <div className="flex flex-row justify-center">
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
          <Button onClick={() => toggleDuplicates()}>
            {hideDuplicates ? "Show Duplicates" : "Hide Duplicates"}
          </Button>
          <Button onClick={() => handleDownload(artRef, true)}>Download Image</Button>
          <Button onClick={() => handleCreatePlaylist(tracks)}>Create Playlist</Button>
        </div>

        <div ref={artRef}>
          <div className="flex flex-row flex-wrap	">
            {tracks.map((track) => {
              const image = track?.album?.images?.[1]?.url;
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
          {logos()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row grow">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 4 }}
      >
        <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          Playlist created successfully
        </Alert>
      </Snackbar>
      {index % 2 === 0 && info()}
      {art()}
      {index % 2 !== 0 && info()}
    </div>
  );
};
export default Collage;
