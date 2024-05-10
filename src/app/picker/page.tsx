import React, { Suspense } from "react";
import Tracks from "./tracks";
import { SketchPicker } from "react-color";

const Picker = async () => {
  return (
    <div className="bg-green-500">
      <div className="flex flex-col items-center justify-center min-h-36 ">
        This is where the color picker will go
      </div>
      <Suspense fallback={<p>Loading Songs...</p>}>
        <Tracks />
      </Suspense>
    </div>
  );
};

export default Picker;
