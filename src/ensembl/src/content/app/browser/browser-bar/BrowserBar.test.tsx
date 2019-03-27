import React from 'react';
import { shallow } from 'enzyme';

import { BrowserBar } from './BrowserBar';

import { TrackType } from '../track-panel/trackPanelConfig';

describe('<BrowserBar />', () => {
  const dispatchBrowserLocation: any = jest.fn();
  const selectBrowserTab: any = jest.fn();
  const toggleBrowserNav: any = jest.fn();
  const toggleDrawer: any = jest.fn();
  const toggleGenomeSelector: any = jest.fn();

  const objectInfo = {
    assembly: {
      name: 'GRCh38',
      patch: 'p12'
    },
    associated_object: {
      obj_type: 'transcript',
      selected_info: 'MANE Select',
      spliced_length: 84793,
      stable_id: 'ENST00000380152.7'
    },
    bio_type: 'Protein coding',
    obj_symbol: 'BRCA2',
    obj_type: 'gene',
    spliced_length: 84793,
    stable_id: 'ENSG00000139618',
    strand: 'forward'
  };

  const defaultProps = {
    browserActivated: true,
    browserNavOpened: false,
    chrLocation: ['13', 32275301, 32433493] as [string, number, number],
    defaultChrLocation: ['13', 32271473, 32437359] as [string, number, number],
    drawerOpened: false,
    genomeSelectorActive: false,
    ensObjectInfo: objectInfo,
    selectedBrowserTab: TrackType.GENOMIC,
    trackPanelModalOpened: false,
    trackPanelOpened: false,
    dispatchBrowserLocation,
    selectBrowserTab,
    toggleBrowserNav,
    toggleDrawer,
    toggleGenomeSelector
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<BrowserBar {...defaultProps} />);
  });

  test('has a left bar', () => {
    expect(wrapper.find('.browserInfoLeft')).toHaveLength(1);
  });

  test('has a right bar', () => {
    expect(wrapper.find('.browserInfoRight')).toHaveLength(1);
  });
});
