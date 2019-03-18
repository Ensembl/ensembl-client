import React, { ReactNode } from 'react';

import styles from './AutosuggestSearchField.scss';

type MatchProps = {
  data: any;
  element: ReactNode;
};

type GroupOfMatchesProps = {
  title?: string;
  matches: MatchProps[];
};

type Props = {
  title?: string;
  highlightedItemIndex: [number, number]; // index of group and index of item within group
  matchGroups: GroupOfMatchesProps[];
  onHover: (match: any) => void;
  onClick: (match: any) => void;
};

const AutosuggestSearchField = (props: Props) => {
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
