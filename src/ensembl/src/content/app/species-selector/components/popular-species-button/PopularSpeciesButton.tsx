import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import styles from './PopularSpeciesButton.scss';

type Props = {
  isSelected: boolean;
  species: string;
  onClick: () => void;
};

const PopularSpeciesButton: FunctionComponent<Props> = (props) => {
  const {
    ReactComponent: Icon
  } = require(`src/content/app/species-selector/assets/icons/${
    props.species
  }.svg`);
  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonActive]: props.isSelected
  });

  return (
    <div className={className}>
      <Icon />
    </div>
  );
};

export default PopularSpeciesButton;
