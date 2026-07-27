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
});
