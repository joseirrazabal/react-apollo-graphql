/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import AboutRoute from '../AboutRoute';

describe('<AboutRoute />', () => {
  test('renders both paragraph text', () => {
    const wrapper = shallow(<AboutRoute />);
    expect(wrapper.find('p').length).toBe(2);
  });
  test('renders', () => {
    const wrapper = shallow(<AboutRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
