import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

export const verifySession = async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.payload) {
    redirect("/login");
  }

  return { payload: session?.payload };
};
