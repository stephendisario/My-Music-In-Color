import { redirect } from "next/navigation";

const Home = async () => {
  redirect("/dashboard");
};

export default Home;
