import React from 'react';
import { mount } from 'enzyme';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import ProteinDomainImage, {
  getProteinFeaturesByType
} from './ProteinDomainImage';

const minimalProps = {
  transcript: createTranscript(),
  width: 600
};

const proteinFeaturesByType = getProteinFeaturesByType(
  minimalProps.transcript.translation.protein_features
);

describe('<ProteinDomainImage />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<ProteinDomainImage {...minimalProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(' renders N SVGs based on the number of protein features', () => {
    let totalDomains = 0;

    Object.keys(proteinFeaturesByType).forEach((featureGroupType) => {
      totalDomains += Object.keys(proteinFeaturesByType[featureGroupType])
        .length;
    });
    expect(totalDomains).toBeTruthy();
    expect(wrapper.find('svg').length).toBe(totalDomains);
  });

  it('renders the correct number of exons within the SVGs', () => {
    const firstGroupKey = Object.keys(proteinFeaturesByType)[0];

    const firstGroupSubKey = Object.keys(
      proteinFeaturesByType[firstGroupKey]
    )[0];

    const totalExonsInFirstSvg =
      proteinFeaturesByType[firstGroupKey][firstGroupSubKey].length;
    expect(
      wrapper
        .find('svg')
        .at(0)
        .find('.exon').length
    ).toBe(totalExonsInFirstSvg);
  });
});
