import React, { Component } from 'react';

import SpeciesSearchPanel from 'src/content/app/species-selector/containers/species-search-panel/SpeciesSearchPanel';
import PopularSpeciesPanel from 'src/content/app/species-selector/containers/popular-species-panel/PopularSpeciesPanel';

class SpeciesSelector extends Component {
  public render() {
    return (
      <>
        <SpeciesSearchPanel />
        <PopularSpeciesPanel />
      </>
    );
  }
}

export default SpeciesSelector;
