import React from 'react';
import ReactDOM from 'react-dom';
import {
  render, fireEvent, wait, getByAltText,
} from 'react-testing-library';
import { act } from 'react-dom/test-utils';
import PickupLocation from './PickupLocation';

const waitTime = timeout => new Promise(
  resolve => setTimeout(resolve, timeout),
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PickupLocation onChange={console.log} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('should not show the loader with one character', () => {
  const { container } = render(<PickupLocation onChange={console.log} />);
  const input = container.getElementsByTagName('input')[0];
  expect(container.getElementsByTagName('img').length).toBe(0);
  fireEvent.change(input, { target: { value: 'r' } });
  expect(input.value).toBe('r');
  expect(container.getElementsByTagName('img').length).toBe(0);
});
it('should show the loader with at least 2 character', async () => {
  const { container } = render(<PickupLocation onChange={console.log} />);
  const input = container.getElementsByTagName('input')[0];
  expect(container.getElementsByTagName('img').length).toBe(0);
  fireEvent.change(input, { target: { value: 'ro' } });
  await wait(() => getByAltText(container, /loading/), { timeout: 500 });
  expect(input.value).toBe('ro');
  expect(container.getElementsByTagName('img').length).toBe(1);
});
it('on input focus should show the list', async () => {
  const { container } = render(<PickupLocation onChange={console.log} />);
  const input = container.getElementsByTagName('input')[0];
  expect(container.getElementsByTagName('ul').length).toBe(0);
  fireEvent.focus(input);
  await waitTime(500);
  expect(container.getElementsByTagName('ul').length).toBe(1);
});
it('should load 6 results for rome', async () => {
  const { container } = render(<PickupLocation onChange={console.log} />);
  const input = container.getElementsByTagName('input')[0];
  expect(container.getElementsByTagName('li').length).toBe(0);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'rome' } });
  // this can fail if endpoint not respond in time
  await waitTime(2500);
  expect(container.getElementsByTagName('li').length).toBe(6);
});
it('should select value and close the list when click on a list item', async () => {
  const { container } = render(<PickupLocation onChange={console.log} />);
  const input = container.getElementsByTagName('input')[0];
  expect(container.getElementsByTagName('li').length).toBe(0);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'rome' } });
  // this can fail if endpoint not respond in time
  await waitTime(2500);
  expect(container.getElementsByTagName('li').length).toBe(6);
  expect(container.getElementsByTagName('ul').length).toBe(1);
  fireEvent.click(container.getElementsByTagName('li')[0].firstChild);
  await waitTime(1000);
  expect(container.getElementsByTagName('ul').length).toBe(0);
  expect(input.value).not.toBe('rome');
});
