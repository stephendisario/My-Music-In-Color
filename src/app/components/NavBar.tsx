"use client";
import React, { useState } from "react";
import Link from "next/link";
import { logout } from "../actions/auth";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NavBar = ({ showLogout, color = "white" }: { showLogout: boolean; color?: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="absolute z-50 top-0 right-0">
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
      >
        <Link href={"/dashboard"}>
          <MenuItem onClick={handleClose} className="font-outfit">
            musaics
          </MenuItem>
        </Link>
        <Link href={"/about"}>
          <MenuItem onClick={handleClose} className="font-outfit">
            about
          </MenuItem>
        </Link>
        <Link href={"/privacy-policy"}>
          <MenuItem onClick={handleClose} className="font-outfit">
            privacy policy
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
          className="font-outfit"
        >
          logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavBar;
