"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Tracks = () => {
  const [topTracks, setTopTracks] = useState<Track[]>();

  useEffect(() => {
    const pee = async () => {
      const poo = await fetch("/api/topTracks?time_range=long_term");
      const data = await poo.json();
      setTopTracks(data);
    };
    pee();
  }, []);

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center">
        {topTracks?.map((track) => {
          const images = track.album.images;
          const name = track.name;
          const image = images.reduce((maxHeightObj, currentObj) => {
            return currentObj.height < maxHeightObj.height ? currentObj : maxHeightObj;
          }, images[0]);

          return (
            <Image
              alt={name}
              width={64}
              height={64}
              src={image.url}
              key={track.id}
              className="p-1"
            />
          );
        })}
      </div>
    </div>
  );
};
export default Tracks;
