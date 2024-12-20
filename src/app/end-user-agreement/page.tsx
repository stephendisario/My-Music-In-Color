/* eslint-disable */
import React from "react";
import NavBar from "../components/NavBar";

const EndUserAgreement = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white min-h-screen px-4 py-10">
      <div className="max-w-screen-md flex flex-col mx-auto bg-black bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <NavBar />
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-center">
          End User Agreement
        </h1>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Disclaimer of Warranties</h2>
          <p className="text-lg leading-relaxed mb-2">
            By using mymusicincolor, you acknowledge and agree that mymusicincolor makes no
            warranties or representations on behalf of Spotify, including any implied warranties of
            merchantability, fitness for a particular purpose, or non-infringement with respect to
            the Spotify Platform, Spotify Service, or Spotify Content. All such warranties are
            expressly disclaimed to the fullest extent allowed by law.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Prohibited Activities</h2>
          <p className="text-lg leading-relaxed mb-2">
            You agree not to modify, adapt, translate, or create derivative works based on the
            Spotify Platform, Spotify Service, or Spotify Content. Additionally, you are prohibited
            from decompiling, reverse-engineering, disassembling, or otherwise reducing the Spotify
            Platform, Spotify Service, or Spotify Content to source code or any human-perceivable
            form, except to the extent allowed by applicable law.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Liability Disclaimer</h2>
          <p className="text-lg leading-relaxed mb-2">
            You understand and agree that you are solely responsible for your use of mymusicincolor,
            and that mymusicincolor disclaims any liability for third-party services, including but
            not limited to Spotify. You agree to hold mymusicincolor harmless from any claims,
            losses, or damages arising from your use of the service.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Spotify as a Third-Party Beneficiary</h2>
          <p className="text-lg leading-relaxed mb-2">
            You acknowledge and agree that Spotify is a third-party beneficiary of this End User
            Agreement and is entitled to enforce its provisions directly against you.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold mb-2">Agreement Acceptance</h2>
          <p className="text-lg leading-relaxed mb-2">
            By using mymusicincolor, you confirm your acceptance of this End User Agreement. If you
            do not agree to these terms, you must refrain from using the app and its services.
          </p>
        </section>
      </div>
    </div>
  );
};

export default EndUserAgreement;
