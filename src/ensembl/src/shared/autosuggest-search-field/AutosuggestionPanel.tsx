import React, { useReducer, useEffect, ReactNode } from 'react';

import * as keyCodes from 'src/shared/constants/keyCodes';

import styles from './AutosuggestSearchField.scss';

type MatchProps = {
  data: any;
  element: ReactNode;
};

export type GroupOfMatchesProps = {
  title?: string;
  matches: MatchProps[];
};

type MatchIndex = [number, number]; // first number is index of the group; second number is index of item within this group

type Props = {
  title?: string;
  highlightedItemIndex: MatchIndex;
  matchGroups: GroupOfMatchesProps[];
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (match: any) => void;
};

function getNextItemIndex(
  matchGroups: GroupOfMatchesProps[],
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
  matchGroups: GroupOfMatchesProps[],
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

  useEffect(() => {
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.keyCode === keyCodes.UP) {
        dispatch({ type: 'previous' });
      } else if (event.keyCode === keyCodes.DOWN) {
        dispatch({ type: 'next' });
      }
    });
  }, []);

  const groupsOfMatches = props.matchGroups.map((group, index) => (
    <GroupOfMatches key={index} {...group} />
  ));

  return <div className={styles.autosuggestionPlate}>{groupsOfMatches}</div>;
};

const GroupOfMatches = (props: GroupOfMatchesProps) => {
  const matches = props.matches.map((match: MatchProps, index: number) => (
    <Match key={index} {...match} />
  ));

  return <div>{matches}</div>;
};

const Match = (props: MatchProps) => {
  return <div>{props.element}</div>;
};

export default AutosuggestSearchField;
