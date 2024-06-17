"use client";
import React, { useState } from "react";
import Link from "next/link";
import { logout } from "../actions/auth";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NavBar = ({ showLogout }: { showLogout: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="absolute z-50 top-0 right-2">
      <IconButton onClick={(event) => handleClick(event)} className="sm:mr-3 mt-2">
        <MenuIcon sx={{ color: "black" }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link href={"/dashboard"}>Dashboard</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href={"/about"}>About</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href={"/privacy-policy"}>Privacy Policy</Link>
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavBar;
