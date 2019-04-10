import React, { useEffect, useReducer, useRef } from 'react';
import classNames from 'classnames';

import {
  getNextItemIndex,
  getPreviousItemIndex
} from './helpers/select-helpers';

import * as keyCodes from 'src/shared/constants/keyCodes';

import { Option, OptionGroup, GroupedOptionIndex } from './Select';

import styles from './Select.scss';

enum HighlightActionType {
  NEXT = 'next',
  PREVIOUS = 'previous',
  SET = 'set',
  SUBMIT = 'submit'
}
type HighlightedItemState = GroupedOptionIndex | null;
type HighlightAction =
  | { type: HighlightActionType.NEXT; payload: OptionGroup[] }
  | { type: HighlightActionType.PREVIOUS; payload: OptionGroup[] }
  | { type: HighlightActionType.SET; payload: GroupedOptionIndex }
  | {
      type: HighlightActionType.SUBMIT;
      payload: (index: GroupedOptionIndex) => void;
    };

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
  header: React.ReactNode;
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
    case HighlightActionType.SUBMIT:
      // side effect! and fallthrough to default! boo!
      state && action.payload(state);
    default:
      return state;
  }
};

const SelectOptionsPanel = (props: Props) => {
  const [highlightedItemIndex, dispatch] = useReducer(
    highlightedItemReducer,
    null
  );
  const elementRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (![keyCodes.UP, keyCodes.DOWN, keyCodes.ENTER].includes(event.keyCode)) {
      return;
    }

    event.preventDefault();

    if (event.keyCode === keyCodes.UP) {
      dispatch({
        type: HighlightActionType.PREVIOUS,
        payload: props.optionGroups
      });
    } else if (event.keyCode === keyCodes.DOWN) {
      dispatch({ type: HighlightActionType.NEXT, payload: props.optionGroups });
    } else if (event.keyCode === keyCodes.ENTER) {
      dispatch({ type: HighlightActionType.SUBMIT, payload: props.onSelect });
    }
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
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  });

  const handleItemHover = (index: GroupedOptionIndex) => {
    dispatch({ type: HighlightActionType.SET, payload: index });
  };

  const handleItemClick = (index: GroupedOptionIndex) => {
    props.onSelect(index);
  };

  return (
    <div className={styles.optionsPanel} ref={elementRef}>
      <div className={styles.optionsPanelHeader}>{props.header}</div>
      {props.optionGroups.map((optionGroup, index) => {
        const [groupIndex, itemIndex] = highlightedItemIndex || [null, null];
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
  );
};

const SelectOptionGroup = (props: OptionGroupProps) => {
  return (
    <ul>
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
  const onClick = () => props.onClick(optionIndex);

  return (
    <li className={className} onMouseEnter={onHover} onClick={onClick}>
      {props.label}
    </li>
  );
};

export default SelectOptionsPanel;
