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

import { userEvent } from 'vitest/browser';

import { getSequenceSelection } from './sequence-hit-testing';

import {
  Sequence as SequenceElement,
  type LegendEventDetail
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
    // Set event listener before setting the "sequence" property
    // (because the legend event will be sent synchronously after the template is parsed)
    const events: LegendEventDetail[] = [];
    element.addEventListener('report-legend', (event) => {
      events.push((event as CustomEvent<LegendEventDetail>).detail);
    });

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

    // Check that a legend event is dispatched
    expect(events).toEqual([{ template: legend + styles }]);
  });
});

const sequenceLine = (start = 1, end = 4) => `
  <div class="line" data-start="${start}" data-end="${end}">
    <span class="line-left">${start}</span>
    <span class="line-middle"><span>AC</span><span>GT</span></span>
    <span class="line-right">${end}</span>
  </div>
`;

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
    element.getOverlapRequestParams = () => ({
      genome_uuid: 'genome',
      focus_location: { region_name: '13', start: 1, end: 100 }
    });
    document.body.append(element);
    element.sequence = response(sequenceLine());
  });

  afterEach(() => {
    element.remove();
    window.getSelection()?.removeAllRanges();
    vi.restoreAllMocks();
  });

  it('shows selection actions after a real mouse drag', async () => {
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

  it('shows selection actions after a real drag across lines', async () => {
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

  it('shows selection actions after selecting a word with a double click', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response('<div>Features</div>')
    );
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
    const fetch = vi.spyOn(window, 'fetch');
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
    expect(fetch).not.toHaveBeenCalled();
    element.dispatchEvent(new MouseEvent('mouseleave'));
    expect(root.querySelector('.letter-highlight')).toBeNull();
    expect(root.querySelector('[popover]')).toBeNull();
    expect(root.querySelector('.has-hovered-letter')).toBeNull();
  });

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
    expect(getSequenceSelection(root)?.lineBlock).toBe(
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
    expect(popover.querySelector('button')!.textContent).toBe('Copy');
    expect(popover.textContent).toContain('hello world');
    expect(popover.querySelectorAll('button')).toHaveLength(2);
    expect(popover.querySelector('a')).toBeNull();
    letterEvent(element, 'mousemove');
    expect(root.querySelector('[popover]')!.getAttribute('data-mode')).toBe(
      'selection'
    );
  });

  it('only clears the selection when clicking inside selected text', async () => {
    const fetch = vi
      .spyOn(window, 'fetch')
      .mockResolvedValue(new Response('<div>Features</div>'));
    const root = element.shadowRoot!;
    const column = root.querySelector('.line-middle')!;
    const range = document.createRange();
    range.selectNodeContents(column);
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    column.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'ArrowRight',
        shiftKey: true,
        bubbles: true
      })
    );
    expect(
      root.querySelector('[data-mode="selection"]')?.matches(':popover-open')
    ).toBe(true);
    await userEvent.click(column.firstElementChild!);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(selection.isCollapsed).toBe(true);
    expect(root.querySelector('[popover]')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    await userEvent.click(column.firstElementChild!);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
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

  it('shows unwired selection buttons and clears hover on ancestor scrolling', () => {
    const root = element.shadowRoot!;
    letterEvent(element, 'mousemove');
    document.dispatchEvent(new Event('scroll'));
    expect(root.querySelector('.letter-highlight')).toBeNull();
    expect(root.querySelector('[popover]')).toBeNull();
    const range = document.createRange();
    range.selectNodeContents(root.querySelector('.line-middle')!);
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    root.querySelector('.line-middle')!.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'ArrowRight',
        shiftKey: true,
        bubbles: true
      })
    );
    const popover = root.querySelector<HTMLElement>('[popover]')!;
    expect(popover.textContent).toContain('hello world');
    for (const button of popover.querySelectorAll('button')) {
      expect(button.disabled).toBe(false);
      button.click();
    }
    expect(popover.textContent).toContain('hello world');
    expect(popover.matches(':popover-open')).toBe(true);
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
