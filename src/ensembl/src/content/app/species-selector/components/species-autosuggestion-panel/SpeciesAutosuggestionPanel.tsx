import React from 'react';

import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import styles from './SpeciesAutosuggestionPanel.scss';

import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

type Props = {
  matches: SearchMatches;
};

const SpeciesAutosuggestionPanel = (props: Props) => {
  const matches = props.matches.map((match) => (
    <SpeciesSearchMatch match={match} key={match.description} />
  ));

  return <div className={styles.speciesAutosuggestionPanel}>{matches}</div>;
};

export default SpeciesAutosuggestionPanel;
