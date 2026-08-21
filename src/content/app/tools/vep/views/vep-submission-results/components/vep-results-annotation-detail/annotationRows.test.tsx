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

import { render, screen, cleanup } from '@testing-library/react';

import {
  renderRows,
  renderRowGroup,
  renderRowBlock,
  type RowSpec
} from './annotationRows';

const renderSpecs = (rows: RowSpec[]) => render(<>{renderRows(rows)}</>);

afterEach(cleanup);

describe('renderRows', () => {
  it('renders a labelled row per spec', () => {
    renderSpecs([
      { label: 'HGVSc', value: 'c.123A>G' },
      { label: 'HGVSp', value: 'p.Lys41Arg' }
    ]);

    expect(screen.getByText('HGVSc')).toBeDefined();
    expect(screen.getByText('c.123A>G')).toBeDefined();
    expect(screen.getByText('p.Lys41Arg')).toBeDefined();
  });

  describe('absent values', () => {
    it('drops a row whose value is null or undefined and has no placeholder', () => {
      const nodes = renderRows([
        { label: 'A', value: null },
        { label: 'B', value: undefined },
        { label: 'C', value: 'kept' }
      ]);

      expect(nodes).toHaveLength(1);
    });

    it('drops a row whose value is an empty string', () => {
      expect(renderRows([{ label: 'A', value: '' }])).toHaveLength(0);
    });

    it('keeps a row whose value is absent when a placeholder is set', () => {
      renderSpecs([{ label: 'ΔP donor loss', value: null, placeholder: '—' }]);

      expect(screen.getByText('ΔP donor loss')).toBeDefined();
      expect(screen.getByText('—')).toBeDefined();
    });

    it('treats zero and false as real values, not absences', () => {
      renderSpecs([
        { label: 'zero', value: 0, format: 'num' },
        { label: 'flag', value: false }
      ]);

      expect(screen.getByText('0')).toBeDefined();
      expect(screen.getByText('false')).toBeDefined();
    });

    it('treats an empty list as absent under the join format', () => {
      expect(
        renderRows([{ label: 'Consequences', value: [], format: 'join' }])
      ).toHaveLength(0);
    });

    it('placeholders an empty list when a placeholder is set', () => {
      renderSpecs([
        {
          label: 'Consequences',
          value: [],
          format: 'join',
          placeholder: '—'
        }
      ]);

      expect(screen.getByText('—')).toBeDefined();
    });
  });

  describe('formats', () => {
    it('applies num, humanize, phenotype and join', () => {
      renderSpecs([
        { label: 'n', value: 0.123456, format: 'num' },
        { label: 'h', value: 'likely_benign', format: 'humanize' },
        { label: 'p', value: 'BREAST_CANCER', format: 'phenotype' },
        { label: 'j', value: ['x', 'y'], format: 'join' }
      ]);

      expect(screen.getByText('0.1235')).toBeDefined();
      expect(screen.getByText('likely benign')).toBeDefined();
      expect(screen.getByText('Breast cancer')).toBeDefined();
      expect(screen.getByText('x, y')).toBeDefined();
    });

    it('stringifies the value by default', () => {
      renderSpecs([{ label: 'n', value: 42 }]);

      expect(screen.getByText('42')).toBeDefined();
    });
  });

  it('accepts a ReactNode label', () => {
    renderSpecs([
      { label: <span>Gap frequency</span>, value: 0.6, format: 'num' }
    ]);

    expect(screen.getByText('Gap frequency')).toBeDefined();
    expect(screen.getByText('0.6')).toBeDefined();
  });

  // A plain result is bolded so the answer, not the label naming it, is what
  // the eye lands on. Which values qualify is decided here rather than at each
  // call site, so these are the tests of that rule.
  describe('bolding the result', () => {
    it('bolds a plain formatted value', () => {
      renderSpecs([
        { label: 'CADD (PHRED)', value: 7.2915, format: 'num' },
        { label: 'Consequences', value: ['x', 'y'], format: 'join' }
      ]);

      expect(screen.getByText('7.292').className).toMatch(/strongValue/);
      expect(screen.getByText('x, y').className).toMatch(/strongValue/);
    });

    it('leaves the placeholder dash unbolded — it is an absence, not a result', () => {
      renderSpecs([{ label: 'ΔP donor loss', value: null, placeholder: '—' }]);

      expect(screen.getByText('—').className).not.toMatch(/strongValue/);
    });

    it('leaves a pre-rendered value unbolded — a link brings its own colour', () => {
      renderSpecs([
        {
          label: 'Variation ID',
          value: '12345',
          valueNode: <a href="https://example.org/12345">12345</a>
        }
      ]);

      expect(screen.getByText('12345').closest('span')?.className).not.toMatch(
        /strongValue/
      );
    });
  });
});

describe('renderRowGroup', () => {
  it('returns null when no row survives', () => {
    expect(renderRowGroup([{ label: 'A', value: null }])).toBeNull();
  });

  it('returns the surviving rows otherwise', () => {
    render(<>{renderRowGroup([{ label: 'A', value: 'kept' }])}</>);

    expect(screen.getByText('kept')).toBeDefined();
  });
});

describe('renderRowBlock', () => {
  it('omits the whole block, heading included, when no row survives', () => {
    expect(
      renderRowBlock('Dosage sensitivity', [
        { label: 'pHaplo', value: null },
        { label: 'pTriplo', value: null }
      ])
    ).toBeNull();
  });

  it('renders the heading above the surviving rows', () => {
    render(
      <>
        {renderRowBlock('Dosage sensitivity', [
          { label: 'pHaplo', value: 0.98, format: 'num' },
          { label: 'pTriplo', value: null }
        ])}
      </>
    );

    expect(screen.getByText('Dosage sensitivity')).toBeDefined();
    expect(screen.getByText('pHaplo')).toBeDefined();
    expect(screen.getByText('0.98')).toBeDefined();
    expect(screen.queryByText('pTriplo')).toBeNull();
  });
});
