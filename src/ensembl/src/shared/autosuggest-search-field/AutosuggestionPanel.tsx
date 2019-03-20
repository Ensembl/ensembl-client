import React, { useReducer, useEffect, ReactNode } from 'react';
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

type Props = {
  title?: string;
  matchGroups: GroupOfMatchesType[];
  onSelect: (match: any) => void;
};

function getNextItemIndex(
  matchGroups: GroupOfMatchesType[],
  currentItemIndex: MatchIndex
) {
  const [groupIndex, itemIndex] = currentItemIndex;
  const currentGroup = matchGroups[groupIndex];
  if (itemIndex < currentGroup.matches.length - 1) {
    return [groupIndex, itemIndex + 1];
  } else if (groupIndex === matchGroups.length - 1) {
    // if this is the last item, cycle back to the first
    return [0, 0];
  } else {
    return [groupIndex + 1, 0];
  }
}

function getPreviousItemIndex(
  matchGroups: GroupOfMatchesType[],
  currentItemIndex: MatchIndex
) {
  const [groupIndex, itemIndex] = currentItemIndex;
  if (itemIndex > 0) {
    return [groupIndex, itemIndex - 1];
  } else if (groupIndex === 0) {
    // if this is the first item, cycle back to the last
    const lastGroupIndex = matchGroups.length - 1;
    const lastGroupItemIndex = matchGroups[lastGroupIndex].matches.length - 1;
    return [lastGroupIndex, lastGroupItemIndex];
  } else {
    const previousGroupIndex = groupIndex - 1;
    const lastItemIndex = matchGroups[previousGroupIndex].matches.length - 1;
    return [previousGroupIndex, lastItemIndex];
  }
}

const AutosuggestSearchField = (props: Props) => {
  function reducer(highlightedItemIndex: MatchIndex, action: any) {
    switch (action.type) {
      case 'next':
        return getNextItemIndex(props.matchGroups, highlightedItemIndex);
      case 'previous':
        return getPreviousItemIndex(props.matchGroups, highlightedItemIndex);
      case 'set':
        return action.payload;
    }
  }

  const [highlightedItemIndex, dispatch] = useReducer(reducer, [0, 0]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeypress);
    return () => window.removeEventListener('keyup', handleKeypress);
  }, []);

  const handleKeypress = (event: KeyboardEvent) => {
    if (event.keyCode === keyCodes.UP) {
      dispatch({ type: 'previous' });
    } else if (event.keyCode === keyCodes.DOWN) {
      dispatch({ type: 'next' });
    } else if (event.keyCode === keyCodes.ENTER) {
      handleEnter();
    }
  };

  const handleItemHover = (itemIndex: MatchIndex) => {
    dispatch({ type: 'set', payload: itemIndex });
  };

  const handleItemClick = (itemIndex: MatchIndex) => {
    props.onSelect(getMatchData(itemIndex));
  };

  const handleEnter = () => {
    props.onSelect(getMatchData(highlightedItemIndex));
  };

  const getMatchData = (itemIndex: MatchIndex) => {
    const [groupIndex, matchIndex] = itemIndex;
    return props.matchGroups[groupIndex].matches[matchIndex].data;
  };

  const groupsOfMatches = props.matchGroups.map((group, index) => {
    const isGroupWithHighlightedItem = index === highlightedItemIndex[0];
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
};

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
