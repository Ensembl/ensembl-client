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
import { faker } from '@faker-js/faker';

import ExternalLink from './ExternalLink';

describe('<ExternalLink />', () => {
  it('applies the passed in className', () => {
    const className = faker.lorem.word();

    const { container } = render(
      <ExternalLink className={className} to={faker.internet.url()}>
        Hello world
      </ExternalLink>
    );

    expect(
      (container.firstChild as HTMLElement).classList.contains(className)
    ).toBe(true);
  });
});
