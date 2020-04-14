import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import ExternalLink, { ExternalLinkProps } from './ExternalLink';

const defaultProps: ExternalLinkProps = {
  linkText: faker.random.words(),
  to: faker.internet.url(),
  classNames: {
    label: faker.random.words(),
    icon: faker.random.words(),
    link: faker.random.words()
  }
};

describe('<ExternalLink />', () => {
  const renderExternalLink = (props: Partial<ExternalLinkProps> = {}) =>
    mount(<ExternalLink {...defaultProps} {...props} />);

  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = renderExternalLink();
  });

  it('renders without error', () => {
    expect(() => wrapper).not.toThrow();
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper.find('.defaultIcon').hasClass(defaultProps.classNames?.icon)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultLink').hasClass(defaultProps.classNames?.link)
    ).toBeTruthy();
  });
});
