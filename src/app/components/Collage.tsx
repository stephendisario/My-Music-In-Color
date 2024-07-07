"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMyContext } from "../components/ColorContext";
import Image from "next/image";
import { shuffle } from "../lib/helper";
import CustomTooltip from "../components/CustomTooltip";
import { addImageToPlaylist, addTracksToPlaylist, createPlaylist } from "../api/spotify";
import { toBlob, toJpeg } from "html-to-image";
import SpotifyLogo from "./SpotifyLogo";
import IconButton from "@mui/material/IconButton";
import NavBar from "./NavBar";
import CircularProgress from "@mui/material/CircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faShuffle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { collageConfig, gradients, snapPoints } from "../lib/constants";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { lilita_one, signika } from "../layout";

const Collage = () => {
  const { collages, setCollages, id, isMobile, collageParameters, setLoading } = useMyContext();
  const [currentColor, setCurrentColor] = useState<Colors | "rainbow">("rainbow");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [shuffled, setShuffled] = useState<boolean>(false);
  const [showColorTooltip, setShowColorTooltip] = useState<boolean>(false);
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>("playlist created successfully");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "warning">("success");

  const [isCreatePlaylistLoading, setIsCreatePlaylistLoading] = useState<boolean>(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const [isShareLoading, setIsShareLoading] = useState<boolean>(false);

  const artRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const total = useMemo(() => {
    return (Object.keys(collageConfig) as Colors[]).reduce(
      (sum, color) => sum + collages[color].length,
      0
    );
  }, []);

  const handleResetCollage = () => {
    setShuffled(false);
    setCollages((prevState) => {
      return { ...prevState, [`${currentColor}Displayed`]: prevState[currentColor].slice(0, 64) };
    });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleShuffle = () => {
    setShuffled(true);
    let rainbowArray: ColorTrack[] = [];

    if (currentColor === "rainbow") {
      //TODO: messy rainbow collage shuffler
      (Object.keys(collageConfig) as Colors[]).forEach((color) => {
        let random = true;
        if (color === "black" || color === "white") return;
        for (let i = 0; i < collageConfig[color].rainbowCount; i++) {
          if (collages[color].length <= collageConfig[color].rainbowCount) random = false;
          let index = random ? Math.floor(Math.random() * (collages[color].length - 1)) : i;
          while (random && rainbowArray.includes(collages[color][index]))
            index = Math.floor(Math.random() * (collages[color].length - 1));
          if (collages[color][index]) rainbowArray.push(collages[color][index]);
        }
      });
    }

    setCollages((prevState) => {
      let shuffled;
      if (rainbowArray.length > 0) shuffled = rainbowArray;
      else {
        const copiedColor = JSON.parse(JSON.stringify(prevState[`${currentColor}`]));
        shuffled = shuffle(copiedColor).slice(0, 64);
      }
      return {
        ...prevState,
        [`${currentColor}Displayed`]: shuffled,
      };
    });
  };

  const handleCreatePlaylist = async (tracks: ColorTrack[]) => {
    setAlertMessage("playlist created successfully");
    setAlertSeverity("success");
    setIsCreatePlaylistLoading(true);
    const playlistId = await createPlaylist(currentColor, "my musaic", id);
    await addTracksToPlaylist(
      playlistId,
      tracks.map((track) => track.uri)
    );
    let dataUrl: string = (await handleDownload(playlistRef, false, false)) as string;
    dataUrl = dataUrl?.split(",")[1];

    const response = await addImageToPlaylist(playlistId, dataUrl!);

    if (response !== 202) {
      setAlertMessage("playlist image failed to save, please try again");
      setAlertSeverity("warning");
    }

    setIsCreatePlaylistLoading(false);
    setOpenSnackbar(true);
  };

  const handleDownload = async (currRef: any, isDownload: boolean, isShare: boolean) => {
    if (currRef.current === null) {
      return;
    }

    const node = currRef.current;
    const scale = 2;

    const width = node.offsetWidth * scale;
    const height = node.offsetHeight * scale;

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

    // safari bug where the image may not be loaded in time
    // ensure it is by calling function multiple times
    try {
      let dataUrl;
      if (isShare) {
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          ...scaledObject,
        });
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          ...scaledObject,
        });
        await toBlob(node, {
          quality: 1,
          cacheBust: true,
          ...scaledObject,
        });

        dataUrl = await toBlob(node, {
          quality: 1,
          cacheBust: true,
          ...scaledObject,
        });
      } else {
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          ...(isDownload && scaledObject),
        });
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          ...(isDownload && scaledObject),
        });
        await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          ...(isDownload && scaledObject),
        });

        dataUrl = await toJpeg(node, {
          quality: isDownload ? 1 : 0.3,
          cacheBust: true,
          ...(isDownload && scaledObject),
        });
      }

      if (isDownload && dataUrl) {
        const link = document.createElement("a");
        link.download = `my musaic - ${currentColor}`;
        link.href = dataUrl as string;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloadLoading(false);
      } else {
        return dataUrl;
      }
    } catch (error: any) {
      setIsDownloadLoading(false);
      alert(error.message);
    }
  };

  const shareImage = async () => {
    try {
      const blob = await handleDownload(artRef, false, true);
      if (navigator.share) {
        await navigator.share({
          files: [
            new File([blob!], `my musaic - ${currentColor}.png`, {
              type: "image/png",
              lastModified: new Date().getTime(),
            }),
          ],
        });
      } else {
        setIsShareLoading(false);
        alert("Web Share API is not supported in your browser.");
      }

      setIsShareLoading(false);
    } catch (error: any) {
      setIsShareLoading(false);
      console.error("Error sharing image:", error);
    }
  };

  const header = (tracks: ColorTrack[]) => (
    <div className="flex flex-col w-full grow sm:h-md:w-[422px] sm:h-lg:w-[548px] justify-center items-center gap-2 relative mt-2 px-4">
      <div
        className="absolute top-0 left-0 flex flex-col h-10"
        style={{ padding: isMobile ? "inherit" : "" }}
      >
        <div className="flex flex-row items-start">
          <IconButton onClick={() => handleShuffle()} sx={{ marginTop: "-8px" }}>
            <FontAwesomeIcon
              icon={faShuffle}
              color={currentColor !== "white" ? "white" : "black"}
            />
          </IconButton>
          <div className={`items-start flex flex-row ${shuffled ? "visible" : "invisible"}`}>
            <IconButton onClick={handleResetCollage} sx={{ width: "120%", marginTop: "-8px" }}>
              <FontAwesomeIcon
                icon={faXmark}
                color={currentColor !== "white" ? "white" : "black"}
              />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="flex flex-col grow justify-center">
        <div className="sm:hidden">
          <button
            className={`${currentColor !== "white" ? `border-white bg-white text-black mix-blend-lighten hover:bg-[rgba(255,255,255,.8)] ${isShareLoading && "bg-[rgba(255,255,255,.8)]"}` : `border-black bg-black text-white mix-blend-darken hover:bg-[rgba(0,0,0,.8)] ${isShareLoading && "bg-[rgba(0,0,0,.8)]"}`} h-10 border-2 rounded-full font-semibold text-lg text-nowrap h-full self-center w-[145px]`}
            onClick={() => {
              setIsShareLoading(true);
              if (!isShareLoading) shareImage();
            }}
          >
            {isShareLoading ? <CircularProgress sx={{ color: "white" }} size={15} /> : "share"}
          </button>
        </div>
        <div className="sm:block hidden">
          <button
            className={`${currentColor !== "white" ? `border-white bg-white text-black mix-blend-lighten hover:bg-[rgba(255,255,255,.8)] ${isDownloadLoading && "bg-[rgba(255,255,255,.8)]"}` : `border-black bg-black text-white mix-blend-darken hover:bg-[rgba(0,0,0,.8)] ${isDownloadLoading && "bg-[rgba(0,0,0,.8)]"}`} h-10 border-2 rounded-full font-semibold text-lg text-nowrap h-full self-center w-[145px]`}
            onClick={() => {
              setIsDownloadLoading(true);
              if (!isDownloadLoading) handleDownload(artRef, true, false);
            }}
          >
            {isDownloadLoading ? (
              <CircularProgress sx={{ color: "white" }} size={15} />
            ) : (
              "download"
            )}
          </button>
        </div>

        <button
          className={`${currentColor !== "white" ? "text-white border-white" : "text-black border-black"} mt-1 rounded-full text-lg text-nowrap hover:bg-[rgba(0,0,0,.1)] ${isCreatePlaylistLoading && "bg-[rgba(0,0,0,.1)]"} w-[145px]`}
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
        {/* <div className="sm:hidden h-[10%]"></div> */}
      </div>
      <div
        className=" absolute top-0 right-0 flex flex-row items-start"
        style={{ paddingRight: isMobile ? "inherit" : "" }}
      >
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 400 }}
          open={showColorTooltip}
          onClose={(e: any) => {
            if (
              !isMobile &&
              e?.relatedTarget?.title &&
              snapPoints.some((s) => s.color === e.relatedTarget.title)
            ) {
            } else setShowColorTooltip(false);
          }}
          disableHoverListener
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "rgba(0,0,0,0)",
              },
            },
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: isMobile ? "4px" : "8px",
                  },
              },
            },
          }}
          enterTouchDelay={0}
          leaveTouchDelay={20000}
          placement={"top-end"}
          title={
            <div
              className={`flex gap-2 ml-[50%] w-1/2 sm:pr-2 justify-end items-center hover:cursor-pointer flex-row flex-wrap`}
            >
              {(
                Object.keys(collages).filter((c) => !c.includes("Displayed")) as (
                  | Colors
                  | "rainbow"
                )[]
              ).map((color) => (
                <button
                  title={color}
                  key={color}
                  onClick={() => {
                    if (currentColor !== color) {
                      handleResetCollage();
                      setCurrentColor(color);
                    }
                    setShowColorTooltip(false);
                  }}
                  style={{
                    background:
                      color === "rainbow"
                        ? "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)"
                        : "",
                  }}
                  className={`h-8 w-8  ${color === currentColor && "shadow-white-glow"} rounded-full bg-gradient-to-br ${gradients[color] !== "rainbow" && gradients[color]}`}
                ></button>
              ))}
            </div>
          }
        >
          <IconButton
            onClick={() => setShowColorTooltip((prevState) => !prevState)}
            sx={{ marginTop: "-8px" }}
          >
            <FontAwesomeIcon
              icon={faPalette}
              color={currentColor !== "white" ? "white" : "black"}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );

  const logos = useCallback(() => {
    const logosColor = "white";
    return (
      <div className={`pt-2 flex flex-row justify-between items-center logos`}>
        <div className="text-md" style={{ color: logosColor }}>
          {<p className={`text-4xl ${signika.className}`}>my musaic</p>}
          {<p className="opacity-80">mymusicincolor.com</p>}
          <div className="mt-6">
            <SpotifyLogo color={logosColor} />
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="relative overflow-y-hidden">
      <div
        className={`relative h-[calc(100dvh)] sm:h-screen flex flex-col justify-center items-center bg-gradient-to-b ${gradients[currentColor] !== "rainbow" && gradients[currentColor]} z-30`}
        style={{
          background:
            currentColor === "rainbow"
              ? "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)"
              : "",
        }}
      >
        <NavBar showLogout={true} color={currentColor === "white" ? "black" : "white"} />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={alertSeverity}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
        <div className="flex w-full sm:h-lg:w-[576px] sm:h-md:w-[450px] h-full justify-center relative items-center flex-col sm:overflow-y-auto">
          <div className="flex grow"></div>

          {!isMobile && (
            <div className={`text-4xl  w-full px-4 mb-1`}>
              <p
                className={`${currentColor === "white" ? "text-black" : "text-white"} flex items-start`}
              >
                mymusicincolor
              </p>
            </div>
          )}
          <div className={`flex flex-col justify-center items-center w-full px-4`}>
            <div className="w-full bg-black p-4 rounded-lg shadow-lg bg-opacity-75">
              <div className="flex flex-row flex-wrap" ref={playlistRef}>
                {collages[`${currentColor}Displayed`]
                  .slice(0, collageParameters[currentColor].size)
                  .map((track, index) => {
                    const image = track?.album?.images?.[1]?.url;
                    const name = track?.name;
                    return (
                      <CustomTooltip track={track} key={track.id + index.toString()}>
                        <div
                          className="aspect-square"
                          style={{ width: collageParameters[currentColor].width, height: "auto" }}
                        >
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
              {logos()}
            </div>
          </div>
          {header(
            collages[`${currentColor}Displayed`].slice(0, collageParameters[currentColor].size)
          )}
        </div>
      </div>

      {/* BELOW IS USED FOR IMAGE DOWNLOAD */}

      <div
        className={`absolute top-0 left-0 right-0 mx-auto z-80 h-[calc(100dvh)] sm:h-screen flex flex-col items-center`}
      >
        <div className="flex w-full sm:w-[576px] h-full justify-center items-center flex-col">
          <div
            ref={artRef}
            className={` aspect-[9/16] flex flex-col justify-center items-center w-full px-4 bg-gradient-to-b ${gradients[currentColor] !== "rainbow" && gradients[currentColor]}`}
            style={{
              background:
                currentColor === "rainbow"
                  ? "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)"
                  : "",
            }}
          >
            <div className="w-full bg-black p-4 rounded-lg bg-opacity-75">
              <div className="flex flex-row flex-wrap">
                {collages[`${currentColor}Displayed`]
                  .slice(0, collageParameters[currentColor].size)
                  .map((track) => {
                    const image = track?.album?.images?.[1]?.url;
                    const name = track?.name;
                    return (
                      <div
                        className="aspect-square"
                        style={{ width: collageParameters[currentColor].width, height: "auto" }}
                        key={track.id}
                      >
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
                    );
                  })}
              </div>
              {logos()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Collage;
