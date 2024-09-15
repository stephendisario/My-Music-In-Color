"use client";
import React, { useState } from "react";
import Link from "next/link";
import { logout } from "../actions/auth";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMyContext } from "./ColorContext";

const NavBar = ({ color = "white", hidden = false }: { color?: string; hidden?: boolean }) => {
  const { loggedIn } = useMyContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={`absolute z-50 top-0 right-0 ${hidden && "hidden"}`}>
      <IconButton onClick={(event) => handleClick(event)} className="">
        <MenuIcon sx={{ color: color }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "white", // Change this to your desired background color
          },
        }}
      >
        <Link href={"/dashboard"}>
          {loggedIn && (
            <MenuItem onClick={handleClose} className="font-sans">
              <p>musaic</p>
            </MenuItem>
          )}
        </Link>
        <Link href={"/about"}>
          <MenuItem onClick={handleClose} className="font-sans">
            about
          </MenuItem>
        </Link>
        <Link href={"/privacy-policy"}>
          <MenuItem onClick={handleClose} className="font-sans">
            privacy policy
          </MenuItem>
        </Link>
        {loggedIn ? (
          <MenuItem
            onClick={() => {
              logout();
              handleClose();
            }}
            className="font-sans"
          >
            logout
          </MenuItem>
        ) : (
          <Link href={"/login"}>
            <MenuItem onClick={handleClose} className="font-sans">
              login
            </MenuItem>
          </Link>
        )}
      </Menu>
    </div>
  );
};

export default NavBar;
