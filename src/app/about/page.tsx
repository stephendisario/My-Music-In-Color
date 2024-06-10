import React from "react";
import NavBar from "../components/NavBar";
import Link from "next/link";

const PrivacyPolicy = async () => {
  return (
    <div>
      <NavBar showLogout={false} />
      <div className="flex relative h-screen justify-center items-center">
        <Link
          href={"https://github.com/stephendisario/My-Music-In-Color"}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
