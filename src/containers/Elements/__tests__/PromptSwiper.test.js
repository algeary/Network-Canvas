/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { PromptSwiper } from '../../Elements/PromptSwiper';

const mockProps = {
  forward: () => {},
  backward: () => {},
  prompts: [
    { text: 'bar' },
    { text: 'foo' },
  ],
  promptIndex: 0,
};

describe('<PromptSwiper />', () => {
  it('renders ok', () => {
    const component = shallow(<PromptSwiper {...mockProps} />);

    expect(component.find('.prompts__pips').exists()).toBe(true);
    expect(component).toMatchSnapshot();
  });
});

describe("when only one prompt, don't show pips", () => {
  it('renders ok', () => {
    const component = shallow(<PromptSwiper { ...mockProps } prompts={[{ text: 'baz' }]} />);

    expect(component.find('.prompts__pips').exists()).toBe(false);
  });
});