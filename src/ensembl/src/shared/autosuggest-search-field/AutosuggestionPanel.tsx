import React, {
  forwardRef,
  useReducer,
  useEffect,
  useImperativeHandle,
  ReactNode
} from 'react';
import classNames from 'classnames';

import * as keyCodes from 'src/shared/constants/keyCodes';

import styles from './AutosuggestSearchField.scss';

type MatchType = {
  data: any;
  element: ReactNode;
};

type MatchProps = MatchType & {
  groupIndex: number;
  itemIndex: number;
  isHighlighted: boolean;
  onHover: (itemIndex: MatchIndex) => void;
  onClick: (itemIndex: MatchIndex) => void;
};

export type GroupOfMatchesType = {
  title?: string;
  matches: MatchType[];
};

type GroupOfMatchesProps = GroupOfMatchesType & {
  groupIndex: number;
  highlightedItemIndex: number | null;
  onItemHover: (itemIndex: MatchIndex) => void;
  onItemClick: (itemIndex: MatchIndex) => void;
};

type MatchIndex = [number, number]; // first number is index of the group; second number is index of item within this group

export type AutosuggestionPanelRef = {
  getIndexOfHighlightedItem: () => MatchIndex | null;
};

type Props = {
  title?: string;
  matchGroups: GroupOfMatchesType[];
  onSelect: (match: any) => void;
  allowRawInputSubmission: boolean;
};

function getNextItemIndex(props: Props, currentItemIndex: MatchIndex | null) {
  const { matchGroups, allowRawInputSubmission } = props;
  const [groupIndex, itemIndex] = currentItemIndex || [null, null];
  const currentGroup =
    typeof groupIndex === 'number' ? matchGroups[groupIndex] : null;
  const firstItemIndex = [0, 0];

  if (itemIndex === null) {
    return firstItemIndex;
  } else if (currentGroup && itemIndex < currentGroup.matches.length - 1) {
    return [groupIndex, itemIndex + 1];
  } else if (groupIndex === matchGroups.length - 1) {
    // this is the last item; either return null if submitting raw input is allowed, or
    // cycle back to the first item in the list
    return allowRawInputSubmission ? null : firstItemIndex;
  } else if (typeof groupIndex === 'number') {
    return [groupIndex + 1, 0];
  }
}

function getPreviousItemIndex(
  props: Props,
  currentItemIndex: MatchIndex | null
) {
  const { matchGroups, allowRawInputSubmission } = props;
  const [groupIndex, itemIndex] = currentItemIndex || [null, null];
  const lastGroupIndex = matchGroups.length - 1;
  const lastGroupItemIndex = matchGroups[lastGroupIndex].matches.length - 1;
  const lastItemIndex = [lastGroupIndex, lastGroupItemIndex];
  if (itemIndex === null) {
    return lastItemIndex;
  } else if (itemIndex > 0) {
    return [groupIndex, itemIndex - 1];
  } else if (groupIndex === 0) {
    // this is the first item; either return null if submitting raw input is allowed, or
    // cycle back to the last item in the list
    return allowRawInputSubmission ? null : lastItemIndex;
  } else if (typeof groupIndex === 'number') {
    const previousGroupIndex = groupIndex - 1;
    const lastItemIndex = matchGroups[previousGroupIndex].matches.length - 1;
    return [previousGroupIndex, lastItemIndex];
  }
}

const AutosuggestSearchField = forwardRef<AutosuggestionPanelRef, Props>(
  (props, ref) => {
    function reducer(highlightedItemIndex: MatchIndex | null, action: any) {
      switch (action.type) {
        case 'next':
          return getNextItemIndex(props, highlightedItemIndex);
        case 'previous':
          return getPreviousItemIndex(props, highlightedItemIndex);
        case 'set':
          return action.payload;
      }
    }
    const initialHighlightedItemIndex = props.allowRawInputSubmission
      ? null
      : [0, 0];

    const [highlightedItemIndex, dispatch] = useReducer(
      reducer,
      initialHighlightedItemIndex
    );

    useEffect(() => {
      window.addEventListener('keyup', handleKeypress);
      return () => window.removeEventListener('keyup', handleKeypress);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getIndexOfHighlightedItem: () => highlightedItemIndex
      }),
      [highlightedItemIndex]
    );

    const handleKeypress = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.keyCode === keyCodes.UP) {
        dispatch({ type: 'previous' });
      } else if (event.keyCode === keyCodes.DOWN) {
        dispatch({ type: 'next' });
      }
    };

    const handleItemHover = (itemIndex: MatchIndex) => {
      dispatch({ type: 'set', payload: itemIndex });
    };

    const handleItemClick = (itemIndex: MatchIndex) => {
      props.onSelect(getMatchData(itemIndex));
    };

    const getMatchData = (itemIndex: MatchIndex) => {
      const [groupIndex, matchIndex] = itemIndex;
      return props.matchGroups[groupIndex].matches[matchIndex].data;
    };

    const groupsOfMatches = props.matchGroups.map((group, index) => {
      const isGroupWithHighlightedItem =
        Boolean(highlightedItemIndex) && index === highlightedItemIndex[0];
      const groupProps = {
        groupIndex: index,
        highlightedItemIndex: isGroupWithHighlightedItem
          ? highlightedItemIndex[1]
          : null
      };

      return (
        <GroupOfMatches
          key={index}
          onItemHover={handleItemHover}
          onItemClick={handleItemClick}
          {...group}
          {...groupProps}
        />
      );
    });

    return <div className={styles.autosuggestionPlate}>{groupsOfMatches}</div>;
  }
);

const GroupOfMatches = (props: GroupOfMatchesProps) => {
  const matches = props.matches.map((match: MatchType, index: number) => {
    return (
      <Match
        key={index}
        groupIndex={props.groupIndex}
        itemIndex={index}
        isHighlighted={index === props.highlightedItemIndex}
        onHover={props.onItemHover}
        onClick={props.onItemClick}
        {...match}
      />
    );
  });

  return <div className={styles.autosuggestionPlateMatchGroup}>{matches}</div>;
};

const Match = (props: MatchProps) => {
  const index: MatchIndex = [props.groupIndex, props.itemIndex];

  const className = classNames(styles.autosuggestionPlateItem, {
    [styles.autosuggestionPlateHighlightedItem]: props.isHighlighted
  });

  const handleHover = () => {
    if (!props.isHighlighted) {
      props.onHover(index);
    }
  };

  const handleClick = () => {
    props.onClick(index);
  };

  return (
    <div className={className} onMouseOver={handleHover} onClick={handleClick}>
      {props.element}
    </div>
  );
};

export default AutosuggestSearchField;
