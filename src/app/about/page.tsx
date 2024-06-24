/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const About = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white min-h-screen px-4 py-10">
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar showLogout={false} />
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">
          About MyMusicInColor
        </h1>

        <section className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            What is MyMusicInColor?
          </h2>
          <p className="text-sm sm:text-lg leading-relaxed">
            Welcome to MyMusicInColor! We transform your top tracks into vibrant visual collages
            inspired by the colors of your favorite album art. Dive into a unique way of
            experiencing your music—through colorful Musaics that capture the essence of your
            musical journey.
          </p>
        </section>

        <section className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">How Does It Work?</h2>

          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            Top Tracks & Color Magic
          </h3>
          <p className="text-sm sm:text-lg leading-relaxed mb-2 sm:mb-4">
            By analyzing the dominant color of each album cover using ColorThief, we categorize your
            top tracks into distinct color groups: red, orange, yellow, green, blue, violet, black,
            and white.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            Crafting Colorful Musaics
          </h3>
          <p className="text-sm sm:text-lg leading-relaxed mb-2 sm:mb-4">
            Each Musaic is meticulously curated to reflect your musical preferences within each
            color category. Whether it's "My Musaic - Red," "My Musaic - Orange," or others, each
            collage is a personalized showcase of your favorite tracks in harmonious color
            arrangements.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Rainbow Musaic</h3>
          <p className="text-sm sm:text-lg leading-relaxed mb-2 sm:mb-4">
            Experience the full spectrum of your music collection with our stunning rainbow Musaic,
            blending all colors into a vibrant masterpiece.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            Switching Between Musaics and Faves
          </h3>
          <p className="text-sm sm:text-lg leading-relaxed mb-2 sm:mb-4">
            For each color category, you can effortlessly switch between viewing your Musaic and
            your top 8 favorite tracks ("My Faves"). Each track's box is filled with its dominant
            color, providing a focused and colorful overview of your music taste.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Sharing & Customizing</h3>
          <p className="text-sm sm:text-lg leading-relaxed">
            Share your Musaics and Faves on social media, download them as images, or create
            playlists directly from your colorful creations. Customize your experience further by
            choosing to show or hide duplicate images in your collages.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Why MyMusicInColor?</h2>
          <p className="text-sm sm:text-lg leading-relaxed">
            We believe music is more than sound—it's an immersive journey. MyMusicInColor enriches
            this journey by visualizing your musical taste in vibrant, shareable artworks. See your
            music in a new light and share your Musaics with the world!
          </p>
        </section>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-base sm:text-lg font-bold">
            Dive into your musical colors and create your Musaic today!
          </p>
          <p className="mt-2 text-base sm:text-lg">
            With MyMusicInColor, your music looks as good as it sounds. 🌈🎶
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

// const PrivacyPolicy = async () => {
//   return (
//     <div>
//       <NavBar showLogout={false} />
//       <div className="flex relative h-screen justify-center items-center">
//         <Link
//           href={"https://github.com/stephendisario/My-Music-In-Color"}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           GitHub
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;
