/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white h-screen px-4 py-10">
      <div className="max-w-screen-md flex flex-col mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar />
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-center">
          Privacy Policy
        </h1>

        <section className="mb-4 sm:mb-6">
          <p className="text-lg leading-relaxed mb-2">
            mymusicincolor accesses your Spotify profile to retrieve your top tracks and create
            playlists on your behalf.
          </p>
          <p className="text-lg leading-relaxed mb-2">
            mymusicincolor does not store or share any of your personal data.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            mymusicincolor respects your privacy and adheres to Spotify's guidelines by only
            accessing the data necessary to operate the service.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            by using this app, you agree to the use of your data described above.
          </p>
        </section>

        <p className="text-lg leading-relaxed">
          you can disconnect your Spotify account from mymusicincolor at any time by going to
          your&nbsp;
          <a href="https://www.spotify.com/account/apps/" className="text-blue-300 hover:underline">
            Manage App Settings
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
