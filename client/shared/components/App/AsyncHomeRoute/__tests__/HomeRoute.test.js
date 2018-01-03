/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import HomeRoute from '../HomeRoute';

describe('<HomeRoute />', () => {
  test('renders paragraph text', () => {
    const wrapper = shallow(<HomeRoute />);
    expect(wrapper.find('p').length).toBe(1);
  });
  test('renders h2 element', () => {
    const wrapper = shallow(<HomeRoute />);
    expect(wrapper.find('h2').length).toBe(1);
  });
  test('renders', () => {
    const wrapper = shallow(<HomeRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
