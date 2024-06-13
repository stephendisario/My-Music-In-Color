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
import { HuePicker } from "react-color";
import CustomSlider from "./CustomSlider";

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
  const [pickerColor, setPickerColor] = useState(0);

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

  // const handleCreatePlaylist = async (tracks: ColorTrack[]) => {
  //   setIsCreatePlaylistLoading(true);
  //   const playlistId = await createPlaylist(currentColor, getTerm(tabValue), id);
  //   await addTracksToPlaylist(
  //     playlistId,
  //     tracks.map((track) => track.uri)
  //   );
  //   let dataUrl = await handleDownload(playlistRef, false);
  //   dataUrl = dataUrl?.split(",")[1];

  //   await addImageToPlaylist(playlistId, dataUrl!);

  //   setIsCreatePlaylistLoading(false);
  //   setOpenSnackbar(true);
  // };

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
        await toBlob(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });
        await toBlob(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });
        await toBlob(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });

        const dataUrl = await toBlob(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          backgroundColor,
          ...(isDownload && scaledObject),
        });

        if (isDownload) {
          const link = document.createElement("a");
          link.download = `${getTerm(tabValue)} - ${currentColor}`;
          // link.href = dataUrl;
          link.click();
        } else return dataUrl;
      } catch (error: any) {
        console.error("Error downloading image", error.message);
      }
    },
    [infoRef, artRef]
  );

  const shareImage = async () => {
    try {
      // Convert base64 string to Blob
      const blob = await handleDownload(infoRef, false);
      // const byteCharacters = atob(url?.split(",")[1]!);
      // const byteNumbers = new Array(byteCharacters.length);
      // for (let i = 0; i < byteCharacters.length; i++) {
      //   byteNumbers[i] = byteCharacters.charCodeAt(i);
      // }
      // const byteArray = new Uint8Array(byteNumbers);
      // const blob = new Blob([byteArray], { type: "image/jpeg" });

      // // Create URL from Blob
      // const imageUrl = URL.createObjectURL(blob);

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          files: [new File([blob!], "test.png", { type: "image/png",
            lastModified: new Date().getTime(),
           })],
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

  const logos = useCallback(
    (words: string) => {
      // const logosColor = currentColor === "rainbow" || currentColor === "white" ? "black" : "white";
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
      <div className="flex flex-col justify-start sm:justify-center items-center sm:max-w-lg">
        {/* <div className="flex flex-row justify-center">
        <Tabs
            value={collageSize}
            onChange={(_e, v) => handleCollageSize(v)}
            aria-label="basic tabs example"
          >
            <Tab label="mosaic" />
            <Tab label="faves" />
          </Tabs>
        </div> */}
        <Button sx={{ fontSize: "10px" }} onClick={() => handleDownload(infoRef, true)}>
          Download Image
        </Button>
        <Button sx={{ fontSize: "10px" }} onClick={() => shareImage()}>
          Share Image
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
      <div className={`flex flex-col justify-start sm:justify-center items-center sm:max-w-lg `}>
        {/* <div className="flex flex-row justify-center">
          <Tabs
            value={collageSize}
            onChange={(_e, v) => handleCollageSize(v)}
            aria-label="basic tabs example"
          >
            <Tab label="mosaic" />
            <Tab label="faves" />
          </Tabs>
        </div> */}

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
            // onClick={() => handleCreatePlaylist(tracks)}
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
      className={`p-safe-t p-safe-r p-safe-b p-safe-l snap-start relative h-screen flex flex-col`}
      key={color}
      style={{
        background: `linear-gradient(to bottom, ${currentColor === "rainbow" || currentColor === "black" ? "grey" : currentColor}, #000000)`,
      }}
    >
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
        <div className="flex w-full h-full justify-center itemss-center flex-col">
          <div className="flex flex-row">
            <div className="flex-shrink-0 w-screen sm:w-1/2 snap-start flex justify-center pl-16">
              {info()}
            </div>
            <div className="flex-shrink-0 w-screen sm:w-1/2 snap-start flex justify-center pr-16">
              {art()}
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* <HuePicker
                color={huePickerColor}
                onChange={(color) => {
                  const closest = findClosestSnapPoint(color.hsl.h)
                  setCurrentColor(closest.color as Colors | 'rainbow')
                  setHuePickerColor({ h: closest.position, s: color.hsl.s * 100, l: color.hsl.l * 100 });
                }}
              /> */}
            <CustomSlider value={pickerColor} onChange={handleSliderChange} />
          </div>
          {/* <div className="flex items-center justify-center min-h-16 bg-gray-200">
      <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-2">Custom Gradient Slider</h2>
        <CustomSlider />
      </div>
    </div> */}
        </div>
      </div>
    </div>
  );
};
export default Collage;
