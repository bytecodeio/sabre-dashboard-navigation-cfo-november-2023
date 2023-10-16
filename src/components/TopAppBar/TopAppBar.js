import React, { Fragment, useState, useContext, useEffect } from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Button, Container, Nav, Navbar, Header } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import defaultLogo from "../../assets/BytecodeLogo.png";
import { defaultLogoHeight } from "../../utils/constants";
import { CompanyLogo } from "../_lowLevel/CompanyLogo";

export const TopAppBar = ({ appConfig, onMenuClick, toolbarHeight }) => {
  return (
<Fragment>
    <Container fluid className="padding-0">
        <div className="inner_page_block white_option"></div>

        <Navbar collapseOnSelect expand="lg">
          <Container fluid>
            <a href="" target="_blank" className="mneg5"></a>

            <CompanyLogo
            height="101%"
            style={{ zIndex: 1, position: "relative", right: "14px" }}
            />

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav className="align-items-center">
                <Navbar.Text>

                </Navbar.Text>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>



    </Fragment>
  );
};
