import React, { Fragment, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Accordion, Col, Form, Row, Button, Nav } from "react-bootstrap";
import Checkbox from "../../_lowLevel/Checkbox.js";

export const EmbedContainer = React.forwardRef((props, ref, boardTitle, filter, expression, onChange) => (

  <Fragment>


  <Checkbox
    fieldNameSuggestions={props.fieldNameSuggestions}
    setSelectedCheckboxes={props.setSelectedCheckboxes}
    selectedCheckboxes={props.selectedCheckboxes}
    // filter={props.filter}
    // expression={props.expression}
    // onChange={props.onChange}

  />
  <Col sm={12} md={12} lg={12} className="position-relative embed-responsive embed-responsive-16by9">
    <div className="abso"></div>
    <Box
      ref={ref}
    />
</Col>

  </Fragment>
));
