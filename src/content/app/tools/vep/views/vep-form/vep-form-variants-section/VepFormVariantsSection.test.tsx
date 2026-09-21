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

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import {
  MaxUploadSize,
  formatMegabytes,
  isWithinUploadLimit
} from './VepFormVariantsSection';

const fileOfSize = (size: number) => ({ size }) as File;

afterEach(cleanup);

describe('isWithinUploadLimit', () => {
  it('accepts a file up to the limit and rejects one past it', () => {
    expect(isWithinUploadLimit(fileOfSize(250 * 10 ** 6), 250 * 10 ** 6)).toBe(
      true
    );
    expect(
      isWithinUploadLimit(fileOfSize(250 * 10 ** 6 + 1), 250 * 10 ** 6)
    ).toBe(false);
  });

  it('leaves the check to the backend until the limit is known', () => {
    expect(isWithinUploadLimit(fileOfSize(10 ** 12))).toBe(true);
  });
});

describe('MaxUploadSize', () => {
  it('shows the limit the backend states, in megabytes', () => {
    render(<MaxUploadSize maxUploadBytes={250 * 10 ** 6} isError={false} />);

    expect(screen.getByText('Max upload size')).toBeDefined();
    expect(screen.getByText('250', { exact: false })).toBeDefined();
  });

  it('shows nothing until the limit is known', () => {
    const { container } = render(<MaxUploadSize isError={false} />);

    expect(container.textContent).toBe('');
  });

  it('keeps a fractional limit readable', () => {
    expect(formatMegabytes(1.5 * 10 ** 6)).toBe('1.5');
  });
});
