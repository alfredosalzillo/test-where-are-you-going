import React from 'react';
import PropTypes from 'prop-types';
import './Chip.css';

// A component how draw a chip with the text and color specified
const Chip = ({
  text,
  color,
}) => (
  <span
    className="chip"
    style={{
      backgroundColor: color,
    }}
  >
    {text}
  </span>
);

Chip.propTypes = {
  // the text of the chip
  text: PropTypes.string.isRequired,
  // the color of the chip
  color: PropTypes.string.isRequired,
};

export default Chip;
