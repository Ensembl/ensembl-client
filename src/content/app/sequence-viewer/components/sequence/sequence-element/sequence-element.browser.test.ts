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

import { page, userEvent } from 'vitest/browser';

import { getSequenceSelection } from './sequence-hit-testing';

import {
  Sequence as SequenceElement,
  type VisibleRangeEventDetail
} from './sequence-element';

// register the element as a side effect of import
import './sequence-element';

const styles =
  '<template id="styles"><style>.feature { color: rgb(12, 34, 56); }</style></template>';
const legend =
  '<template id="legend"><span class="feature">Exon</span></template>';
const response = (content: string, withLegend = true) =>
  styles +
  '<template id="sequence">' +
  content +
  '</template>' +
  (withLegend ? legend : '');

describe('ens-sequence-viewer-sequence element', () => {
  let element: SequenceElement;

  beforeEach(() => {
    element = document.createElement(
      'ens-sequence-viewer-sequence'
    ) as SequenceElement;
    document.body.append(element);
  });

  afterEach(() => {
    element.remove();
    window.getSelection()?.removeAllRanges();
    vi.restoreAllMocks();
  });

  it('handles the template property correctly', async () => {
    // Set the sequence property on the element
    element.sequence = response(
      Array.from(
        { length: 101 },
        () => '<div class="line"><span class="feature">ACGT</span></div>'
      ).join(' ')
    );

    // Check that the lines from the template get wrapped in content-visibility blocks
    // 100 lines per block
    expect(element.shadowRoot!.querySelectorAll('.line')).toHaveLength(101);
    expect(
      element.shadowRoot!.querySelectorAll('.content-visibility-block')
    ).toHaveLength(2);

    // Check that the styles passed in the template get applied to the element
    expect(
      getComputedStyle(element.shadowRoot!.querySelector('.feature')!).color
    ).toBe('rgb(12, 34, 56)');
  });
});

const sequenceLine = (start = 1, end = 4) => `
  <div class="line" data-start="${start}" data-end="${end}">
    <span class="line-left">${start}</span>
    <span class="line-middle"><span>AC</span><span>GT</span></span>
    <span class="line-right">${end}</span>
  </div>
`;

describe('sequence visible range', () => {
  let container: HTMLDivElement;
  let element: SequenceElement;
  let ranges: VisibleRangeEventDetail[];

  const template = (count: number, descending = false) =>
    '<template id="styles"><style>' +
    ':host { --gutter-width: 5ch; font: 16px/20px monospace; }' +
    '.line { height: 20px; }' +
    '</style></template><template id="sequence">' +
    Array.from({ length: count }, (_, index) => {
      const start = descending ? count * 4 - index * 4 : index * 4 + 1;
      return sequenceLine(start, descending ? start - 3 : start + 3);
    }).join('') +
    '</template>';

  beforeEach(() => {
    ranges = [];
    container = document.createElement('div');
    container.style.cssText = 'height: 45px; width: 1000px; overflow: auto;';
    element = document.createElement(
      'ens-sequence-viewer-sequence'
    ) as SequenceElement;
    container.addEventListener('visible-range-change', (event) => {
      ranges.push((event as CustomEvent<VisibleRangeEventDetail>).detail);
    });
    container.append(element);
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it.each([
    { descending: false, start: 5, end: 12, row: 1 },
    { descending: false, start: 0, end: 12, row: 0 },
    { descending: true, start: 0, end: 16, row: 6 },
    { descending: true, start: 0, end: 45, row: 0 }
  ])(
    'jumps to row $row for $start–$end with descending=$descending',
    ({ descending, start, end, row }) => {
      element.sequence = template(10, descending);
      container.scrollTop = 20;

      element.scrollToInterval({ start, end });

      expect(container.scrollTop).toBe(row * 20);
    }
  );

  it('jumps to an offscreen chunk and keeps its position for a disjoint interval', () => {
    element.sequence = template(1_000);

    element.scrollToInterval({ start: 2_000, end: 2_050 });
    expect(container.scrollTop).toBe(499 * 20);

    element.scrollToInterval({ start: 4_001, end: 4_050 });
    expect(container.scrollTop).toBe(499 * 20);
  });

  it('ignores aligned protein lines, including at the viewport edges', async () => {
    const observe = vi.spyOn(IntersectionObserver.prototype, 'observe');
    const proteinLine = sequenceLine(1, 4).replace(
      'class="line"',
      'class="line protein-line"'
    );
    container.style.height = '125px';
    element.sequence = template(0).replace(
      '<template id="sequence">',
      '<template id="sequence">' +
        proteinLine +
        sequenceLine(101, 104) +
        proteinLine +
        sequenceLine(201, 204) +
        proteinLine
    );

    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 101, end: 104 },
        lastLine: { start: 201, end: 204 }
      });
    expect(
      observe.mock.calls.some(([target]) =>
        target.classList.contains('protein-line')
      )
    ).toBe(false);

    // A viewport showing only an aligned row has no primary sequence range.
    container.style.height = '10px';
    container.scrollTop = 50;
    await expect.poll(() => ranges.at(-1)).toBeNull();
  });

  it('reports partially visible lines and scrolls within and across chunks', async () => {
    const observe = vi.spyOn(IntersectionObserver.prototype, 'observe');
    element.sequence = template(1000);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });

    // Ten chunk targets and the first hundred lines, rather than all 1000 lines.
    expect(observe.mock.calls).toHaveLength(110);

    container.scrollTop = 100;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 21, end: 24 },
        lastLine: { start: 29, end: 32 }
      });

    container.scrollTop = 4000;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 801, end: 804 },
        lastLine: { start: 809, end: 812 }
      });

    container.scrollTop = 0;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });
  });

  it('excludes lines below the browser viewport even inside the scroll container', async () => {
    container.style.cssText =
      'position: fixed; bottom: -155px; left: 0; height: 200px; width: 1000px; overflow: auto;';
    element.sequence = template(100);

    // Only the top 45px of the 200px container is on screen.
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });

    container.scrollTop = 20;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 5, end: 8 },
        lastLine: { start: 13, end: 16 }
      });

    // Moving the pane fully offscreen should clear the reported range.
    container.style.bottom = '-201px';
    await expect.poll(() => ranges.at(-1)).toBeNull();

    container.style.bottom = '-155px';
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 5, end: 8 },
        lastLine: { start: 13, end: 16 }
      });
  });

  it('updates after resizing and suppresses unchanged ranges', async () => {
    element.sequence = template(10);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });
    const eventCount = ranges.length;
    container.scrollTop = 1;
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(ranges).toHaveLength(eventCount);

    container.style.height = '25px';
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 5, end: 8 }
      });
  });

  it('preserves descending coordinates in display order when scrolling both ways', async () => {
    element.sequence = template(10, true);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 40, end: 37 },
        lastLine: { start: 32, end: 29 }
      });

    container.scrollTop = 20;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 36, end: 33 },
        lastLine: { start: 28, end: 25 }
      });

    container.scrollTop = 0;
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 40, end: 37 },
        lastLine: { start: 32, end: 29 }
      });
  });

  it('reports the same coordinates for both edges when only one line is visible', async () => {
    container.style.height = '10px';
    element.sequence = template(10, true);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 40, end: 37 },
        lastLine: { start: 40, end: 37 }
      });
  });

  it('rebinds on sequence replacement and reports an empty sequence', async () => {
    element.sequence = template(10);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });
    element.sequence = template(10, true);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 40, end: 37 },
        lastLine: { start: 32, end: 29 }
      });
    element.sequence = template(0);
    await expect.poll(() => ranges.at(-1)).toBeNull();
  });

  it('stops reporting on disconnect and resumes on reconnect', async () => {
    element.sequence = template(10);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });
    element.remove();
    ranges.length = 0;
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(ranges).toEqual([]);

    container.append(element);
    await expect
      .poll(() => ranges.at(-1))
      .toEqual({
        firstLine: { start: 1, end: 4 },
        lastLine: { start: 9, end: 12 }
      });
  });
});

const letterEvent = (element: SequenceElement, type: string, index = 0) => {
  const container = element.shadowRoot!.querySelector('.line-middle')!;
  const text = container.querySelector('span')!.firstChild!;
  const range = document.createRange();
  range.setStart(text, index);
  range.setEnd(text, index + 1);
  const rect = range.getBoundingClientRect();
  text.parentElement!.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      composed: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    })
  );
};

describe('sequence interactions', () => {
  let element: SequenceElement;

  beforeEach(() => {
    element = document.createElement(
      'ens-sequence-viewer-sequence'
    ) as SequenceElement;
    element.style.setProperty('--gutter-width', '8ch');
    element.style.setProperty('--font-family-monospace', 'monospace');
    element.sequenceContext = {
      genomeId: 'genome',
      location: { regionName: '13', start: 1, end: 100 }
    };
    document.body.append(element);
    element.sequence = response(sequenceLine());
  });

  afterEach(() => {
    element.remove();
    window.getSelection()?.removeAllRanges();
    vi.restoreAllMocks();
  });

  it('shows selection actions after a mouse drag', async () => {
    const column = element.shadowRoot!.querySelector('.line-middle')!;
    await userEvent.dragAndDrop(
      column.firstElementChild!,
      column.lastElementChild!,
      {
        sourcePosition: { x: 1, y: 7 },
        targetPosition: { x: 15, y: 7 }
      }
    );
    await vi.waitFor(() =>
      expect(
        element
          .shadowRoot!.querySelector('[popover]')
          ?.getAttribute('data-mode')
      ).toBe('selection')
    );
  });

  it('keeps selection actions open after a gesture that dismisses another popover', async () => {
    const existing = document.createElement('div');
    existing.popover = 'auto';
    existing.textContent = 'Another popover';
    document.body.append(existing);
    existing.showPopover();
    try {
      const column = element.shadowRoot!.querySelector('.line-middle')!;
      await userEvent.dragAndDrop(
        column.firstElementChild!,
        column.lastElementChild!,
        {
          sourcePosition: { x: 1, y: 7 },
          targetPosition: { x: 15, y: 7 }
        }
      );
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
      const popover = element.shadowRoot!.querySelector<HTMLElement>(
        '[data-mode="selection"]'
      );
      expect(popover?.matches(':popover-open')).toBe(true);
    } finally {
      existing.remove();
    }
  });

  it('shows selection actions after a mouse drag across lines', async () => {
    element.sequence = response(sequenceLine(1, 4) + sequenceLine(5, 8));
    const columns = element.shadowRoot!.querySelectorAll('.line-middle');
    await userEvent.dragAndDrop(
      columns[0].firstElementChild!,
      columns[1].lastElementChild!,
      {
        sourcePosition: { x: 1, y: 7 },
        targetPosition: { x: 15, y: 7 }
      }
    );
    await vi.waitFor(() =>
      expect(
        element
          .shadowRoot!.querySelector('[popover]')
          ?.getAttribute('data-mode')
      ).toBe('selection')
    );
  });

  it.each(['upwards', 'downwards'])(
    'anchors an %s selection at the released letter',
    async (direction) => {
      element.sequence = response(sequenceLine(1, 4) + sequenceLine(5, 8));
      const root = element.shadowRoot!;
      const columns = root.querySelectorAll('.line-middle');
      const upwards = direction === 'upwards';
      const source = columns[upwards ? 1 : 0].firstElementChild!;
      const target = columns[upwards ? 0 : 1].firstElementChild!;
      const letterRange = document.createRange();
      letterRange.setStart(target.firstChild!, 0);
      letterRange.setEnd(target.firstChild!, 1);
      const letterRect = letterRange.getBoundingClientRect();
      source.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, composed: true })
      );
      const selection = (
        root as ShadowRoot & { getSelection: () => Selection }
      ).getSelection();
      selection.setBaseAndExtent(source.firstChild!, 1, target.firstChild!, 0);
      target.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          composed: true,
          clientX: letterRect.left + letterRect.width / 2,
          clientY: letterRect.top + letterRect.height / 2
        })
      );
      await vi.waitFor(() =>
        expect(
          root
            .querySelector('[data-mode="selection"]')
            ?.matches(':popover-open')
        ).toBe(true)
      );
      const line = target.closest<HTMLElement>('.line')!;
      const popover = root.querySelector<HTMLElement>('[popover]')!;
      expect(popover.style.getPropertyValue('position-anchor')).toBe(
        line.style.getPropertyValue('anchor-name')
      );
      expect(
        parseFloat(popover.style.getPropertyValue('--letter-offset-x'))
      ).toBeCloseTo(letterRect.right - line.getBoundingClientRect().left);
    }
  );

  it.each([
    {
      name: 'genomic coordinates across a gap',
      lines:
        sequenceLine(32272829, 32272832) + sequenceLine(32273001, 32273004),
      attributes:
        'data-region-name="13" data-sequence-type="genomic" data-assembly-accession="GCA_000001405.29" data-strand="forward"',
      expectedRange: '13:32,272,830-32,273,002',
      expectedSequence:
        '>13 genomic assembly:GCA_000001405.29 location:13:32272830-32273002 strand:+\nCGTAC'
    },
    {
      name: 'descending genomic coordinates',
      lines: sequenceLine(2004, 2001) + sequenceLine(1004, 1001),
      attributes:
        'data-region-name="13" data-sequence-type="genomic" data-assembly-accession="GCA_000001405.29" data-strand="reverse" data-reverse-complement="true"',
      expectedRange: '13:1,003-2,003',
      expectedSequence:
        '>13 genomic assembly:GCA_000001405.29 location:13:1003-2003 strand:-\nCGTAC'
    },
    {
      name: 'aligned protein annotations',
      lines:
        sequenceLine(1, 4).replace('<span>GT</span>', '<span> G T </span>') +
        sequenceLine(101, 104).replace(
          'class="line"',
          'class="line protein-line"'
        ) +
        sequenceLine(5, 8),
      attributes: '',
      expectedRange: '2-6',
      expectedSequence: 'CGTAC'
    }
  ])(
    'shows and copies the selected range for $name',
    async ({ lines, attributes, expectedRange, expectedSequence }) => {
      const writeText = vi
        .spyOn(navigator.clipboard, 'writeText')
        .mockResolvedValue(undefined);
      element.sequence = response(lines).replace(
        '<template id="sequence">',
        `<template id="sequence" ${attributes}>`
      );
      const root = element.shadowRoot!;
      const columns = root.querySelectorAll(
        '.line:not(.protein-line) .line-middle'
      );
      const range = document.createRange();
      range.setStart(columns[0].firstElementChild!.firstChild!, 1);
      range.setEnd(columns[1].firstElementChild!.firstChild!, 2);
      const selection = (
        root as ShadowRoot & { getSelection: () => Selection }
      ).getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      columns[1].dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
      );
      const popover = root.querySelector('[data-mode="selection"]')!;
      expect(
        Array.from(popover.children)
          .slice(0, 3)
          .map((node) => node.textContent)
      ).toEqual(['Selected range', expectedRange, '5 bp']);

      const copyCoordinates = page.getByRole('button', {
        name: 'Copy coordinates'
      });
      const copySequence = page.getByRole('button', { name: 'Copy sequence' });
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      try {
        await copyCoordinates.click();
        await expect
          .element(page.getByRole('button', { name: 'Copied' }))
          .toBeDisabled();
        await copySequence.click();
        await expect
          .element(page.getByRole('button', { name: 'Copied' }).nth(1))
          .toBeDisabled();
        expect(writeText.mock.calls).toEqual([
          [expectedRange],
          [expectedSequence]
        ]);

        vi.advanceTimersByTime(2000);
        await expect.element(copyCoordinates).toBeEnabled();
        await expect.element(copySequence).toBeEnabled();
      } finally {
        vi.useRealTimers();
      }
    }
  );

  it.each([
    {
      view: 'cdna',
      unit: 'bp',
      attributes:
        'data-feature-id="ENST00000380152.8" data-assembly-accession="GCA_000001405.29"',
      header: '>ENST00000380152.8 cdna assembly:GCA_000001405.29 6-10'
    },
    {
      view: 'cds',
      unit: 'bp',
      attributes:
        'data-feature-id="ENST00000380152.8" data-assembly-accession="GCA_000001405.29" data-reverse-complement="true"',
      header:
        '>ENST00000380152.8 cds assembly:GCA_000001405.29 6-10 reverse complement'
    },
    {
      view: 'protein',
      unit: 'aa',
      attributes: 'data-feature-id="ENSP00000369497"',
      header: '>ENSP00000369497 pep 6-10'
    }
  ] as const)(
    'uses molecule-relative positions when copying $view selections',
    async ({ view, unit, attributes, header }) => {
      const writeText = vi
        .spyOn(navigator.clipboard, 'writeText')
        .mockResolvedValue(undefined);
      // The first line is unselected. Positions continue from the first residue,
      // independently of any genomic coordinates attached to the lines.
      element.sequence = response(
        sequenceLine(32272829, 32272832) +
          sequenceLine(32273001, 32273004) +
          sequenceLine(32273101, 32273104)
      ).replace(
        '<template id="sequence">',
        `<template id="sequence" data-sequence-type="${view}" ${attributes}>`
      );
      const root = element.shadowRoot!;
      const columns = root.querySelectorAll('.line-middle');
      const selection = (
        root as ShadowRoot & { getSelection: () => Selection }
      ).getSelection();
      // Select backwards, across lines and nested spans.
      selection.setBaseAndExtent(
        columns[2].firstElementChild!.firstChild!,
        2,
        columns[1].firstElementChild!.firstChild!,
        1
      );
      columns[1].dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
      );
      const popover = root.querySelector('[data-mode="selection"]')!;
      expect(
        Array.from(popover.children)
          .slice(0, 3)
          .map((node) => node.textContent)
      ).toEqual(['Selected range', '6-10', `5 ${unit}`]);
      await page.getByRole('button', { name: 'Copy sequence' }).click();
      expect(writeText).toHaveBeenCalledExactlyOnceWith(`${header}\nCGTAC`);
    }
  );

  it.each([
    {
      name: 'selection away from the region edges',
      row: [2004, 2001],
      regionLength: 5000,
      expectedLocation: { start: 1987, end: 2016 }
    },
    {
      name: 'selection near the start of the region',
      row: [1, 4],
      regionLength: 1000,
      expectedLocation: { start: 1, end: 30 }
    },
    {
      name: 'descending selection near the end of the region',
      row: [1000, 997],
      regionLength: 1000,
      expectedLocation: { start: 971, end: 1000 }
    },
    {
      name: 'region shorter than the minimum viewport',
      row: [3, 6],
      regionLength: 8,
      expectedLocation: { start: 1, end: 8 }
    },
    {
      name: 'location context without a template region length',
      row: [2004, 2001],
      regionLength: undefined,
      expectedLocation: { start: 1974, end: 2003 }
    }
  ])(
    'emits an in-bounds viewport for $name',
    async ({ row, regionLength, expectedLocation }) => {
      element.sequenceContext =
        regionLength === undefined
          ? {
              genomeId: 'genome',
              location: { regionName: '13', start: 1, end: 100 }
            }
          : {
              genomeId: 'genome',
              transcript: { stableId: 'transcript' },
              sequenceView: 'genomic'
            };
      element.sequence = response(sequenceLine(row[0], row[1])).replace(
        '<template id="sequence">',
        regionLength !== undefined
          ? `<template id="sequence" data-region-name="13" data-region-length="${regionLength}">`
          : '<template id="sequence">'
      );
      const root = element.shadowRoot!;
      const column = root.querySelector('.line-middle')!;
      const selection = (
        root as ShadowRoot & { getSelection: () => Selection }
      ).getSelection();
      selection.setBaseAndExtent(
        column.lastElementChild!.firstChild!,
        2,
        column.firstElementChild!.firstChild!,
        1
      );
      column.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
      );
      const events: CustomEvent[] = [];
      element.addEventListener('genome-browser-navigation', (event) => {
        events.push(event as CustomEvent);
      });
      const button = page.getByRole('button', {
        name: 'View in genome browser'
      });
      await expect.element(button).toBeVisible();
      await button.click();
      expect(events.map((event) => event.detail)).toEqual([
        { location: { regionName: '13', ...expectedLocation } }
      ]);
      expect(events.every((event) => event.bubbles && event.composed)).toBe(
        true
      );
    }
  );

  it('hides the genome browser button when the region is unavailable', async () => {
    element.sequenceContext = {
      genomeId: 'genome',
      transcript: { stableId: 'transcript' },
      sequenceView: 'genomic'
    };
    const root = element.shadowRoot!;
    const column = root.querySelector('.line-middle')!;
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    const range = document.createRange();
    range.selectNodeContents(column);
    selection.removeAllRanges();
    selection.addRange(range);
    column.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
    );

    expect(root.querySelector('[data-mode="selection"]')).not.toBeNull();
    await expect
      .element(page.getByRole('button', { name: 'View in genome browser' }))
      .not.toBeInTheDocument();
  });

  it('formats selection length and ignores whitespace and coordinate gutters', () => {
    element.sequence = response(sequenceLine(1000, 2003)).replace(
      '<span>AC</span><span>GT</span>',
      `<span> ${'A'.repeat(1000)} </span><span>AAAA </span>`
    );
    const root = element.shadowRoot!;
    const line = root.querySelector('.line')!;
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    const range = document.createRange();
    range.selectNodeContents(line);
    selection.removeAllRanges();
    selection.addRange(range);
    line.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
    );
    const popover = root.querySelector('[data-mode="selection"]')!;
    expect(
      Array.from(popover.children)
        .slice(0, 3)
        .map((node) => node.textContent)
    ).toEqual(['Selected range', '1,000-2,003', '1,004 bp']);
  });

  it('ignores a selection containing only coordinate gutters', () => {
    const root = element.shadowRoot!;
    const range = document.createRange();
    range.selectNodeContents(root.querySelector('.line-left')!);
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    expect(getSequenceSelection({ root })).toBeNull();
  });

  it('shows selection actions after selecting a word with a double click', async () => {
    await userEvent.dblClick(
      element.shadowRoot!.querySelector('.line-middle span')!
    );
    await vi.waitFor(() =>
      expect(
        element
          .shadowRoot!.querySelector('[popover]')
          ?.getAttribute('data-mode')
      ).toBe('selection')
    );
  });

  it('highlights letters and shows coordinates without fetching features', () => {
    letterEvent(element, 'mousemove');
    const root = element.shadowRoot!;
    const highlight = root.querySelector('.letter-highlight')!;
    expect(root.querySelector('[popover]')!.textContent).toBe('A: 1');
    expect(getComputedStyle(root.querySelector('.line-middle')!).cursor).toBe(
      'pointer'
    );
    expect(getComputedStyle(highlight).pointerEvents).toBe('none');
    letterEvent(element, 'mousemove', 1);
    expect(root.querySelector('.letter-highlight')).toBe(highlight);
    expect(root.querySelector('[popover]')!.textContent).toBe('C: 2');
    element.dispatchEvent(new MouseEvent('mouseleave'));
    expect(root.querySelector('.letter-highlight')).toBeNull();
    expect(root.querySelector('[popover]')).toBeNull();
    expect(root.querySelector('.has-hovered-letter')).toBeNull();
  });

  it.each([
    {
      context: {
        genomeId: 'location-genome',
        location: { regionName: 'X', start: 10, end: 200 }
      },
      expected: {
        genome_uuid: 'location-genome',
        focus_location: { region_name: 'X', start: 10, end: 200 }
      }
    },
    {
      context: {
        genomeId: 'gene-genome',
        gene: { stableId: 'gene-id' }
      },
      expected: {
        genome_uuid: 'gene-genome',
        focus_gene: { stable_id: 'gene-id' }
      }
    },
    {
      context: {
        genomeId: 'transcript-genome',
        transcript: { stableId: 'transcript-id' },
        sequenceView: 'cdna' as const
      },
      expected: {
        genome_uuid: 'transcript-genome',
        focus_transcript: { stable_id: 'transcript-id' },
        sequence_type: 'cdna'
      }
    }
  ])(
    'uses the updated sequence context: $context',
    async ({ context, expected }) => {
      const fetch = vi
        .spyOn(window, 'fetch')
        .mockImplementation(async () => new Response('<div>Features</div>'));
      letterEvent(element, 'click');
      const firstRequest = fetch.mock.calls[0][0] as Request;
      expect(await firstRequest.json()).toEqual({
        genome_uuid: 'genome',
        focus_location: { region_name: '13', start: 1, end: 100 },
        location: { start: 1, end: 1 }
      });

      element.sequenceContext = context;
      letterEvent(element, 'click', 1);
      const updatedRequest = fetch.mock.calls[1][0] as Request;
      expect(await updatedRequest.json()).toEqual({
        ...expected,
        location: { start: 2, end: 2 }
      });
      await vi.waitFor(() =>
        expect(
          element.shadowRoot!.querySelector('[popover]')!.textContent
        ).toContain('Features')
      );
    }
  );

  it.each([undefined, '13'])(
    'formats coordinates in hover and click popovers with region %s',
    async (regionName) => {
      const fetch = vi
        .spyOn(window, 'fetch')
        .mockImplementation(async () => new Response('<div>Features</div>'));
      const template = response(sequenceLine(32272829, 32272832));
      element.sequence = regionName
        ? template.replace(
            '<template id="sequence">',
            `<template id="sequence" data-region-name="${regionName}">`
          )
        : template;
      const expected = regionName ? 'A: 13:32,272,829' : 'A: 32,272,829';

      letterEvent(element, 'mousemove');
      expect(element.shadowRoot!.querySelector('[popover]')!.textContent).toBe(
        expected
      );
      expect(fetch).not.toHaveBeenCalled();

      letterEvent(element, 'click');
      expect(
        element.shadowRoot!.querySelector('[popover]')!.firstElementChild!
          .textContent
      ).toBe(expected);
      await vi.waitFor(() =>
        expect(
          element.shadowRoot!.querySelector('[popover]')!.textContent
        ).toContain('Features')
      );
      expect(
        element.shadowRoot!.querySelector('[popover]')!.firstElementChild!
          .textContent
      ).toBe(expected);
      const request = fetch.mock.calls[0][0] as Request;
      expect((await request.json()).location).toEqual({
        start: 32272829,
        end: 32272829
      });

      element.sequence = template;
      letterEvent(element, 'mousemove');
      expect(element.shadowRoot!.querySelector('[popover]')!.textContent).toBe(
        'A: 32,272,829'
      );
    }
  );

  it('keeps feature content open on hover and ignores stale requests', async () => {
    let resolveFirst!: (response: Response) => void;
    const fetch = vi
      .spyOn(window, 'fetch')
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          })
      )
      .mockResolvedValueOnce(new Response('<div>Second features</div>'));
    letterEvent(element, 'click');
    expect(
      element.shadowRoot!.querySelector('[popover]')!.textContent
    ).toContain('Loading');
    letterEvent(element, 'click', 1);
    expect((fetch.mock.calls[0][0] as Request).signal.aborted).toBe(true);
    await vi.waitFor(() =>
      expect(
        element.shadowRoot!.querySelector('[popover]')!.textContent
      ).toContain('Second features')
    );
    resolveFirst(new Response('<div>Stale features</div>'));
    await Promise.resolve();
    letterEvent(element, 'mousemove');
    const popover = element.shadowRoot!.querySelector('[popover]')!;
    expect(popover.textContent).toContain('Second features');
    expect(popover.textContent).not.toContain('Stale features');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(element.shadowRoot!.querySelector('[popover]')).toBeNull();
  });

  it('shows errors and invalidates requests when the sequence is replaced', async () => {
    const fetch = vi
      .spyOn(window, 'fetch')
      .mockRejectedValueOnce(new Error('offline'));
    letterEvent(element, 'click');
    await vi.waitFor(() =>
      expect(
        element.shadowRoot!.querySelector('[popover]')!.textContent
      ).toContain('Unable to load')
    );
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    letterEvent(element, 'click');
    element.sequence = response(sequenceLine());
    expect((fetch.mock.calls[1][0] as Request).signal.aborted).toBe(true);
    expect(element.shadowRoot!.querySelector('[popover]')).toBeNull();
  });

  it('keeps the clicked letter highlighted until its feature popover closes', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response('<div>Features</div>')
    );
    letterEvent(element, 'mousemove');
    letterEvent(element, 'click', 1);
    const root = element.shadowRoot!;
    const highlight = root.querySelector<HTMLElement>('.letter-highlight')!;
    expect(highlight).not.toBeNull();
    const left = highlight.style.left;
    await vi.waitFor(() =>
      expect(root.querySelector('[popover]')!.textContent).toContain('Features')
    );
    letterEvent(element, 'mousemove');
    element.dispatchEvent(new MouseEvent('mouseleave'));
    document.dispatchEvent(new Event('scroll'));
    expect(root.querySelector('.letter-highlight')).toBe(highlight);
    expect(highlight.style.left).toBe(left);
    root.querySelector<HTMLElement>('[popover]')!.hidePopover();
    await vi.waitFor(() =>
      expect(root.querySelector('.letter-highlight')).toBeNull()
    );
  });

  it('anchors a multiline selection to its last selected sequence line', () => {
    element.sequence = response(sequenceLine(10, 7) + sequenceLine(6, 3));
    const root = element.shadowRoot!;
    const columns = root.querySelectorAll('.line-middle');
    const range = document.createRange();
    range.setStart(columns[0].querySelector('span')!.firstChild!, 1);
    range.setEnd(columns[1].querySelector('span')!.firstChild!, 2);
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    expect(getSequenceSelection({ root })?.lineBlock).toBe(
      columns[1].closest('.line')
    );
  });

  it('opens selection actions after mouse release and suppresses the following click', async () => {
    const fetch = vi.spyOn(window, 'fetch');
    const root = element.shadowRoot!;
    const column = root.querySelector('.line-middle')!;
    column.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    const range = document.createRange();
    range.selectNodeContents(column);
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    let openedDuringRelease = false;
    document.addEventListener(
      'pointerup',
      () => {
        openedDuringRelease = Boolean(
          root.querySelector('[data-mode="selection"]')
        );
      },
      { once: true }
    );
    document.dispatchEvent(new PointerEvent('pointerup'));
    expect(openedDuringRelease).toBe(false);
    letterEvent(element, 'click');
    expect(fetch).not.toHaveBeenCalled();
    await vi.waitFor(() =>
      expect(
        root.querySelector('[data-mode="selection"]')?.matches(':popover-open')
      ).toBe(true)
    );
    const popover = root.querySelector('[popover]')!;
    expect(popover.getAttribute('data-mode')).toBe('selection');
    expect(
      Array.from(popover.children)
        .slice(0, 3)
        .map((node) => node.textContent)
    ).toEqual(['Selected range', '1-4', '4 bp']);
    expect(
      Array.from(
        popover.querySelectorAll('button'),
        (button) => button.getAttribute('aria-label') ?? button.textContent
      )
    ).toEqual(['Copy coordinates', 'Copy sequence', 'View in genome browser']);
    expect(popover.querySelector('a')).toBeNull();
    letterEvent(element, 'mousemove');
    expect(root.querySelector('[popover]')!.getAttribute('data-mode')).toBe(
      'selection'
    );
  });

  it('removes listeners on disconnection and installs them once on reconnection', () => {
    const fetch = vi
      .spyOn(window, 'fetch')
      .mockImplementation(() => new Promise(() => {}));
    element.remove();
    document.body.append(element);
    letterEvent(element, 'click');
    expect(fetch).toHaveBeenCalledTimes(1);
    element.remove();
    expect((fetch.mock.calls[0][0] as Request).signal.aborted).toBe(true);
    expect(element.shadowRoot!.querySelector('[popover]')).toBeNull();
  });

  it('cancels a pending feature request when the native popover is dismissed', async () => {
    const fetch = vi
      .spyOn(window, 'fetch')
      .mockImplementation(() => new Promise(() => {}));
    letterEvent(element, 'click');
    const popover =
      element.shadowRoot!.querySelector<HTMLElement>('[popover]')!;
    const hide = vi.spyOn(popover, 'hidePopover');
    popover.hidePopover();
    await vi.waitFor(() =>
      expect((fetch.mock.calls[0][0] as Request).signal.aborted).toBe(true)
    );
    expect(element.shadowRoot!.querySelector('[popover]')).toBeNull();
    expect(hide).toHaveBeenCalledTimes(1);
    expect(
      element
        .shadowRoot!.querySelector<HTMLElement>('.line')!
        .style.getPropertyValue('anchor-name')
    ).toBe('');
  });

  it('keeps a newly opened popover when native dismissal cleanup is pending', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(() => new Promise(() => {}));
    letterEvent(element, 'click');
    element.shadowRoot!.querySelector<HTMLElement>('[popover]')!.hidePopover();
    letterEvent(element, 'click', 1);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const popover =
      element.shadowRoot!.querySelector<HTMLElement>('[popover]')!;
    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover.textContent).toContain('C: 2');
  });

  it.each(['Escape', 'replacement', 'disconnect'])(
    'cancels a pending selection popover on %s',
    async (action) => {
      const root = element.shadowRoot!;
      const column = root.querySelector('.line-middle')!;
      column.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      const range = document.createRange();
      range.selectNodeContents(column);
      const selection = (
        root as ShadowRoot & { getSelection: () => Selection }
      ).getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new PointerEvent('pointerup'));
      if (action === 'Escape') {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      } else if (action === 'replacement') {
        element.sequence = response(sequenceLine());
      } else {
        element.remove();
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(root.querySelector('[popover]')).toBeNull();
    }
  );
});
