import React from 'react';
import Highlighter from 'react-highlight-words';
import PropTypes from 'prop-types';
import Chip from '../Chip/Chip';
import './DocItem.css';

// a list of types of chips, text and color to show
const types = {
  A: {
    text: 'Airport',
    color: '#f2817f',
  },
  C: {
    text: 'City',
    color: '#6eb8fa',
  },
  T: {
    text: 'Station',
    color: '#afbbce',
  },
};

// A row of the suggestion of PickupLocation
// include a chip of the type of the doc
// a main title and a subtitle
const DocItem = ({
  id,
  type,
  title,
  subTitle,
  onSelect,
  searchValue,
}) => (
  <li className="doc-item">
    <button type="button" className="doc-item-row" onClick={() => onSelect(id)}>
      <Chip {...types[type]} />
      <div className="description">
        <Highlighter
          highlightClassName="highlight"
          searchWords={[searchValue]}
          autoEscape
          textToHighlight={title}
        />
        <span className="subtitle">{subTitle}</span>
      </div>
    </button>
  </li>
);

DocItem.propTypes = {
  // the id of the doc
  id: PropTypes.string.isRequired,
  // a letter representing the type of the doc
  type: PropTypes.oneOf(['A', 'C', 'T']).isRequired,
  // the title of the row
  title: PropTypes.string.isRequired,
  // the subtitle of the row
  subTitle: PropTypes.string.isRequired,
  // the callback called onClick on the row
  onSelect: PropTypes.func.isRequired,
  // the searched value to highlight
  searchValue: PropTypes.string.isRequired,
};

export default DocItem;
