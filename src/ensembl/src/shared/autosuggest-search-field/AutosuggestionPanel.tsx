import React, { useReducer, useEffect, ReactNode } from 'react';
import classNames from 'classnames';

import * as keyCodes from 'src/shared/constants/keyCodes';

import styles from './AutosuggestSearchField.scss';

type MatchType = {
  data: any;
  element: ReactNode;
};

type MatchProps = MatchType & {
  isHighlighted: boolean;
};

export type GroupOfMatchesType = {
  title?: string;
  matches: MatchType[];
};

type GroupOfMatchesProps = GroupOfMatchesType & {
  highlightedItemIndex?: number;
};

type MatchIndex = [number, number]; // first number is index of the group; second number is index of item within this group

type Props = {
  title?: string;
  highlightedItemIndex: MatchIndex;
  matchGroups: GroupOfMatchesType[];
  onNext: () => void;
  onPrevious: () => void;
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
  const [highlightedItemIndex, dispatch] = useReducer(reducer, [0, 0]);

  function reducer(highlightedItemIndex: MatchIndex, action: any) {
    switch (action.type) {
      case 'next':
        return getNextItemIndex(props.matchGroups, highlightedItemIndex);
      case 'previous':
        return getPreviousItemIndex(props.matchGroups, highlightedItemIndex);
    }
  }

  const handleKeypress = (event: KeyboardEvent) => {
    if (event.keyCode === keyCodes.UP) {
      dispatch({ type: 'previous' });
    } else if (event.keyCode === keyCodes.DOWN) {
      dispatch({ type: 'next' });
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeypress);
    return () => window.removeEventListener('keyup', handleKeypress);
  }, []);

  const groupsOfMatches = props.matchGroups.map((group, index) => {
    const highlightProps =
      index === highlightedItemIndex[0]
        ? { highlightedItemIndex: highlightedItemIndex[1] }
        : {};

    return <GroupOfMatches key={index} {...group} {...highlightProps} />;
  });

  return <div className={styles.autosuggestionPlate}>{groupsOfMatches}</div>;
};

const GroupOfMatches = (props: GroupOfMatchesProps) => {
  const matches = props.matches.map((match: MatchType, index: number) => {
    return (
      <Match
        key={index}
        isHighlighted={index === props.highlightedItemIndex}
        {...match}
      />
    );
  });

  return <div className={styles.autosuggestionPlateMatchGroup}>{matches}</div>;
};

const Match = (props: MatchProps) => {
  const className = classNames({
    [styles.autosuggestionPlateHighlightedItem]: props.isHighlighted
  });

  return <div className={className}>{props.element}</div>;
};

export default AutosuggestSearchField;
