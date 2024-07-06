/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const About = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white min-h-screen px-4 py-10">
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar showLogout={false} />
        {/* <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">
          About mymusicincolor
        </h1> */}

        <section className="mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-2 sm:mb-2 text-center text-underline">
            About
          </h2>

          <p className="text-md sm:text-lg leading-relaxed text-center">
            mymusicincolor groups your top tracks from the past year by color and creates
          </p>
          <p className="text-md sm:text-lg leading-relaxed text-center">~ colorful musaics ~</p>
        </section>

        <section className="mb-4 sm:mb-8">
          <h3 className="text-3xl sm:text-4xl font-semibold mb-1 sm:mb-2 text-center">Features</h3>
          <h2 className="text-xl sm:text-2xl font-semibold ">share</h2>
          <p className="text-md sm:text-base leading-relaxed mb-2 sm:mb-4">
            on mobile, use the share button to share or save your musaic. on desktop, use the
            download button to save your musaic.
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold ">create</h2>
          <p className="text-md sm:text-base leading-relaxed mb-2 sm:mb-4">
            save a new playlist to your Spotify with the create playlist button. the playlist
            includes the tracks from your musaic, and the playlist cover is set to your musaic.
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold ">pick</h2>
          <p className="text-md sm:text-base leading-relaxed mb-2 sm:mb-4">
            switch between color groups using the color palette icon. click it to reveal all
            available colors.
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold ">shuffle</h2>
          <p className="text-md sm:text-base leading-relaxed mb-1">
            mix it up! shuffle any color group to see a new random set of tracks. to reset to the
            default top tracks, click the X icon.
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-2 sm:mb-4">
            ** if you don't have enough songs, shuffling will reorder the existing ones **
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold ">interact</h2>
          <p className="text-md sm:text-base leading-relaxed mb-2 sm:mb-4">
            click or hover an album art to see the song title and artist. the popup is set to the
            dominant color of the album art. click the popup to play on spotify.{" "}
          </p>
        </section>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-base sm:text-lg">
            made by Stephen Disario -{" "}
            <a
              href="https://github.com/stephendisario/My-Music-In-Color"
              className="text-blue-300 hover:underline"
            >
              GitHub
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
