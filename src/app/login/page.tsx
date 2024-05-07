"use client";
import React from "react";
import { login } from "../actions/auth";

const Login = () => {
  return <button onClick={() => login()}>Log In</button>;
};

export default Login;
