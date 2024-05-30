"use server";
import {
  authorizationEndpoint,
  clientId,
  redirectUrl,
  scope,
  tokenEndpoint,
} from "../lib/constants";
import { createSession, deleteSession } from "../lib/session";
import { RedirectType, redirect } from "next/navigation";

export async function login(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  redirect(authUrl.toString(), RedirectType.replace);
}

export async function logout() {
  deleteSession();
  redirect("/login");
}

export const getToken = async (code: string, codeVerifier: string) => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: codeVerifier,
    } as Record<string, string>),
  });

  const res = await response.json();
  await createSession(res.access_token);
  redirect("/dashboard", RedirectType.replace);
};
