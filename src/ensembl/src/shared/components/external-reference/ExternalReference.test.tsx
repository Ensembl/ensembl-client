import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import ExternalReference, { ExternalReferenceProps } from './ExternalReference';

const defaultProps: ExternalReferenceProps = {
  label: faker.random.words(),
  linkText: faker.random.words(),
  to: faker.internet.url(),
  classNames: {
    container: faker.random.words(),
    label: faker.random.words(),
    icon: faker.random.words(),
    link: faker.random.words()
  }
};

describe('<ExternalReference />', () => {
  const renderExternalReference = (
    props: Partial<ExternalReferenceProps> = {}
  ) => mount(<ExternalReference {...defaultProps} {...props} />);

  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = renderExternalReference();
  });

  it('renders without error', () => {
    expect(() => wrapper).not.toThrow();
  });

  it('hides label container div when there is no label', () => {
    wrapper = renderExternalReference({ label: undefined });
    expect(wrapper.find('.defaultLabel')).toHaveLength(0);
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper
        .find('.defaultContainer')
        .hasClass(defaultProps.classNames?.container)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultLabel').hasClass(defaultProps.classNames?.label)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultIcon').hasClass(defaultProps.classNames?.icon)
    ).toBeTruthy();
    expect(
      wrapper.find('.defaultLink').hasClass(defaultProps.classNames?.link)
    ).toBeTruthy();
  });
});
