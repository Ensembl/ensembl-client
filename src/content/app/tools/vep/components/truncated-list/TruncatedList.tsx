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

import { useState, Fragment, type ReactNode } from 'react';

export type TruncatedListToggleProps = {
  /** How many items are hidden while collapsed (never negative). */
  hiddenCount: number;
  isExpanded: boolean;
  toggle: () => void;
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
};

/**
 * A list that shows its first few items and reveals the rest on demand.
 *
 * The primitive owns only the expand state, the slicing and the hidden-item
 * count; the items and the toggle are both supplied by the caller, so this adds
 * no markup of its own.
 */
const TruncatedList = <Item,>(props: Props<Item>) => {
  const { items, visibleCount, renderItem, renderToggle } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const visible = isExpanded ? items : items.slice(0, visibleCount);
  const hiddenCount = Math.max(items.length - visibleCount, 0);
  const toggle = () => setIsExpanded((expanded) => !expanded);

  return (
    <>
      {visible.map((item, index) => (
        <Fragment key={index}>{renderItem(item, index)}</Fragment>
      ))}
      {hiddenCount > 0 && renderToggle({ hiddenCount, isExpanded, toggle })}
    </>
  );
};

export default TruncatedList;
