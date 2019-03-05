import React from 'react';

import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchMatch.scss';

type Props = {
  match: SearchMatch;
};

const SpeciesSearchMatch = ({ match }: Props) => {
  return <div className={styles.speciesSearchMatch}>{match.description}</div>;
};

export default SpeciesSearchMatch;
