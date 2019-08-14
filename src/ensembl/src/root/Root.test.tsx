import React from 'react';
import { mount } from 'enzyme';

import { Root } from './Root';
import Header from '../header/Header';
import Content from '../content/Content';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';

jest.mock('../header/Header', () => () => 'Header');
jest.mock('../content/Content', () => () => 'Content');
jest.mock('../shared/privacy-banner/PrivacyBanner', () => () => (
  <div className="privacyBanner">PrivacyBanner</div>
));

const updateBreakpointWidth = jest.fn();

describe('<Root />', () => {
  let wrapper: any;

  const defaultProps = {
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

  test('shows privacy banner if privacy policy version is not set or if version does not match', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => true);
    const wrapper = mount(getRenderedRoot(defaultProps));
    expect(wrapper.find('.privacyBanner').length).toBe(1);
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });

  test('does not show privacy banner if policy version is set', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => false);
    const wrapper = mount(getRenderedRoot(defaultProps));
    expect(wrapper.find('.privacyBanner').length).toBe(0);
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });
});
