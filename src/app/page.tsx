import { redirect } from "next/navigation";
import { getTopTracks, getUserProfile } from "./api/spotify";

const Home = async () => {
  const user = await getUserProfile();
  const loadingTracks = await getTopTracks("short_term", 1);
  const topTracks = await getTopTracks("long_term");

  return (
    <div>hey {user?.display_name}</div>
  )

};

export default Home;
