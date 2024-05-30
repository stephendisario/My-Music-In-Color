"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface AnimatedImageProps {
  url: string;
}
//TODO: Changing screensize
const AnimatedImage: React.FC<AnimatedImageProps> = ({ url }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  });

  useEffect(() => {
    const image = imageRef.current!;
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const animate = (fromBottom = false) => {
      // Set initial random position
      const initialX = Math.random() * (screenWidth - image.offsetWidth);
      let initialY = fromBottom
        ? screenHeight
        : Math.random() * (2 * screenHeight - image.offsetHeight);

      //this varies the ordering of images from the bottom (sometimes add an offset so they start even lower)
      if (Math.random() < 0.5) initialY = initialY + Math.random() * screenHeight;

      setPosition({ x: initialX, y: initialY });
      // Calculate distance to travel based on screen height
      const distanceToTravel = initialY + image.offsetHeight;

      // Calculate duration based on distance and a constant speed
      const speed = 50 + Math.floor(Math.random() * 50) - 25; // Adjust speed as needed
      const duration = distanceToTravel / speed;

      // Animate image to move upwards
      image.animate(
        [
          { transform: `translate(${initialX}px, ${initialY}px)` },
          { transform: `translate(${initialX}px, ${-image.offsetHeight}px)` },
        ],
        {
          duration: duration * 1000, // Adjust duration as needed
          fill: "forwards",
          easing: "linear",
          delay: 0,
        }
      ).onfinish = () => {
        // Reset position to bottom
        setPosition({ x: initialX, y: screenHeight });
        console.log("finished");
        // Start animation again
        animate(true);
      };
    };
    setIsLoading(false);
    // Start animation when component mounts
    animate();
  }, []);

  return (
    <div
      ref={imageRef}
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <img
        src={url} // Replace with your image path
        alt="Your Image"
        width={150} // Adjust as needed
        height={150} // Adjust as needed
      />
    </div>
  );
};

export default AnimatedImage;
