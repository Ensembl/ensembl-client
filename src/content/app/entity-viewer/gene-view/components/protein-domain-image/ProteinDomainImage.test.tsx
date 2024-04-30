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

import { render } from '@testing-library/react';

import { createProduct } from 'tests/fixtures/entity-viewer/product';

import ProteinDomainImage, {
  getDomainsByResourceGroups
} from './ProteinDomainImage';

const product = createProduct();

const minimalProps = {
  proteinDomains: product.family_matches,
  width: 600
};

const domainsByResourceGroups = getDomainsByResourceGroups(
  minimalProps.proteinDomains
);

describe('<ProteinDomainImage />', () => {
  const renderComponent = () =>
    render(
      <ProteinDomainImage {...minimalProps} trackLength={product.length} />
    );

  it('renders the correct number of tracks', () => {
    const { container } = renderComponent();
    const totalDomainGroupsCount = Object.values(
      domainsByResourceGroups
    ).flatMap((group) => Object.keys(group)).length;

    expect(container.querySelectorAll('svg').length).toBe(
      totalDomainGroupsCount
    );
  });

  it('renders the correct number of domains in an svg', () => {
    const { container } = renderComponent();
    const firstDomainsGroup = Object.values(domainsByResourceGroups).flatMap(
      (resource) => Object.values(resource)
    )[0];

    expect(
      container.querySelector('svg')?.querySelectorAll('.domain').length
    ).toBe(firstDomainsGroup.locations.length);
  });
});
