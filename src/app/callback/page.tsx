"use client";
import React, { useEffect, useRef } from "react";
import { getToken } from "../actions/auth";
import { useRouter } from "next/navigation";
import { createSession } from "../lib/session";

const Callback = () => {
  const router = useRouter();
  const isMounted = useRef(false);
  let urlParams;
  let code: string | null = "";
  if (typeof window !== "undefined") {
    urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get("code");
  }

  useEffect(() => {
    if (!isMounted.current && code) {
      getToken(code);
    }
    isMounted.current = true;
  }, [code]);

  return <div>Loading...</div>;
};

export default Callback;
