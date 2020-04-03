import React from 'react';
import { mount } from 'enzyme';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import ProteinDomainImage, {
  getDomainsByResourceGroups
} from './ProteinDomainImage';

const minimalProps = {
  transcript: createTranscript(),
  width: 600
};

const domainsByResourceGroups = getDomainsByResourceGroups(
  minimalProps.transcript.product.protein_domains_resources
);

describe('<ProteinDomainImage />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<ProteinDomainImage {...minimalProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(' renders N SVGs based on the number of protein domains', () => {
    let totalDomains = 0;

    Object.keys(domainsByResourceGroups).forEach((resourceGroupName) => {
      totalDomains += Object.keys(domainsByResourceGroups[resourceGroupName])
        .length;
    });
    expect(totalDomains).toBeTruthy();
    expect(wrapper.find('svg').length).toBe(totalDomains);
  });

  it('renders the correct number of exons within the SVGs', () => {
    const firstGroupKey = Object.keys(domainsByResourceGroups)[0];

    const firstGroupSubKey = Object.keys(
      domainsByResourceGroups[firstGroupKey]
    )[0];

    const totalExonsInFirstSvg =
      domainsByResourceGroups[firstGroupKey][firstGroupSubKey].length;
    expect(
      wrapper
        .find('svg')
        .at(0)
        .find('.exon').length
    ).toBe(totalExonsInFirstSvg);
  });
});
