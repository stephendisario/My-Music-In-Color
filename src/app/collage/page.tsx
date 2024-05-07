import React from "react";
import { getUserProfile } from "../api/spotify";

const Collage = async () => {
  const user = await getUserProfile();

  return <div>Collage + {user.email}</div>;
};

export default Collage;
