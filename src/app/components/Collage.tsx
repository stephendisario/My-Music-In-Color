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
import { toBlob, toJpeg, toPng } from "html-to-image";
import SpotifyLogo from "./SpotifyLogo";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomSlider from "./CustomSlider";
import IosShareIcon from "@mui/icons-material/IosShare";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import CustomCheckbox from "./CustomCheckbox";
import test from "../../Frame.svg";
import CheckboxWithStyle from "./CheckboxWithStyle";
import DownloadIcon from "@mui/icons-material/Download";
import NavBar from "./NavBar";
import CircularProgress from "@mui/material/CircularProgress";

const snapPoints = [
  { color: "red", position: 0 },
  { color: "orange", position: 10 },
  { color: "yellow", position: 20 },
  { color: "green", position: 30 },
  { color: "blue", position: 40 },
  { color: "violet", position: 50 },
  { color: "black", position: 60 },
  { color: "white", position: 70 },
  { color: "rainbow", position: 75 },
];

const findClosestSnapPoint = (hue: number) => {
  let closest = snapPoints[0];
  let minDiff = Math.abs(hue - snapPoints[0].position);
  for (let i = 1; i < snapPoints.length; i++) {
    let diff = Math.abs(hue - snapPoints[i].position);
    if (diff < minDiff) {
      minDiff = diff;
      closest = snapPoints[i];
    }
  }
  return closest;
};

const Collage = ({ color, index }: { color: Colors | "rainbow"; index: number }) => {
  const [currentColor, setCurrentColor] = useState<Colors | "rainbow">("red");
  const { collages, tabValue, id } = useMyContext();
  const [collageSize, setCollageSize] = useState<number>(0);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(false);
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  const [rainbowCollageWithoutDupes, setRainbowCollageWithoutDupes] = useState<ColorTrack[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCreatePlaylistLoading, setIsCreatePlaylistLoading] = useState<boolean>(false);

  const [isMosaic, setIsMosaic] = useState<boolean>(true);

  const [pickerColor, setPickerColor] = useState(0);

  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  const collageToUse = hideDuplicates ? rainbowCollageWithoutDupes : rainbowCollage;

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCreatePlaylist = async (tracks: ColorTrack[]) => {
    setIsCreatePlaylistLoading(true);
    const playlistId = await createPlaylist(currentColor, getTerm(tabValue), id);
    await addTracksToPlaylist(
      playlistId,
      tracks.map((track) => track.uri)
    );
    let dataUrl: string = (await handleDownload(playlistRef, false, false)) as string;
    dataUrl = dataUrl?.split(",")[1];

    console.log(dataUrl);

    await addImageToPlaylist(playlistId, dataUrl!);

    setIsCreatePlaylistLoading(false);
    setOpenSnackbar(true);
  };

  const handleDownload = async (currRef: any, isDownload: boolean, isShare: boolean) => {
    const ref = currRef;
    if (ref.current === null) {
      return;
    }

    const node = ref.current;
    const scale = 2; // Adjust the scale factor as needed

    const width = node.offsetWidth * scale;
    const height = node.offsetHeight * scale;

    const backgroundColor =
      currentColor === "rainbow" || currentColor === "white" ? "white" : "black";

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
      let dataUrl;
      if (isShare) {
        console.log("isshare");
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          backgroundColor,
          ...scaledObject,
        });
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          backgroundColor,
          ...scaledObject,
        });
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          backgroundColor,
          ...scaledObject,
        });

        dataUrl = await toBlob(node, {
          quality: 1,
          cacheBust: true,
          backgroundColor,
          ...scaledObject,
        });
      } else {
        console.log("isDownload", isDownload, isShare);
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });

        dataUrl = await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });
      }

      if (isDownload && !isShare && dataUrl) {
        const link = document.createElement("a");
        link.download = `${getTerm(tabValue)} - ${currentColor}`;
        link.href = dataUrl as string;
        link.click();
      } else return dataUrl;
    } catch (error: any) {
      console.error("Error downloading image", error.message);
    }
  };

  const shareImage = async () => {
    try {
      const blob = await handleDownload(isMosaic ? artRef : infoRef, false, true);
      if (navigator.share) {
        await navigator.share({
          files: [
            new File([blob!], "test.png", {
              type: "image/png",
              lastModified: new Date().getTime(),
            }),
          ],
        });
      } else {
        alert("Web Share API is not supported in your browser.");
      }

      // Clean up the URL object after sharing
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  useEffect(() => {
    // if (currentColor === "rainbow") {
    setRainbowCollage(getRainbowCollage(false, collages));
    setRainbowCollageWithoutDupes(getRainbowCollage(true, collages));
    // }
  }, [collages]);

  const header = (tracks: ColorTrack[]) => (
    <div className="flex flex-row w-full justify-between items-end relative">
      <div className="flex flex-row">
        <div className="sm:hidden">
          <IconButton onClick={() => shareImage()}>
            <IosShareIcon sx={{ color: "black" }} />
          </IconButton>
        </div>
        <div className="sm:block hidden">
          <IconButton onClick={() => handleDownload(isMosaic ? artRef : infoRef, true, false)}>
            <DownloadIcon sx={{ color: "black" }} />
          </IconButton>
        </div>
        {isMosaic && (
          <CheckboxWithStyle
            color={currentColor}
            hideDuplicates={hideDuplicates}
            setHideDuplicates={setHideDuplicates}
          />
        )}
      </div>
      <button
        className={`text-black absolute left-1/2 transform -translate-x-1/2 border-2 border-black rounded-full px-4 text-xs h-1/2 self-center w-28 hover:bg-[rgba(0,0,0,.06)] `}
        onClick={() => setIsMosaic((prevState) => !prevState)}
      >
        see {!isMosaic ? "mosaic" : "faves"}
      </button>
      {isMosaic && (
        <button
          className="text-black border-2 border-black rounded-full px-4 text-xs h-1/2 self-center	hover:bg-[rgba(0,0,0,.06)] w-[116px]"
          onClick={() => {
            if (!isCreatePlaylistLoading) handleCreatePlaylist(tracks);
          }}
        >
          {isCreatePlaylistLoading ? (
            <CircularProgress sx={{ color: "black" }} size={10} />
          ) : (
            "create playlist"
          )}
        </button>
      )}
    </div>
  );

  const logos = useCallback(
    (words: string) => {
      const logosColor = "white";

      return (
        <div className={`my-2 px-2 flex flex-row items-center logos`}>
          <div className="mr-auto" style={{ color: logosColor }}>
            {`my ${words} - ${currentColor}`}
            <p>mymusicincolor.com</p>
          </div>
          <SpotifyLogo color={logosColor} />
        </div>
      );
    },
    [currentColor]
  );

  const info = () => {
    const tracks =
      currentColor === "rainbow"
        ? (Object.keys(collageConfig) as Colors[]).map((color) => collages[color]?.[0])
        : collages[currentColor].slice(0, 8);

    return (
      <div className="flex flex-col justify-center items-center sm:max-w-lg">
        {header([])}
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
                    className={`p-2 ${lightness! >= 50 || (currentColor === "yellow" && lightness! >= 50) ? "text-black" : "text-white"}`}
                  >
                    {name} - {artist}
                  </p>
                  <div
                    className="ml-auto"
                    style={{ width: collageSize === 0 ? "12.5%" : "12.5%", height: "auto" }}
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
          <div className="w-full">{logos("faves")}</div>
        </div>
      </div>
    );
  };

  const art = () => {
    const allTracks =
      currentColor === "rainbow"
        ? collageToUse
        : hideDuplicates
          ? collages[`${currentColor}WithoutDupes`]
          : collages[currentColor];
    const tracks = allTracks.slice(0, collageSize === 0 ? 64 : 25);

    return (
      <div className={`flex flex-col justify-center items-center sm:max-w-lg`}>
        {header(tracks)}

        <div ref={artRef}>
          <div className="flex flex-row flex-wrap w-full sm:h-[512px]" ref={playlistRef}>
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
          {logos("mosaic")}
        </div>
      </div>
    );
  };

  const handleSliderChange = (value: any) => {
    console.log("here", value);
    const closest = snapPoints.find((snap) => snap.position.toString() === value);
    if (closest) {
      setCurrentColor(closest.color as Colors | "rainbow");
      setPickerColor(closest.position);
    }
  };

  return (
    <div
      className={`p-safe-t p-safe-r p-safe-b p-safe-l snap-start relative h-screen flex flex-col items-center`}
      key={color}
      style={{
        background: `linear-gradient(to bottom, ${currentColor === "rainbow" || currentColor === "black" ? "grey" : currentColor}, #000000)`,
      }}
    >
      <NavBar showLogout={true} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          Playlist created successfully
        </Alert>
      </Snackbar>
      <div className="flex w-full h-full justify-center items-center flex-col px-2 sm:px-0">
        {isMosaic ? art() : info()}
        <CustomSlider value={pickerColor} onChange={handleSliderChange} />
      </div>
    </div>
  );
};
export default Collage;
