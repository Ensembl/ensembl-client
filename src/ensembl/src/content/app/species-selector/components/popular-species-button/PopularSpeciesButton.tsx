import React, { FunctionComponent } from 'react';

const PopularSpeciesButton: FunctionComponent<{}> = () => {
  const icon = require('src/content/app/species-selector/assets/icons/human.svg');

  return (
    <div>
      <img src={icon} />
    </div>
  );
};

export default PopularSpeciesButton;
