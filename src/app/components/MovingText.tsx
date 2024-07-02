import React from "react";
import { useMyContext } from "./ColorContext";

const MovingText = ({ isMusaic = false }: { isMusaic?: boolean }) => {
  const { isMobile } = useMyContext();
  const text = "mymusicincolor";
  const repeatedText = Array(100)
    .fill(text)
    .join(!isMobile ? "\u00A0\u00A0\u00A0\u00A0\u00A0" : "\u00A0\u00A0"); // Repeat and join with non-breaking spaces
  const repeatedTextMiddle = Array(100).fill(text).join("\u00A0\u00A0"); // Repeat and join with non-breaking spaces

  return (
    <div className="absolute h-screen w-screen text-8xl opacity-50 flex flex-col overflow-hidden text-black">
      <div>
        <div className={`${isMobile ? "mobile-move-text" : "move-text"}`}>{repeatedText}</div>
        <div className={`${isMobile ? "mobile-move-text-2" : "move-text-2"}`}>{repeatedText}</div>
      </div>

      <div className="mt-auto mb-auto border-top border-2 border-bottom border-white">
        <div className={`text-white text-5xl ${isMobile ? "mobile-move-text-l" : "move-text-l"}`}>
          {repeatedTextMiddle}
        </div>
      </div>

      <div className="">
        <div className={`${isMobile ? "mobile-move-text" : "move-text"}`}>{repeatedText}</div>
        <div className={`${isMobile ? "mobile-move-text-2" : "move-text-2"}`}>{repeatedText}</div>
      </div>
    </div>
  );
};

export default MovingText;
