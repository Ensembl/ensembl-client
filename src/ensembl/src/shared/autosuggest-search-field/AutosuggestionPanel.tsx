import React, { ReactNode } from 'react';
import classNames from 'classnames';

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

export type MatchIndex = [number, number] | null; // first number is index of the group; second number is index of item within this group

type Props = {
  title?: string;
  highlightedItemIndex: MatchIndex;
  matchGroups: GroupOfMatchesType[];
  onItemHover: (itemIndex: MatchIndex) => void;
  onSelect: (match: any) => void;
  allowRawInputSubmission: boolean;
};

const AutosuggestSearchField = (props: Props) => {
  const handleItemClick = (itemIndex: MatchIndex) => {
    props.onSelect(getMatchData(itemIndex));
  };

  const getMatchData = (itemIndex: MatchIndex) => {
    if (!itemIndex) return;
    const [groupIndex, matchIndex] = itemIndex;
    return props.matchGroups[groupIndex].matches[matchIndex].data;
  };

  const groupsOfMatches = props.matchGroups.map((group, index) => {
    const { highlightedItemIndex } = props;
    const [groupIndex, itemIndex] = highlightedItemIndex || [null, null];
    const isGroupWithHighlightedItem = index === groupIndex;

    return (
      <GroupOfMatches
        key={index}
        onItemHover={props.onItemHover}
        onItemClick={handleItemClick}
        groupIndex={index}
        highlightedItemIndex={isGroupWithHighlightedItem ? itemIndex : null}
        {...group}
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
