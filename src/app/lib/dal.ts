import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  try {
    const cookie = cookies().get("session")?.value;
    if (!cookie) {
      redirect("/login");
    }

    const session = await decrypt(cookie);
    if (!session?.payload) {
      redirect("/login");
    }

    return { payload: session.payload };
  } catch (error) {
    console.error("Error verifying session:", error);
    redirect("/login");
  }
});
