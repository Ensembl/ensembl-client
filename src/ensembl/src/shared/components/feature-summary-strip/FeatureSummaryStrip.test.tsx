import React from 'react';
import { mount } from 'enzyme';

import {
  FeatureSummaryStrip,
  FeatureSummaryStripProps
} from './FeatureSummaryStrip';

import { GeneSummaryStrip, RegionSummaryStrip } from '../feature-summary-strip';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('../feature-summary-strip', () => ({
  GeneSummaryStrip: () => <div>Gene Summary Strip</div>,
  RegionSummaryStrip: () => <div>Region Summary Strip</div>
}));

describe('<FeatureSummaryStrip />', () => {
  const defaultProps = {
    ensObject: createEnsObject(),
    isGhosted: false
  };

  const renderFeatureSummaryStrip = (
    props?: Partial<FeatureSummaryStripProps>
  ) => <FeatureSummaryStrip {...defaultProps} {...props} />;

  describe('general', () => {
    test('contains GeneSummaryStrip if focus object is gene', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('gene') })
      );
      expect(renderedFeatureSummaryStrip.find(GeneSummaryStrip).length).toBe(1);
    });

    test('contains RegionSummaryStrip if focus object is region', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('region') })
      );
      expect(renderedFeatureSummaryStrip.find(RegionSummaryStrip).length).toBe(
        1
      );
    });

    test('does not contain anything if focus object is not defined', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('xyz') })
      );
      expect(renderedFeatureSummaryStrip.html()).toBe(null);
    });
  });
});
