import React from "react";
import NavBar from "../components/NavBar";

const PrivacyPolicy = async () => {
  return (
    <div>
      <NavBar showLogout={false} />
      <div className="flex relative h-screen justify-center items-center">
        Info about how your data is used and link to clear site access
      </div>
    </div>
  );
};

export default PrivacyPolicy;
