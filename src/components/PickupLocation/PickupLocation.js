import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './PickupLocation.css';
import DocItem from '../DocItem/DocItem';
import useIsFocused from '../../hooks/useIsFocused';
import useDebouncedEffect from '../../hooks/useDebouncedEffect';

const endpoint = 'https://cors.io/?https://www.rentalcars.com/FTSAutocomplete.do';
// call the endpoint and get the autocomplete value
const getFTS = ({
  solrIndex = 'fts_en',
  solrRows = 6,
  solrTerm = '',
}) => fetch(`${endpoint}?${Object.entries({
  solrIndex,
  solrRows,
  solrTerm,
}).map(e => e.join('=')).join('&')}`)
  .then(async response => (await response.json()).results);
// a function how return the title of the doc
const displayTitle = ({
  name,
  iata,
  placeType,
}) => {
  switch (placeType) {
    case 'A':
      return `${name} (${iata})`;
    default:
      return name;
  }
};
// a function how return the subtitle of the doc
const displaySubTitle = ({
  country,
  region,
}) => `${country}, ${region}`;

// A placeholder component to show a loading animation
const Loader = ({ loading = false, className }) => loading && (
  <img
    alt="loading"
    className={className}
    src="https://cdn2.rcstatic.com/images/site_graphics/newsite/preloader64.gif"
  />
);

// a PickupLocation Autosuggestion component
// if at least nOfChar characters is typed into the input
// call the endpoint to take the suggestions
const PickupLocation = ({
  name = 'pick-up-location',
  placeholder = 'city, airport, station,region and district...',
  label = 'Pick-up Location',
  nOfChar = 2,
  onChange,
}) => {
  const [showList, onFocus, onBlur] = useIsFocused();
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useDebouncedEffect(() => {
    // if `value` changed and `value.length >= 2` call the api to get the search match.
    // But there is a problem here.
    // If you type fast, requests can collide and you save in the state the last response,
    // but no one can assure that the last response is of the last request.
    // To avoid this we debounce the callback and implement a sort of cancellable Promise,
    // or fetch, using the `cancelled` variable.
    // Only debounce the request will not work.
    // If one request take more than the debounce time we will still get the wrong result.
    let cancelled = false;
    if (value.length >= nOfChar) {
      setLoading(true);
      getFTS({
        solrTerm: value,
      })
        .then((res) => {
          if (!cancelled) {
            setResults(res);
            setError(false);
          }
        })
        .catch((e) => {
          if (!cancelled) {
            setResults(null);
            setError(e);
          }
        })
        .finally(() => !cancelled && setLoading(false));
    } else {
      setResults(null);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, 250, [value]);
  const canShowData = !error && results;
  return (
    <div
      className={classNames('autosuggestion', 'pickup-location', {
        active: showList,
      })}
      onFocus={() => {
        onFocus();
        setSelected(null);
        if (onChange) onChange();
      }}
      onBlur={onBlur}
    >
      <label htmlFor={name}>
        {label}
        <Loader
          loading={loading}
          className="loading"
        />
        <input
          type="text"
          autoComplete="off"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={e => setValue(e.target.value)}
          value={selected ? `${displayTitle(selected)}, ${displaySubTitle(selected)}` : value}
        />
        {showList && (
          <ul className="list">
            {error && <p>Something goes wrong</p>}
            {canShowData
            && !!results.numFound
            && results.docs.map(doc => (
              <DocItem
                key={doc.bookingId}
                id={doc.bookingId}
                title={displayTitle(doc)}
                subTitle={displaySubTitle(doc)}
                type={doc.placeType}
                searchValue={value}
                onSelect={(bookingId) => {
                  const selectedDoc = results
                    .docs.find(d => d.bookingId === bookingId);
                  setSelected(selectedDoc);
                  if (onChange) onChange(selectedDoc);
                  // call onBlur to close the list manually
                  onBlur();
                }}
              />
            ))}
            {results && !results.numFound && <i className="no-result">No results found</i>}
          </ul>
        )
        }
      </label>
    </div>
  );
};

PickupLocation.propTypes = {
  // the name & id of the input
  name: PropTypes.string,
  // the placeholder to show inside the input
  placeholder: PropTypes.string,
  // the label of the input
  label: PropTypes.string,
  // the number of char needed to enable suggestions
  nOfChar: PropTypes.number,
  // the onChange callback
  onChange: PropTypes.func,
};

export default PickupLocation;
