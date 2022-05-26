const getGenFileCaption = require("./getGenFileCaption");

/**
 * get icon component template
 *
 * @param {string} name
 */
module.exports = (name) => `
${getGenFileCaption()}
import React from 'react';

import {ReactComponent as ${name.substring(
  2
)}Component} from './${name.substring(2)}.svg';

import Icon from '../Icon';

export const ${name.substring(2)} = (props) => (
  <Icon {...props}>
    <${name.substring(2)}Component/>
  </Icon>
);

${name.substring(2)}.propTypes = Icon.propTypes;
`;
