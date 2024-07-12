export const clientId = "53e53a540f804d048a8f6fc2c653ee0e";
export const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/callback";
export const authorizationEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";
export const scope =
  "user-read-private user-read-email playlist-modify-public user-top-read ugc-image-upload";
export const SPOTIFY_API_BASE_URL = "https://api.spotify.com";

export const collageConfig = {
  red: {
    rainbowCount: 12,
    hueRange: [0, 10, 350],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-red-800", "from-70%", "to-orange-900"],
  },
  orange: {
    rainbowCount: 8,
    hueRange: [11, 36],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-orange-900", "via-amber-600", "via-80%", "to-yellow-600"],
  },
  yellow: {
    rainbowCount: 8,
    hueRange: [47, 73],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-yellow-600", "from-70%", "to-zinc-900"],
  },
  green: {
    rainbowCount: 12,
    hueRange: [79, 169],
    saturationRange: [23, 100],
    lightnessRange: [15, 80],
    gradient: ["from-zinc-900", "from-10%", "via-green-600", "via-80%", "to-zinc-900"],
  },
  blue: {
    rainbowCount: 12,
    hueRange: [170, 260],
    saturationRange: [50, 100],
    lightnessRange: [20, 80],
    gradient: ["from-zinc-900", "from-10%", "via-80%", "via-blue-800", "to-violet-800"],
  },
  violet: {
    rainbowCount: 12,
    hueRange: [260, 340],
    saturationRange: [10, 100],
    lightnessRange: [20, 80],
    gradient: ["from-violet-800", "from-60%", "to-black"],
  },
  black: {
    rainbowCount: 12,
    hueRange: [0, 360],
    saturationRange: [0, 10],
    lightnessRange: [0, 10],
    gradient: ["from-black", "from-60%", "to-stone-700"],
  },
  white: {
    rainbowCount: 12,
    hueRange: [0, 360],
    saturationRange: [0, 100],
    lightnessRange: [90, 100],
    gradient: ["from-stone-700", "from-20%", "to-white"],
  },
};

export const snapPoints = [
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

export const gradients = {
  red: "from-red-500 to-red-700",
  orange: "from-orange-500 to-orange-700",
  yellow: "from-yellow-500 to-yellow-600",
  green: "from-green-500 to-green-800",
  blue: "from-blue-500 to-blue-800",
  violet: "from-violet-500 to-violet-800",
  black: "from-[#4b4b4b] to-[#1a1a1a]",
  white: "from-[#f0f0f0] to-[#b0b0b0]",
  rainbow: "from-stone-500 to-stone-800",
};

export const gradientsRaw = {
  red: "linear-gradient(to bottom, #ef4444, #b91c1c)",
  orange: "linear-gradient(to bottom, #f97316, #cs410c)",
  yellow: "linear-gradient(to bottom, #eab308, #ca8a04)",
  green: "linear-gradient(to bottom, #22c55e, #166534)",
  blue: "linear-gradient(to bottom, #3b82f6, #1e40af)",
  violet: "linear-gradient(to bottom, #8b5cf6, #5b21b6)",
  black: "linear-gradient(to bottom, #4b4b4b, #1a1a1a)",
  white: "linear-gradient(to bottom, #f0f0f0, #b0b0b0)",
  rainbow:
    "linear-gradient(45deg, #f56565 10%, #ed8936 30%, #ecc94b 50%, #48bb78 60%, #4299e1 70%, #9f7aea 80%, rgba(238,130,238,1) 100%)",
};
