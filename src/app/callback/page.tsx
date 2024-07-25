"use client";
import React, { useEffect, useRef } from "react";
import { getToken } from "../actions/auth";
import { useRouter } from "next/navigation";

const Callback = () => {
  const router = useRouter();

  const isMounted = useRef(false);
  let urlParams;
  let code: string | null = "";
  let codeVerifier: string | null = "";
  if (typeof window !== "undefined") {
    urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get("code");
    codeVerifier = window.localStorage.getItem("codeVerifier");
  }

  useEffect(() => {
    if (!isMounted.current && code && codeVerifier) {
      getToken(code, codeVerifier);
    }
    if (!isMounted.current && code === null) {
      router.push("/login");
    }
    isMounted.current = true;

    return () => {
      localStorage.removeItem("codeVerifier");
    };
  }, [code, codeVerifier, router]);

  return (
    <div className="flex relative h-[calc(100dvh)] sm:h-screen justify-center items-center rainbow-background">
      Loading...
    </div>
  );
};

export default Callback;
