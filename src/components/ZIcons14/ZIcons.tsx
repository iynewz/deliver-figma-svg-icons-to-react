import React from "react";

import "./Icon.css";

const ZIcon = (props) => {
  return <span>{props.children}</span>;
};

export default ZIcon;

// TODO:
//import { SvgIcon, useTheme, SvgIconProps } from "@mui/material";

// const ZIcon = (props: SvgIconProps) => {
//   const { sx, ...otherProps } = props;
//   return (
//     <SvgIcon
//       sx={{
//         fill: "none",
//         ...sx,
//       }}
//       {...otherProps}
//     >
//       {props.children}
//     </SvgIcon>
//   );
// };
