import React from 'react';
import './App.css';
import PickupLocation from './PickupLocation/PickupLocation';


export default () => (
  <div className="App">
    <div className="form">
      <h2>Where are you going?</h2>
      <PickupLocation onChange={console.log} />
      <input type="button" value="Search" id="search" />
    </div>
  </div>
);
