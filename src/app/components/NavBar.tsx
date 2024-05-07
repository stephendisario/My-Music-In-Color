"use client";
import Link from "next/link";

const NavBar = () => {
  return (
    <span className="flex justify-between">
      <h1 className="text-xl">Navigation Bar</h1>
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/collage">Collage</Link>
        </li>
        <li>
          <Link href="/playlist">Playlist</Link>
        </li>
        <li>
          <Link href="/picker">Picker</Link>
        </li>
      </ul>
    </span>
  );
};

export default NavBar;
