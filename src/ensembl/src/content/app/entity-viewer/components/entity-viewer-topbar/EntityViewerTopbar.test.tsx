import React from 'react';
import { mount } from 'enzyme';
import {
  EntityViewerTopbar,
  EntityViewerTopbarProps
} from './EntityViewerTopbar';

import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock(
  'src/shared/components/feature-summary-strip/FeatureSummaryStrip',
  () => () => <div>Feature Summary Strip</div>
);

describe('<BrowserBar />', () => {
  const defaultProps = {
    ensObject: createEnsObject()
  };

  const renderEntityViewerTopbar = (
    props?: Partial<EntityViewerTopbarProps>
  ) => <EntityViewerTopbar {...defaultProps} {...props} />;

  describe('general', () => {
    let renderedEntityViewerTopbar: any;

    beforeEach(() => {
      renderedEntityViewerTopbar = mount(renderEntityViewerTopbar());
    });

    test('contains FeatureSummaryStrip', () => {
      expect(renderedEntityViewerTopbar.find(FeatureSummaryStrip).length).toBe(
        1
      );
    });
  });

  describe('behaviour', () => {
    let renderedEntityViewerTopbar: any;

    test('shows FeatureSummaryStrip when ensObject is not null', () => {
      renderedEntityViewerTopbar = mount(renderEntityViewerTopbar());
      expect(renderedEntityViewerTopbar.find(FeatureSummaryStrip).length).toBe(
        1
      );

      renderedEntityViewerTopbar = mount(
        renderEntityViewerTopbar({ ensObject: null })
      );
      expect(renderedEntityViewerTopbar.find(FeatureSummaryStrip).length).toBe(
        0
      );
    });
  });
});
