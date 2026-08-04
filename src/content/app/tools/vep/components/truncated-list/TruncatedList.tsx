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

import { useState, Fragment, type ReactNode, type SyntheticEvent } from 'react';
import { flushSync } from 'react-dom';

export type TruncatedListToggleProps = {
  /** How many items are hidden while collapsed (never negative). */
  hiddenCount: number;
  isExpanded: boolean;
  /**
   * Wire straight to the control's `onClick`. The event is what lets collapsing
   * hold its scroll position (see below); called without one it still toggles,
   * just without the correction.
   */
  toggle: (event?: SyntheticEvent<HTMLElement>) => void;
};

type Props<Item> = {
  items: Item[];
  /** How many items to show while collapsed. */
  visibleCount: number;
  renderItem: (item: Item, index: number) => ReactNode;
  /**
   * The toggle control, rendered only when something is hidden. This is a
   * render prop on purpose: the annotation lists deliberately do not share a
   * toggle presentation (a plain "+ n more" button in some places, the shared
   * ShowHide control in others), so each call site keeps its own markup.
   */
  renderToggle: (props: TruncatedListToggleProps) => ReactNode;
  /**
   * Put the toggle *before* the items rather than after them.
   *
   * The two shapes this serves read in opposite orders. A truncated list shows
   * some items and offers "n more" underneath. A collapsed detail shows a
   * summary and reveals the detail beneath it — same expand state, same
   * collapse-anchoring, but the control has to come first or the summary would
   * sit under what it summarises. `visibleCount: 0` is what makes it a detail
   * rather than a truncation.
   */
  toggleFirst?: boolean;
};

/**
 * The nearest ancestor that actually scrolls, or null when the page itself does.
 *
 * The results table scrolls inside its own viewport container rather than at
 * document level, so adjusting `window.scrollY` would move nothing. Walking up
 * keeps this correct either way.
 */
const scrollableAncestor = (element: HTMLElement): HTMLElement | null => {
  let node = element.parentElement;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    const scrolls = overflowY === 'auto' || overflowY === 'scroll';
    if (scrolls && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

/**
 * A list that shows its first few items and reveals the rest on demand.
 *
 * The primitive owns only the expand state, the slicing and the hidden-item
 * count; the items and the toggle are both supplied by the caller, so this adds
 * no markup of its own.
 */
const TruncatedList = <Item,>(props: Props<Item>) => {
  const { items, visibleCount, renderItem, renderToggle, toggleFirst } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const visible = isExpanded ? items : items.slice(0, visibleCount);
  const hiddenCount = Math.max(items.length - visibleCount, 0);

  /**
   * Collapsing removes items from *above* the toggle, so the control — and
   * everything after it — jumps up the page by however tall the hidden items
   * were. In a long results table that leaves the reader looking at a different
   * variant than the one they were expanding. So measure where the control sits,
   * collapse, and scroll by however far it moved.
   *
   * The measurement has to happen at click time, not at the previous render:
   * reading a long list means scrolling, which changes where the control is.
   * `flushSync` applies the collapse to the DOM straight away so the second
   * measurement can be taken in the same handler — before the browser paints,
   * so the correction is never seen as a jump.
   *
   * Expanding needs none of this: it only adds below the reader's position, so
   * nothing they are looking at moves.
   */
  const toggle = (event?: SyntheticEvent<HTMLElement>) => {
    const control = event?.currentTarget;
    if (!isExpanded || !control) {
      setIsExpanded((expanded) => !expanded);
      return;
    }
    const before = control.getBoundingClientRect().top;
    flushSync(() => setIsExpanded(false));
    // Negative: the control has risen, so scroll up by as much to leave it
    // under the cursor.
    const delta = control.getBoundingClientRect().top - before;
    if (delta === 0) {
      return;
    }
    const scroller = scrollableAncestor(control);
    if (scroller) {
      scroller.scrollTop += delta;
    } else {
      window.scrollBy(0, delta);
    }
  };

  const toggleNode =
    hiddenCount > 0 ? renderToggle({ hiddenCount, isExpanded, toggle }) : null;
  const itemNodes = visible.map((item, index) => (
    <Fragment key={index}>{renderItem(item, index)}</Fragment>
  ));

  return (
    <>
      {toggleFirst ? toggleNode : null}
      {itemNodes}
      {toggleFirst ? null : toggleNode}
    </>
  );
};

export default TruncatedList;
