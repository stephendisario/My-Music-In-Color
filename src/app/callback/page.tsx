"use client";
import React, { useEffect, useRef } from "react";
import { getToken } from "../actions/auth";

const Callback = () => {
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
    isMounted.current = true;

    return () => {
      localStorage.removeItem("codeVerifier");
    };
  }, [code, codeVerifier]);

  return <div>Loading...</div>;
};

export default Callback;
