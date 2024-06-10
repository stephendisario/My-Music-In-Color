"use client";
import Link from "next/link";
import { logout } from "../actions/auth";

const NavBar = ({ showLogout }: { showLogout: boolean }) => {
  return (
    <div className="z-50 w-full bg-transparent">
      <div className="flex flex-row justify-between p-2">
        {showLogout ? <button onClick={() => logout()}>Log Out</button> : <div></div>}
        <ul className="flex gap-4">
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
