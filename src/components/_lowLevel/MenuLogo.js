import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { BytecodeLogo } from "./LogoImage";
import { IconButton, Box } from "@mui/material";

export const MenuLogo = ({ onClick }) => {
  return (
    <Box display="flex" alignItems="center" margin={1.7}>
      <IconButton onClick={onClick} sx={{ marginRight: 1 }}>
        <MenuIcon />
      </IconButton>
      <BytecodeLogo />
    </Box>
  );
};
