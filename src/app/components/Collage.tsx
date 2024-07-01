"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import { getRainbowCollage, getTerm, toHslString } from "../lib/helper";
import CustomTooltip from "../components/CustomTooltip";
import { Collages, Colors, collageConfig } from "../dashboard/Collages";
import {
  addImageToPlaylist,
  addTracksToPlaylist,
  createPlaylist,
  getTopTracks,
  getUserProfile,
} from "../api/spotify";
import { Alert, Snackbar } from "@mui/material";
import { toBlob, toJpeg } from "html-to-image";
import SpotifyLogo from "./SpotifyLogo";
import IosShareIcon from "@mui/icons-material/IosShare";
import IconButton from "@mui/material/IconButton";
import CheckboxWithStyle from "./CheckboxWithStyle";
import DownloadIcon from "@mui/icons-material/Download";
import NavBar from "./NavBar";
import CircularProgress from "@mui/material/CircularProgress";
import { CirclePicker } from "react-color";
import Link from "next/link";
// Import FontAwesomeIcon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import specific icons
import { faShuffle, faXmark } from '@fortawesome/free-solid-svg-icons';

const snapPoints = [
  { color: "red", hex: "#ff0000" },
  { color: "orange", hex: "#ffa500" },
  { color: "yellow", hex: "#ffff00" },
  { color: "green", hex: "#008000" },
  { color: "blue", hex: "#0000ff" },
  { color: "violet", hex: "#ee82ee" },
  { color: "black", hex: "#000000" },
  { color: "white", hex: "#ffffff" },
  { color: "rainbow", hex: "#808080" },
];

const gradients = {
  red: "from-red-500 to-red-700",
  orange: "from-orange-500 to-orange-600",
  yellow: "from-yellow-500 to-yellow-600",
  green: "from-green-500 to-green-800",
  blue: "from-blue-500 to-blue-800",
  violet: "from-violet-500 to-violet-800",
  black: "from-[#4b4b4b] to-[#1a1a1a]",
  white: "from-[#f0f0f0] to-[#b0b0b0]",
  rainbow: "from-stone-500 to-stone-800",
};

const Collage = ({
  color,
  index,
  collages,
  id,
}: {
  color: Colors | "rainbow";
  index: number;
  collages: Collages;
  id: string;
}) => {
  const [currentColor, setCurrentColor] = useState<Colors | "rainbow">("rainbow");
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [rainbowCollage, setRainbowCollage] = useState<ColorTrack[]>([]);
  const [rainbowCollageWithoutDupes, setRainbowCollageWithoutDupes] = useState<ColorTrack[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCreatePlaylistLoading, setIsCreatePlaylistLoading] = useState<boolean>(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const [isShareLoading, setIsShareLoading] = useState<boolean>(false);
  const [shuffled, setShuffled] = useState<boolean>(false)

  const { name } = useMyContext();

  const [isMosaic, setIsMosaic] = useState<boolean>(true);

  const [pickerColor, setPickerColor] = useState(0);

  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  const collageToUse = hideDuplicates ? rainbowCollageWithoutDupes : rainbowCollage;

  const allTracks =
    currentColor === "rainbow"
      ? collageToUse
      : hideDuplicates
        ? collages[`${currentColor}WithoutDupes`]
        : collages[currentColor];

  let collageSize;
  let width;

  if (allTracks.length >= 64) {
    collageSize = 64;
    width = "12.5%";
  } else if (allTracks.length >= 49) {
    collageSize = 49;
    width = "14.285%";
  } else if (allTracks.length >= 36) {
    collageSize = 36;
    width = "16.66%";
  } else if (allTracks.length >= 25) {
    collageSize = 25;
    width = "20%";
  } else if (allTracks.length >= 16) {
    collageSize = 16;
    width = "25%";
  } else if (allTracks.length >= 9) {
    collageSize = 9;
    width = "33.33%";
  } else if (allTracks.length >= 4) {
    collageSize = 4;
    width = "50%";
  } else {
    collageSize = 1;
    width = "100%";
  }

  const collageTracks = allTracks.slice(0, collageSize);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleShuffle = () => {
    setShuffled(true)
    let rainbowArray: ColorTrack[] = [];

    (Object.keys(collageConfig) as Colors[]).forEach((color) => {
      let random = true
      if (color === "black" || color === "white") return;
      for (let i = 0; i < collageConfig[color].rainbowCount; i++) {
        //TODO: clean this up
        if (collages[`${color}WithoutDupes`].length <= collageConfig[color].rainbowCount) random = false;
        let index = random
          ? Math.floor(Math.random() * (collages[`${color}WithoutDupes`].length - 1))
          : i;
        while (random && rainbowArray.includes(collages[`${color}WithoutDupes`][index]))
          index = Math.floor(Math.random() * (collages[`${color}WithoutDupes`].length - 1));
        if (collages[`${color}WithoutDupes`][index])
          rainbowArray.push(collages[`${color}WithoutDupes`][index]);
      }
    })
    setRainbowCollageWithoutDupes(rainbowArray)
  }


  const handleCreatePlaylist = async (tracks: ColorTrack[]) => {
    setIsCreatePlaylistLoading(true);
    const playlistId = await createPlaylist(currentColor, "my musaic", id);
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
    setIsDownloadLoading(true);
    const ref = currRef;
    if (ref.current === null) {
      return;
    }

    const node = ref.current;
    const scale = 2; // Adjust the scale factor as needed

    const width = node.offsetWidth * scale;
    const height = node.offsetHeight * scale;
    // const backgroundColor = currentColor !== "white" ? 'black' : 'white';
    const backgroundColor = ''


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
          // backgroundColor,
          ...(isDownload && scaledObject),
        });
      }

      if (isDownload && !isShare && dataUrl) {
        const link = document.createElement("a");
        link.download = `my last year - ${currentColor}`;
        link.href = dataUrl as string;
        link.click();
        setIsDownloadLoading(false);
      } else return dataUrl;
    } catch (error: any) {
      console.error("Error downloading image", error.message);
    }
  };

  const shareImage = async () => {
    try {
      setIsShareLoading(true);
      const blob = await handleDownload(isMosaic ? artRef : infoRef, false, true);
      if (navigator.share) {
        await navigator.share({
          files: [
            new File([blob!], `my ${isMosaic ? "musaic" : "faves"} - ${currentColor}.png`, {
              type: "image/png",
              lastModified: new Date().getTime(),
            }),
          ],
        });
        setIsShareLoading(false);
      } else {
        setIsShareLoading(false);
        alert("Web Share API is not supported in your browser.");
      }

      setIsShareLoading(false);

      // Clean up the URL object after sharing
    } catch (error) {
      setIsShareLoading(false);
      console.error("Error sharing image:", error);
    }
  };

  useEffect(() => {
    // if (currentColor === "rainbow") {
    setRainbowCollage(getRainbowCollage(true, collages));
    setRainbowCollageWithoutDupes(getRainbowCollage(true, collages));
    // }
  }, [collages]);

  const header = (tracks: ColorTrack[]) => (
    <div className="flex flex-col w-full sm:w-[512px] justify-center items-center gap-2 relative mt-2">
      <div className="flex flex-row">
        <div className="sm:hidden">
          {/* <IconButton onClick={() => shareImage()}>
            <IosShareIcon sx={{ color: "black" }} />
          </IconButton> */}
          <button
            className={`${currentColor !== "white" ? "border-white bg-white text-black mix-blend-lighten hover:bg-[rgba(255,255,255,.8)]" : "border-black bg-black text-white mix-blend-darken hover:bg-[rgba(0,0,0,.8)]"} h-10 border-2 font-bold rounded-full text-lg text-nowrap h-full self-center	hover:bg-[rgba(0,0,0,.1)] w-[145px]`}
            onClick={() => {
              shareImage();
            }}
          >
            {isShareLoading ? <CircularProgress sx={{ color: "white" }} size={15} /> : "share"}
          </button>
        </div>
        <div className="sm:block hidden">
          {/* <IconButton onClick={() => handleDownload(isMosaic ? artRef : infoRef, true, false)}>
            <DownloadIcon sx={{ color: "black" }} />
          </IconButton> */}
          <button
            className={`${currentColor !== "white" ? "border-white bg-white text-black mix-blend-lighten hover:bg-[rgba(255,255,255,.8)]" : "border-black bg-black text-white mix-blend-darken hover:bg-[rgba(0,0,0,.8)]"} h-10 border-2  font-bold rounded-full text-lg text-nowrap h-full self-center w-[145px]`}
            onClick={() => {
              handleDownload(artRef, true, false);
            }}
          >
            {isDownloadLoading ? (
              <CircularProgress sx={{ color: "white" }} size={15} />
            ) : (
              "download"
            )}
          </button>
        </div>
        {/* {isMosaic && (
          <CheckboxWithStyle
            color={currentColor}
            hideDuplicates={hideDuplicates}
            setHideDuplicates={setHideDuplicates}
          />
        )} */}
      </div>

      <button
        className={`${currentColor !== "white" ? "text-white border-white" : "text-black border-black"} rounded-full text-lg text-nowrap h-full hover:bg-[rgba(0,0,0,.1)] w-[145px]`}
        onClick={() => {
          if (!isCreatePlaylistLoading) handleCreatePlaylist(tracks);
        }}
      >
        {isCreatePlaylistLoading ? (
          <CircularProgress sx={{ color: "white" }} size={15} />
        ) : (
          "create playlist"
        )}
      </button>
    </div>
  );

  const logos = useCallback(
    (words: string) => {
      const logosColor = currentColor === "white" ? "black" : "white";

      return (
        <div className={`pt-2 flex flex-row justify-between items-center logos`}>
          <div className="text-md" style={{ color: logosColor }}>
            {
              <p className="text-3xl">
                my musaic
              </p>
            }
            {<p className="opacity-80">mymusicincolor.com</p>}
            <div className="mt-6">
            <SpotifyLogo color={logosColor}/>
            </div>

          </div>
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
      <div className="flex flex-col justify-center items-center w-full sm:max-w-lg">
        <div ref={infoRef} className="flex flex-col w-full justify-center">
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
                    className={`w-[80%] text-sm text-ellipsis overflow-hidden text-wrap px-2 ${lightness! >= 50 || (currentColor === "yellow" && lightness! >= 50) ? "text-black" : "text-white"}`}
                  >
                    {name} - {artist}
                  </p>
                  <div className="ml-auto aspect-square" style={{ width: "12.5%", height: "auto" }}>
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
    return (
      <div ref={artRef} className={`flex flex-col justify-center items-center w-full sm:w-[580px] px-4 aspect-[9/16]`}
        style={{
          background:
                "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)",
        }}
      >
        <div className="w-full bg-black px-4 py-4 rounded-lg shadow-lg bg-opacity-75">
          <div className="flex flex-row flex-wrap w-full sm:h-[512px]" ref={playlistRef}>
            {collageTracks.map((track) => {
              const image = track?.album?.images?.[1]?.url;
              const name = track?.name;
              const spotifyUrl = track?.external_urls?.spotify;
              return (
                <CustomTooltip track={track} key={track.id}>
                  <div style={{ width: width, height: "auto" }}>
                    <Image
                      unoptimized
                      alt={name}
                      src={image}
                      width={300}
                      height={300}
                      className="w-full h-full"
                      crossOrigin="anonymous"
                      placeholder="blur"
                      blurDataURL={track.base64Url || ""}
                    />
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
          {logos("musaic")}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-safe-t p-safe-r p-safe-b p-safe-l snap-start relative h-screen flex flex-col items-center bg-gradient-to-b ${gradients[currentColor] !== "rainbow" && gradients[currentColor]}`}
      key={color}
      style={
        currentColor === "rainbow"
          ? {
              background:
                "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)",
            }
          : {}
      }
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
        {/* <div className="text-black text-4xl">mymusicincolor</div> */}
        <div className=" flex flex-row justify-between w-full sm:w-[512px] items-center relative h-[46px]">
          <p
            className={`${currentColor !== "white" ? "text-white border-white" : "text-black border-black"} text-3xl`}
          >
            my {isMosaic ? "musaic" : "faves"}
          </p>

          <div className="absolute left-1/2 transform -translate-x-1/2">
          <IconButton
            onClick={() => handleShuffle()}
          >
            <FontAwesomeIcon icon={faShuffle} size="lg" color={currentColor !== "white" ? 'white' : 'black'}/>
          </IconButton>
          </div>
          <div className={shuffled ? "visible" : "hidden"}>
          <IconButton
            onClick={() => {
              setShuffled(false)
              setRainbowCollageWithoutDupes(rainbowCollage)
            }}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" color={currentColor !== "white" ? 'white' : 'black'}/>
          </IconButton>
          </div>
          


          {/* <button
            className={`${currentColor !== "white" ? "text-white border-white" : "text-black border-black"} border-2 rounded-full text-lg text-nowrap w-28 hover:bg-[rgba(0,0,0,.1)] `}
            onClick={() => setIsMosaic((prevState) => !prevState)}
          >
            see {!isMosaic ? "musaic" : "faves"}
          </button> */}
        </div>
        {isMosaic ? art() : info()}
        {/* <CustomSlider value={pickerColor} onChange={handleSliderChange} /> */}
        <div className="flex flex-row">
        {/* <button
            className={`text-black rounded-full text-sm text-center self-center w-[26px] h-[26px] mr-[14px] transition-transform transform hover:scale-[1.2] ${currentColor === "rainbow" && "shadow-[0_0_2px_2px_rgba(255,255,255,0.4)]"}`}
            style={{
              background:
                "linear-gradient(45deg, rgba(255,0,0,1) 10%, rgba(255,165,0,1) 30%, rgba(255,255,0,1) 50%, rgba(0,128,0,1) 60%, rgba(0,0,255,1) 70%, rgba(75,0,130,1) 80%, rgba(238,130,238,1) 100%)",
            }}
            onClick={() => setCurrentColor("rainbow")}
          /> */}
         
          
        </div>
        {header(collageTracks)}
      </div>
    </div>
  );
};
export default Collage;
