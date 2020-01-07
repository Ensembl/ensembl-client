import React from 'react';
import { mount } from 'enzyme';
import { BrowserBar, BrowserInfo, BrowserBarProps } from './BrowserBar';

import BrowserReset from 'src/content/app/browser/browser-reset/BrowserReset';
import BrowserLocationIndicator from 'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator';
import {
  GeneSummaryStrip,
  RegionSummaryStrip
} from 'src/shared/components/feature-summary-strip';

import { ChrLocation } from '../browserState';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('src/content/app/browser/browser-reset/BrowserReset', () => () => (
  <div>BrowserReset</div>
));
jest.mock(
  'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator',
  () => () => <div>Browser Location Indicator</div>
);
jest.mock('src/shared/components/feature-summary-strip', () => ({
  GeneSummaryStrip: () => <div>Gene Summary Strip</div>,
  RegionSummaryStrip: () => <div>Region Summary Strip</div>
}));

describe('<BrowserBar />', () => {
  const defaultProps = {
    chrLocation: ['13', 32275301, 32433493] as ChrLocation,
    defaultChrLocation: ['13', 32271473, 32437359] as ChrLocation,
    ensObject: createEnsObject(),
    isDrawerOpened: false
  };

  const renderBrowserBar = (props?: Partial<BrowserBarProps>) => (
    <BrowserBar {...defaultProps} {...props} />
  );

  describe('general', () => {
    let renderedBrowserBar: any;

    beforeEach(() => {
      renderedBrowserBar = mount(renderBrowserBar());
    });

    test('contains BrowserReset button', () => {
      expect(renderedBrowserBar.find(BrowserReset)).toHaveLength(1);
    });

    test('contains BrowserLocationIndicator', () => {
      expect(renderedBrowserBar.find(BrowserLocationIndicator)).toHaveLength(1);
    });

    test('renders GeneSummaryStrip if focus object is gene', () => {
      const renderedBrowserBar = mount(
        renderBrowserBar({ ensObject: createEnsObject('gene') })
      );
      expect(renderedBrowserBar.find(GeneSummaryStrip)).toHaveLength(1);
    });

    test('renders RegionSummaryStrip if focus object is region', () => {
      const renderedBrowserBar = mount(
        renderBrowserBar({ ensObject: createEnsObject('region') })
      );
      expect(renderedBrowserBar.find(RegionSummaryStrip)).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('shows BrowserInfo panel by default', () => {
      const renderedBrowserBar = mount(renderBrowserBar());
      expect(renderedBrowserBar.find(BrowserInfo).length).toBe(1);
    });
  });
});
