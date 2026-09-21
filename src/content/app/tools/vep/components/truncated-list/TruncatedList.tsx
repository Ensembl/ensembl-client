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

import {
  createContext,
  useContext,
  useState,
  Fragment,
  type ReactNode,
  type SyntheticEvent
} from 'react';
import { flushSync } from 'react-dom';

/**
 * Expand state owned by something outside the list.
 *
 * A list normally owns whether it is open, because normally it is the only one
 * of its kind on the page. The flat table splits one table into a column each,
 * so several lists end up showing slices of the same rows and have to open
 * together. Without a group the list keeps its own state, and that is what
 * every other caller gets.
 */
export type TruncationGroup = {
  isExpanded: boolean;
  toggle: () => void;
};

export const TruncationGroupContext = createContext<TruncationGroup | null>(
  null
);

export type TruncatedListToggleProps = {
  hiddenCount: number; // How many items are hidden while collapsed
  isExpanded: boolean;
  toggle: (event?: SyntheticEvent<HTMLElement>) => void;
};

type Props<Item> = {
  items: Item[];
  visibleCount: number; // How many items to show while collapsed.
  /**
   * `renderedCount` is how many items are on screen right now.
   * Needed if the caller is a table that has to calculate how many rows to span.
   */
  renderItem: (item: Item, index: number, renderedCount: number) => ReactNode;
  renderToggle: (props: TruncatedListToggleProps) => ReactNode;
  toggleFirst?: boolean; // Put the toggle before the items rather than after them
};

const findNearestScrollableAncestor = (
  element: HTMLElement
): HTMLElement | null => {
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
 */
const TruncatedList = <Item,>(props: Props<Item>) => {
  const { items, visibleCount, renderItem, renderToggle, toggleFirst } = props;
  const [ownExpanded, setOwnExpanded] = useState(false);

  // A shared group governs a truncation, never a collapsed detail.
  // `toggleFirst` tells the two shapes apart. A detail stays per-item, because
  // the chevron on one ClinVar classification says nothing about the next one.
  const group = useContext(TruncationGroupContext);
  const shared = group && !toggleFirst ? group : null;
  const isExpanded = shared ? shared.isExpanded : ownExpanded;
  const setIsExpanded = shared
    ? shared.toggle
    : () => setOwnExpanded((expanded) => !expanded);

  const visible = isExpanded ? items : items.slice(0, visibleCount);
  const hiddenCount = Math.max(items.length - visibleCount, 0);

  /**
   * Collapsing removes items from *above* the toggle, so the control — and
   * everything after it — jumps up the page by however tall the hidden items
   * were. In a long results table that leaves the reader looking at a different
   * variant than the one they were expanding. So measure where the control sits,
   * collapse, and scroll by however far it moved.
   *
   * The function uses `flushSync`, which applies component state update
   * to the DOM straight away, so that the second measurement can be taken
   * in the same handler and before the browser paints,
   * so the correction is never seen as a jump.
   */
  const toggle = (event?: SyntheticEvent<HTMLElement>) => {
    const control = event?.currentTarget;
    if (!isExpanded || !control) {
      // Expanding the list does not require any additional DOM manipulations
      // to correct the element's position.
      setIsExpanded();
      return;
    }
    const before = control.getBoundingClientRect().top;
    flushSync(() => setIsExpanded());
    const delta = control.getBoundingClientRect().top - before;
    if (delta === 0) {
      return;
    }
    const scroller = findNearestScrollableAncestor(control);
    if (scroller) {
      scroller.scrollTop += delta;
    } else {
      window.scrollBy(0, delta);
    }
  };

  const toggleNode =
    hiddenCount > 0 ? renderToggle({ hiddenCount, isExpanded, toggle }) : null;
  const itemNodes = visible.map((item, index) => (
    <Fragment key={index}>{renderItem(item, index, visible.length)}</Fragment>
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
