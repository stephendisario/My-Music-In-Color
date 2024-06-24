/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white min-h-screen px-4 py-10">
      <div className="max-w-screen-md mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar showLogout={false} />
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">Privacy Policy</h1>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Introduction</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Welcome to MyMusicInColor ("we", "our", "us")! We are committed to protecting your
            privacy and handling your personal information with care. This Privacy Policy explains
            how we collect, use, and disclose information about you when you use our web application
            and services, particularly focusing on the handling of album art URLs and dominant
            colors stored in your local storage.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Information We Collect</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            To enhance your experience, we store a key-value object consisting of album art URLs and
            their corresponding dominant colors in your browser's local storage. This allows for
            faster load times of album color-themed collages ("Musaics") after your initial visit.
            This information is solely used for improving user experience and is not shared with
            third parties.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            How We Use Your Information
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            The information stored in your local storage is used for: - Personalization: Creating
            personalized Musaics based on your top tracks' album art colors. - Performance: Ensuring
            faster loading times of Musaics by retrieving color data locally rather than querying
            external resources repeatedly.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Data Security</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We prioritize the security of your information and implement appropriate technical and
            organizational measures to protect it against unauthorized access, disclosure,
            alteration, or destruction.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Your Choices and Rights
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            You can manage and delete the stored information in your local storage through your
            browser settings. If you choose to remove this data, it may affect the performance of
            personalized features within MyMusicInColor. You also have the right to access the
            information we hold about you and to request its deletion. You can exercise this right
            by contacting us using the details provided below.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Revoke Access</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            If you wish to revoke access to your information from MyMusicInColor or any third-party
            application, you can do so by visiting your{" "}
            <a
              href="https://www.spotify.com/account/apps/"
              className="text-blue-300 hover:underline"
            >
              Spotify Account Settings
            </a>{" "}
            and managing app permissions.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page with a revised effective date. Your
            continued use of MyMusicInColor after the changes signifies your acceptance of the
            updated Privacy Policy.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Contact Us</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            If you have any questions about this Privacy Policy or our privacy practices, or if you
            wish to request access or deletion of your data, please contact us at [Insert Contact
            Information].
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
