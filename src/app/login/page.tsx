"use client";
import React, { useEffect } from "react";
import { login } from "../actions/auth";
import { generateRandomString } from "../lib/helper";
import { Button } from "@mui/material";

const Login = () => {
  const codeVerifier = generateRandomString(64);

  useEffect(() => {
    localStorage.setItem("codeVerifier", codeVerifier);
    const test = localStorage.getItem("colorMap");
    const obj = test ? JSON.parse(test) : undefined;
    if (obj) console.log("localstore size", Object.keys(obj).length);
  }, [codeVerifier]);

  return (
    <div className="flex relative h-screen justify-center items-center">
      <Button variant="outlined" onClick={() => login(codeVerifier)}>
        Log In
      </Button>
    </div>
  );
};

export default Login;
