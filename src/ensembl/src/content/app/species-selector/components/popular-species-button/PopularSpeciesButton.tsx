import React, { FunctionComponent } from 'react';

const PopularSpeciesButton: FunctionComponent<{}> = () => {
  const {
    ReactComponent: Icon
  } = require('src/content/app/species-selector/assets/icons/human.svg');

  return (
    <div>
      <Icon />
    </div>
  );
};

export default PopularSpeciesButton;
