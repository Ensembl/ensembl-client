import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import ExternalLink, { ExternalLinkProps } from './ExternalLink';

const defaultProps: ExternalLinkProps = {
  label: faker.random.words(),
  linkText: faker.random.words(),
  linkUrl: faker.internet.url(),
  classNames: {
    containerClass: faker.random.words(),
    labelClass: faker.random.words(),
    iconClass: faker.random.words(),
    linkClass: faker.random.words()
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

  it('hides label container div when there is no label', () => {
    wrapper = renderExternalLink({ label: undefined });
    expect(wrapper.find('.defaultLabel')).toHaveLength(0);
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper
        .find('.defaultContainer')
        .hasClass(defaultProps.classNames?.containerClass)
    ).toBeTruthy();
    expect(
      wrapper
        .find('.defaultLabel')
        .hasClass(defaultProps.classNames?.labelClass)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultIcon').hasClass(defaultProps.classNames?.iconClass)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultLink').hasClass(defaultProps.classNames?.linkClass)
    ).toBeTruthy();
  });
});
