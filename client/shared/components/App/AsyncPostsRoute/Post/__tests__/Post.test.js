/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import { Post } from '../Post';

const data = {
  loading: false,
  singlePost: {
    id: 1,
    title: 'hi',
    body: 'boo',
    userId: '3',
  },
};

describe('<Post />', () => {
  test('renders header', () => {
    const wrapper = shallow(<Post data={data} />);
    expect(wrapper.find('h1').length).toBe(1);
  });
  test('renders the snapshot', () => {
    const wrapper = shallow(<Post data={data} />);
    expect(wrapper).toMatchSnapshot();
  });
});
