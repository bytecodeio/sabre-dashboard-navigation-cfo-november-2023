import React, { Fragment, useState, useEffect } from "react";
import { Box } from "@mui/material";

import Checkbox from "../../_lowLevel/Checkbox.js";

export const EmbedContainer = React.forwardRef((props, ref) => (

  <Fragment>

  <Checkbox
    fieldNameSuggestions={props.fieldNameSuggestions}
    setSelectedCheckboxes={props.setSelectedCheckboxes}
    selectedCheckboxes={props.selectedCheckboxes}
  />

    <Box
      sx={{
        height: "100%",
        width: "100%",
        "> iframe": {
          height: "100%",
          width: "100%",
        },
      }}
      ref={ref}
    />
  </Fragment>
));
