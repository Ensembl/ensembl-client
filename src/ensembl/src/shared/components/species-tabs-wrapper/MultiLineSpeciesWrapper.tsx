import React, { ReactElement } from 'react';

import { nonBreakingSpace } from 'src/shared/constants/strings';

import styles from './MultiLineSpeciesWrapper.scss';

import { Props as SimpleSelectedSpeciesProps } from 'src/shared/components/selected-species/SimpleSelectedSpecies';
import { Props as SpeciesSelectorSelectedSpeciesProps } from 'src/content/app/species-selector/components/selected-species/SelectedSpecies';

type MultiLineSelectedSpeciesProps =
  | SimpleSelectedSpeciesProps
  | SpeciesSelectorSelectedSpeciesProps;

export type Props = {
  isWrappable: true;
  speciesTabs: ReactElement<MultiLineSelectedSpeciesProps>[];
  link?: React.ReactNode;
};

const MultiLineWrapper = (props: Props) => {
  return (
    <div>
      {props.speciesTabs}
      {nonBreakingSpace}
      {props.link && <span className={styles.linkWrapper}>{props.link}</span>}
    </div>
  );
};

export default MultiLineWrapper;
