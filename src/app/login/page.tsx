"use client";
import React, { useEffect } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";

const Login = () => {
  const codeVerifier = generateRandomString(64);

  useEffect(() => {
    localStorage.setItem("codeVerifier", codeVerifier);
  }, [codeVerifier]);

  return <button onClick={() => login(codeVerifier)}>Log In</button>;
};

export default Login;
