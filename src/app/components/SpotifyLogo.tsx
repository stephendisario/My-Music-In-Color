import black from "../../../public/Spotify_Logo_RGB_Black.png";
import white from "../../../public/Spotify_Logo_RGB_White.png";
import green from "../../../public/Spotify_Logo_RGB_Green.png";
import Image from "next/image";

const SpotifyLogo = ({ color }: { color: "white" | "black" | "green" }) => {
  const logo = color === "white" ? white : color === "black" ? black : green;

  return (
    <div>
      <Image unoptimized src={logo} alt="Spotify Logo" width={100} />
    </div>
  );
};

export default SpotifyLogo;
