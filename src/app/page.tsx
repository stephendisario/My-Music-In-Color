import React from "react";
import { getUserProfile } from "./api/spotify";
import Image from "next/image";

const Home = async () => {
  const user = await getUserProfile();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Image alt="profile picture" width={150} src={user?.images[1].url} />
      <p>Wasup {user?.display_name}</p>
    </main>
  );
};
export default Home;
