/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';

import { createProduct } from 'tests/fixtures/entity-viewer/product';

import ProteinDomainImage, {
  getDomainsByResourceGroups
} from './ProteinDomainImage';

const product = createProduct();

const minimalProps = {
  proteinDomains: product.protein_domains_resources,
  width: 600
};

const domainsByResourceGroups = getDomainsByResourceGroups(
  minimalProps.proteinDomains
);

describe('<ProteinDomainImage />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(
      <ProteinDomainImage {...minimalProps} trackLength={product.length} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the correct number of tracks', () => {
    let totalDomains = 0;

    Object.keys(domainsByResourceGroups).forEach((resourceGroupName) => {
      totalDomains += Object.keys(domainsByResourceGroups[resourceGroupName])
        .length;
    });
    expect(totalDomains).toBeTruthy();
    expect(wrapper.find('svg').length).toBe(totalDomains);
  });

  it('renders the correct number of domains within the SVGs', () => {
    const firstGroupKey = Object.keys(domainsByResourceGroups)[0];

    const firstGroupSubKey = Object.keys(
      domainsByResourceGroups[firstGroupKey]
    )[0];

    const totalDomainsInFirstSvg =
      domainsByResourceGroups[firstGroupKey][firstGroupSubKey].length;
    expect(wrapper.find('svg').at(0).find('.domain').length).toBe(
      totalDomainsInFirstSvg
    );
  });
});
