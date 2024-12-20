/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white min-h-screen px-4 py-10">
      <div className="max-w-screen-md flex flex-col mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar />
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-center">
          Privacy Policy
        </h1>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Data Collection and Use</h2>
          <p className="text-lg leading-relaxed mb-2">
            Your use of mymusicincolor is subject to the privacy policy. By accessing and using the
            service, you consent to the collection and use of your personal data as described in
            this privacy policy. Only necessary data is collected to provide the functionality of
            the app, and your personal information is neither stored nor shared outside of what is
            required for the service.
          </p>
          <p className="text-lg leading-relaxed">
            You can disconnect your Spotify account from mymusicincolor at any time by going to
            your&nbsp;
            <a
              href="https://www.spotify.com/account/apps/"
              className="text-blue-300 hover:underline"
            >
              Manage App Settings
            </a>
            .
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Information I Collect and How It's Used</h2>
          <p className="text-lg leading-relaxed mb-2">
            I collect information related to your Spotify account, such as your top tracks and
            profile metadata. Information is collected directly from Spotify via the Spotify API,
            used to generate your musaics, and never shared with third parties.
          </p>
          <p className="text-lg leading-relaxed mb-2">
            With your explicit consent, I may also create playlists on your behalf using your
            Spotify account. These playlists will include tracks from your musaics and will be
            labeled accordingly within your Spotify library. You retain full control over these
            playlists and can delete them at any time.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contacting Me Regarding Your Information</h2>
          <p className="text-lg leading-relaxed mb-2">
            If you have any inquiries regarding your personal information, please contact me
            at&nbsp;
            <a href="mailto:stephendisario2@gmail.com" className="text-blue-300 hover:underline">
              stephendisario2@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Use of Cookies</h2>
          <p className="text-lg leading-relaxed mb-2">
            mymusicincolor uses cookies to manage your Spotify Access Token and ensure secure
            session management. These cookies are temporary and expire automatically after an hour
            or when you log out.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Third-Party Cookies</h2>
          <p className="text-lg leading-relaxed mb-2">
            I do not allow third parties to place cookies on users' browsers for tracking their
            browsing activities.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Cookie Management</h2>
          <p className="text-lg leading-relaxed mb-6">
            You can manage or disable cookies through your browser settings. Most browsers allow you
            to block cookies, clear existing cookies, or receive notifications when cookies are
            being used. Please note that disabling cookies may affect the functionality of
            mymusicincolor, such as maintaining your Spotify session.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
