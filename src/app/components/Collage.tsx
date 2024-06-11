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
import LoadingButton from "@mui/lab/LoadingButton";

const Collage = ({ color, index }: { color: Colors | "rainbow"; index: number }) => {
  const { collages, tabValue, id } = useMyContext();
  const [collageSize, setCollageSize] = useState<number>(0);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(false);
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  const [rainbowCollageWithoutDupes, setRainbowCollageWithoutDupes] = useState<ColorTrack[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCreatePlaylistLoading, setIsCreatePlaylistLoading] = useState<boolean>(false);

  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

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
    setIsCreatePlaylistLoading(true);
    const playlistId = await createPlaylist(color, getTerm(tabValue), id);
    await addTracksToPlaylist(
      playlistId,
      tracks.map((track) => track.uri)
    );
    let dataUrl = await handleDownload(playlistRef, false);
    dataUrl = dataUrl?.split(",")[1];

    await addImageToPlaylist(playlistId, dataUrl!);

    setIsCreatePlaylistLoading(false);
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

      const scaledObject: any = {
        width,
        height,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
        },
      };

      try {
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });


        const dataUrl = await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });

        if (isDownload) {
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
      <div className={`my-2 px-2 flex flex-row items-center logos`}>
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
      <div className="flex flex-col justify-start sm:justify-center items-center sm:max-w-lg">
        <div className="flex flex-row justify-center invisible">
          <Tabs value={0}>
            <Tab label="8 x 8" />
            <Tab label="5 x 5" />
          </Tabs>
        </div>
        <Button sx={{ fontSize: "10px" }} onClick={() => handleDownload(infoRef, true)}>
          Download Image
        </Button>
        <div ref={infoRef} className="flex flex-row flex-wrap justify-center">
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
                  <div
                    className="ml-auto"
                    style={{ width: collageSize === 0 ? "12.5%" : "20%", height: "auto" }}
                  >
                    <Image
                      unoptimized
                      alt={name}
                      width={300}
                      height={300}
                      src={image}
                      className="w-full h-full"
                      crossOrigin="anonymous"
                    />
                  </div>
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
      <div className={`flex flex-col justify-start sm:justify-center items-center sm:max-w-lg `}>
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

        <div className="flex flex-row justify-between w-full">
          <Button sx={{ fontSize: "10px" }} onClick={() => toggleDuplicates()}>
            {hideDuplicates ? "Show Duplicates" : "Hide Duplicates"}
          </Button>
          <Button sx={{ fontSize: "10px" }} onClick={() => handleDownload(artRef, true)}>
            Download Image
          </Button>
          <LoadingButton
            sx={{ fontSize: "10px" }}
            loading={isCreatePlaylistLoading}
            onClick={() => handleCreatePlaylist(tracks)}
          >
            Create Playlist
          </LoadingButton>
        </div>

        <div ref={artRef}>
          <div className="flex flex-row flex-wrap w-full" ref={playlistRef}>
            {tracks.map((track) => {
              const image = track?.album?.images?.[1]?.url;
              const name = track?.name;
              const spotifyUrl = track?.external_urls?.spotify;
              return (
                <CustomTooltip track={track} key={track.id}>
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: collageSize === 0 ? "12.5%" : "20%", height: "auto" }}
                  >
                    <Image
                      unoptimized
                      alt={name}
                      src={image}
                      width={300}
                      height={300}
                      className="w-full h-full"
                      crossOrigin="anonymous"
                    />
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
    <div className="flex-1 overflow-x-scroll snap-x snap-mandatory">
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
      <div className="flex w-full h-full">
        <div className="flex-shrink-0 w-screen sm:w-1/2 snap-start flex justify-center px-2">
          {index % 2 === 0 ? info() : art()}
        </div>
        <div className="flex-shrink-0 w-screen sm:w-1/2 snap-start flex justify-center px-2">
          {index % 2 !== 0 ? info() : art()}
        </div>
      </div>
    </div>
  );
};
export default Collage;
