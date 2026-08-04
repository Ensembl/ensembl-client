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
import userEvent from '@testing-library/user-event';

import TruncatedList from './TruncatedList';

const items = ['a', 'b', 'c', 'd', 'e'];

const renderList = (listItems: string[], visibleCount = 3) =>
  render(
    <TruncatedList
      items={listItems}
      visibleCount={visibleCount}
      renderItem={(item) => <div>{item}</div>}
      renderToggle={({ hiddenCount, isExpanded, toggle }) => (
        <button type="button" onClick={toggle}>
          {isExpanded ? 'Show fewer' : `+ ${hiddenCount} more`}
        </button>
      )}
    />
  );

afterEach(cleanup);

describe('TruncatedList', () => {
  it('shows only the first visibleCount items, with a toggle for the rest', () => {
    renderList(items);

    expect(screen.getByText('a')).toBeDefined();
    expect(screen.getByText('c')).toBeDefined();
    expect(screen.queryByText('d')).toBeNull();
    expect(screen.getByRole('button').textContent).toBe('+ 2 more');
  });

  it('shows no toggle when there are exactly visibleCount items', () => {
    renderList(items.slice(0, 3));

    expect(screen.getByText('c')).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows no toggle when there are fewer than visibleCount items', () => {
    renderList(items.slice(0, 1));

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reports a single hidden item at the boundary', () => {
    renderList(items.slice(0, 4));

    expect(screen.getByRole('button').textContent).toBe('+ 1 more');
  });

  it('reveals and re-hides the remaining items', async () => {
    const user = userEvent.setup();
    renderList(items);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('e')).toBeDefined();
    expect(screen.getByRole('button').textContent).toBe('Show fewer');

    await user.click(screen.getByRole('button'));

    expect(screen.queryByText('e')).toBeNull();
    expect(screen.getByRole('button').textContent).toBe('+ 2 more');
  });

  it('renders nothing for an empty list', () => {
    const { container } = renderList([]);

    expect(container.textContent).toBe('');
  });
  /**
   * Collapsing removes items from above the toggle, so the control and
   * everything after it jump up the page. In the results table that leaves the
   * reader looking at a different variant than the one they expanded, which is
   * the bug this anchoring fixes.
   *
   * jsdom does no layout, so the geometry is stubbed: the toggle reports one
   * position while expanded and a higher one once collapsed, and the scroller
   * reports that it scrolls.
   */
  describe('keeps the toggle in place when collapsing', () => {
    const renderInScroller = (tops: number[]) => {
      const view = render(
        <div data-test-id="scroller">
          <TruncatedList
            items={items}
            visibleCount={3}
            renderItem={(item) => <div>{item}</div>}
            renderToggle={({ hiddenCount, isExpanded, toggle }) => (
              <button type="button" onClick={toggle}>
                {isExpanded ? 'Show fewer' : `+ ${hiddenCount} more`}
              </button>
            )}
          />
        </div>
      );
      const scroller = screen.getByTestId('scroller');
      // a container that scrolls, as the results table's viewport does
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        overflowY: 'auto'
      } as CSSStyleDeclaration);
      Object.defineProperty(scroller, 'scrollHeight', { value: 1000 });
      Object.defineProperty(scroller, 'clientHeight', { value: 400 });
      scroller.scrollTop = 300;

      let call = 0;
      vi.spyOn(
        screen.getByRole('button'),
        'getBoundingClientRect'
      ).mockImplementation(
        () => ({ top: tops[Math.min(call++, tops.length - 1)] }) as DOMRect
      );
      return { view, scroller };
    };

    afterEach(() => vi.restoreAllMocks());

    it('scrolls back by however far the toggle moved', async () => {
      const user = userEvent.setup();
      // the toggle reads 500 while expanded and 200 once the list has shrunk,
      // so the correction is 300px upward
      const { scroller } = renderInScroller([500, 200]);

      await user.click(screen.getByRole('button')); // expand
      await user.click(screen.getByRole('button')); // collapse

      expect(scroller.scrollTop).toBe(0);
    });

    it('leaves the scroll alone when expanding', async () => {
      const user = userEvent.setup();
      const { scroller } = renderInScroller([500, 500]);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('e')).toBeDefined();
      expect(scroller.scrollTop).toBe(300);
    });
  });
});

/**
 * The collapsed-detail shape: `visibleCount: 0` plus `toggleFirst` turns the
 * same primitive into a summary that opens onto its detail. Without the
 * ordering the summary would sit underneath what it summarises.
 */
describe('toggleFirst', () => {
  const renderDetail = (toggleFirst: boolean) =>
    render(
      <TruncatedList
        items={['first', 'second']}
        visibleCount={0}
        toggleFirst={toggleFirst}
        renderItem={(item) => <span key={item}>{item}</span>}
        renderToggle={({ toggle }) => <button onClick={toggle}>summary</button>}
      />
    );

  it('renders the toggle before the items', async () => {
    const { container } = renderDetail(true);
    await userEvent.click(screen.getByRole('button'));
    expect(
      Array.from(container.firstChild!.parentElement!.querySelectorAll('*'))
        .map((n) => n.textContent)
        .slice(0, 3)
    ).toEqual(['summary', 'first', 'second']);
  });

  it('renders it after them without the flag', async () => {
    const { container } = renderDetail(false);
    await userEvent.click(screen.getByRole('button'));
    expect(
      Array.from(container.firstChild!.parentElement!.querySelectorAll('*'))
        .map((n) => n.textContent)
        .slice(0, 3)
    ).toEqual(['first', 'second', 'summary']);
  });
});
