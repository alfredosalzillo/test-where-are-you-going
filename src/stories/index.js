import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PickupLocation from '../components/PickupLocation/PickupLocation';
import App from '../components/App';


storiesOf('PickupLocation', module)
  .add('simple', () => (
    <PickupLocation
      onChange={action('selected value change')}
    />
  ))
  .add('in a search widget', () => (
    <App />
  ));
