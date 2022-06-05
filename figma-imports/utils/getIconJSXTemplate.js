const getGenFileCaption = require("./getGenFileCaption");

/**
 * get ZIcon component template
 *
 * @param {string} name
 */
module.exports = (ZIconName, iconContent) => {
  // for ZIcons, remove the default wrapping svg tag in the first line and last line
  let defaultIconContent = iconContent.split("\n");
  const ZIconContent = defaultIconContent.slice(
    1,
    defaultIconContent.length - 2
  );

  // TODO remove console log
  console.log(
    "defaultIconContent",
    defaultIconContent,
    "ZIconContent",
    ZIconContent
  );

  return `
${getGenFileCaption()}
import React from 'react';
import { SvgIcon, useTheme, SvgIconProps } from '@mui/material';
import ZIcon from '../ZIcons';

export const ${ZIconName} = (props: SvgIconProps) => (
  <ZIcon {...props}>
    ${ZIconContent.join("\n    ")}
  </ZIcon>
);
`;
};
