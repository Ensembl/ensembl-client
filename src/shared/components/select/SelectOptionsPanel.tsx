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
  useState,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  type ReactNode,
  type SyntheticEvent
} from 'react';
import classNames from 'classnames';

import {
  getNextItemIndex,
  getPreviousItemIndex,
  setOptionsPanelHeight,
  getPanelScrollStatus,
  scrollDown,
  scrollUp,
  scrollOptionIntoView
} from './helpers/select-helpers';

import SelectArrowhead, {
  Direction as ArrowheadDirection
} from './SelectArrowhead';

import { Option, OptionGroup, GroupedOptionIndex } from './Select';

import styles from './Select.module.css';

enum HighlightActionType {
  NEXT = 'next',
  PREVIOUS = 'previous',
  SET = 'set'
}
type HighlightedItemState = GroupedOptionIndex | null;
type HighlightAction =
  | { type: HighlightActionType.NEXT; payload: OptionGroup[] }
  | { type: HighlightActionType.PREVIOUS; payload: OptionGroup[] }
  | { type: HighlightActionType.SET; payload: GroupedOptionIndex };

type OptionGroupProps = OptionGroup & {
  highlightedItemIndex?: number;
  groupIndex: number;
  onItemHover: (index: GroupedOptionIndex) => void;
  onItemClick: (index: GroupedOptionIndex) => void;
};

type OptionProps = Option & {
  groupIndex: number;
  itemIndex: number;
  isHighlighed: boolean;
  onHover: (index: GroupedOptionIndex) => void;
  onClick: (index: GroupedOptionIndex) => void;
};

type Props = {
  optionGroups: OptionGroup[];
  header: ReactNode;
  onSelect: (index: GroupedOptionIndex) => void;
  onClose: () => void;
};

const highlightedItemReducer = (
  state: HighlightedItemState,
  action: HighlightAction
) => {
  switch (action.type) {
    case HighlightActionType.NEXT:
      return getNextItemIndex(state, action.payload);
    case HighlightActionType.PREVIOUS:
      return getPreviousItemIndex(state, action.payload);
    case HighlightActionType.SET:
      return action.payload;
    default:
      return state;
  }
};

const SelectOptionsPanel = (props: Props) => {
  const [shouldShowTopScrollButton, showTopScrollButton] = useState(false);
  const [shouldShowBottomScrollButton, showBottomScrollButton] =
    useState(false);
  const [highlightedItemIndex, dispatch] = useReducer(
    highlightedItemReducer,
    null
  );
  const elementRef = useRef<HTMLDivElement | null>(null);
  const optionsListRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(0);

  // to be able to reach the value of highlighted index
  // from within callbacks passed to useEffect
  const highlightedItemIndexRef = useRef(highlightedItemIndex);
  highlightedItemIndexRef.current = highlightedItemIndex;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowUp') {
      dispatch({
        type: HighlightActionType.PREVIOUS,
        payload: props.optionGroups
      });
    } else if (event.key === 'ArrowDown') {
      dispatch({ type: HighlightActionType.NEXT, payload: props.optionGroups });
    } else if (event.key === 'Enter') {
      highlightedItemIndexRef.current &&
        props.onSelect(highlightedItemIndexRef.current);
    }

    // scroll option into view after the state gets updated
    setTimeout(() => {
      if (!optionsListRef.current) {
        // keypress has caused the options panel to close
        return;
      }
      window.requestAnimationFrame(() => {
        scrollOptionIntoView({
          container: optionsListRef.current as HTMLDivElement,
          optionGroups: props.optionGroups,
          currentIndex: highlightedItemIndexRef.current as GroupedOptionIndex,
          selector: `.${styles.optionHighlighted}`
        });
      });
    }, 0);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const { target } = event;
    if (
      elementRef.current &&
      elementRef.current !== target &&
      !elementRef.current.contains(target as Node)
    ) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    setOptionsPanelHeight(elementRef);
    if (
      !getPanelScrollStatus(optionsListRef.current as HTMLDivElement)
        .isScrolledToBottom
    ) {
      showBottomScrollButton(true);
    }
  }, []);

  const handleItemHover = (index: GroupedOptionIndex) => {
    dispatch({ type: HighlightActionType.SET, payload: index });
  };

  const handleItemClick = (index: GroupedOptionIndex) => {
    props.onSelect(index);
  };

  const handleScroll = () => {
    const { isScrolledToTop, isScrolledToBottom } = getPanelScrollStatus(
      optionsListRef.current as HTMLDivElement
    );
    if (!isScrolledToTop && !shouldShowTopScrollButton) {
      showTopScrollButton(true);
    }
    if (isScrolledToTop && shouldShowTopScrollButton) {
      showTopScrollButton(false);
    }
    if (!isScrolledToBottom && !shouldShowBottomScrollButton) {
      showBottomScrollButton(true);
    }
    if (isScrolledToBottom && shouldShowBottomScrollButton) {
      showBottomScrollButton(false);
    }
  };

  const startScrollDown = () => {
    scrollDown(optionsListRef.current as HTMLDivElement, scrollRef);
  };

  const stopScrollDown = () => {
    window.cancelAnimationFrame(scrollRef.current);
  };

  const startScrollUp = () => {
    scrollUp(optionsListRef.current as HTMLDivElement, scrollRef);
  };

  const stopScrollUp = () => {
    window.cancelAnimationFrame(scrollRef.current);
  };

  return (
    <div
      className={styles.optionsPanel}
      ref={elementRef}
      onScroll={handleScroll}
    >
      <div className={styles.optionsPanelHeader}>{props.header}</div>
      <div className={styles.optionsListContainer}>
        {shouldShowTopScrollButton && (
          <div
            className={styles.scrollButtonTop}
            onMouseEnter={startScrollUp}
            onTouchStart={startScrollUp}
            onMouseLeave={stopScrollUp}
            onTouchEnd={stopScrollUp}
          >
            <SelectArrowhead direction={ArrowheadDirection.UP} />
          </div>
        )}
        <div className={styles.optionsList} ref={optionsListRef}>
          {props.optionGroups.map((optionGroup, index) => {
            const [groupIndex, itemIndex] = highlightedItemIndex || [
              null,
              null
            ];
            const otherProps =
              index === groupIndex
                ? { highlightedItemIndex: itemIndex as number }
                : {};

            return (
              <SelectOptionGroup
                {...optionGroup}
                groupIndex={index}
                onItemHover={handleItemHover}
                onItemClick={handleItemClick}
                {...otherProps}
                key={index}
              />
            );
          })}
        </div>
        {shouldShowBottomScrollButton && (
          <div
            className={styles.scrollButtonBottom}
            onMouseEnter={startScrollDown}
            onTouchStart={startScrollDown}
            onMouseLeave={stopScrollDown}
            onTouchEnd={stopScrollDown}
          >
            <SelectArrowhead />
          </div>
        )}
      </div>
    </div>
  );
};

const SelectOptionGroup = (props: OptionGroupProps) => {
  return (
    <ul className={styles.optionsGroup}>
      {props.title && <div>{props.title}</div>}
      {props.options.map((option, index) => (
        <SelectOption
          {...option}
          groupIndex={props.groupIndex}
          itemIndex={index}
          isHighlighed={index === props.highlightedItemIndex}
          onHover={props.onItemHover}
          onClick={props.onItemClick}
          key={index}
        />
      ))}
    </ul>
  );
};

const SelectOption = (props: OptionProps) => {
  const className = classNames(styles.option, {
    [styles.optionHighlighted]: props.isHighlighed
  });
  const optionIndex = [props.groupIndex, props.itemIndex] as GroupedOptionIndex;

  const onHover = () => props.onHover(optionIndex);
  const onClick = (event: SyntheticEvent<HTMLElement>) => {
    // this is to stop click propagation in the react event system
    event.stopPropagation();
    // this is to stop click propagation to the native document
    event.nativeEvent.stopImmediatePropagation();

    props.onClick(optionIndex);
  };

  return (
    <li className={className} onMouseEnter={onHover} onClick={onClick}>
      {props.label}
    </li>
  );
};

export default SelectOptionsPanel;
