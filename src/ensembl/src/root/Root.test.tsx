import React from 'react';
import { mount } from 'enzyme';

import { Root } from './Root';
import Header from '../header/Header';
import Content from '../content/Content';
import config from 'config';

jest.mock('../header/Header', () => () => 'Header');
jest.mock('../content/Content', () => () => 'Content');
jest.mock('../shared/privacy-banner/PrivacyBanner', () => () => (
  <div className="privacyBanner">PrivacyBanner</div>
));

const cookiesMock: any = {
  get: jest.fn()
};
const updateBreakpointWidth = jest.fn();

describe('<Root />', () => {
  let wrapper: any;

  const defaultProps = {
    cookies: cookiesMock,
    breakpointWidth: 0,
    updateBreakpointWidth: updateBreakpointWidth
  };
  const getRenderedRoot = (props: any) => <Root {...props} />;

  beforeEach(() => {
    wrapper = mount(getRenderedRoot(defaultProps));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('contains Header', () => {
    expect(wrapper.contains(<Header />)).toBe(true);
  });

  test('contains Content', () => {
    expect(wrapper.contains(<Content />)).toBe(true);
  });

  test('calls updateBreakpointWidth on mount', () => {
    expect(updateBreakpointWidth).toHaveBeenCalled();
  });

  test('shows privacy banner if privacy cookie is not set', () => {
    cookiesMock.get = jest.fn(() => '');
    const wrapper = mount(getRenderedRoot(defaultProps));
    expect(wrapper.find('.privacyBanner').length).toBe(1);
  });

  test('does not show privacy banner if privacy cookie is set', async () => {
    cookiesMock.get = jest.fn(() => config.privacy_policy_version);
    const wrapper = mount(getRenderedRoot(defaultProps));

    // ugly hack: fall back to the end of event queue, giving priority to useEffect and useState
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('.privacyBanner').length).toBe(0);
  });
});
