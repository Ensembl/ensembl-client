import React from 'react';

import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import styles from './SpeciesAutosuggestionPanel.scss';

import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

type Props = {
  matches: SearchMatch[];
  onMatchSelected: (match: SearchMatch) => void;
};

const SpeciesAutosuggestionPanel = (props: Props) => {
  const onMatchSelected = (match: SearchMatch) => () => {
    props.onMatchSelected(match);
  };

  const matches = props.matches.map((match) => (
    <SpeciesSearchMatch
      match={match}
      onClick={onMatchSelected(match)}
      key={match.description}
    />
  ));

  return <div className={styles.speciesAutosuggestionPanel}>{matches}</div>;
};

export default SpeciesAutosuggestionPanel;
