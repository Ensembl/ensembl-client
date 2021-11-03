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
import { render } from '@testing-library/react';

import { Breadcrumbs } from './Breadcrumbs';

const defaultProps = {
  breadcrumbs: ['foo', 'bar']
};

describe('Breadcrumbs', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the breadcrumbs', () => {
    const { container } = render(<Breadcrumbs {...defaultProps} />);
    expect(container.querySelector('.breadcrumbs')).toBeTruthy();
  });

  it('renders the correct number breadcrumbs', () => {
    const { container } = render(<Breadcrumbs {...defaultProps} />);
    expect(container.querySelectorAll('.breadcrumb')).toHaveLength(
      defaultProps.breadcrumbs.length
    );
  });

  it('renders the correct breadcrumb value', () => {
    const { container } = render(<Breadcrumbs {...defaultProps} />);

    const renderedBreadcrumbs = [
      ...container.querySelectorAll('.breadcrumb')
    ].map((element) => element.textContent);

    expect(renderedBreadcrumbs).toEqual(defaultProps.breadcrumbs);
  });
});