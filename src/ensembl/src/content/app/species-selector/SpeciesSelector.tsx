import React, { Component } from 'react';

import SpeciesSearchPanel from 'src/content/app/species-selector/containers/species-search-panel/SpeciesSearchPanel';
import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';

class SpeciesSelector extends Component {
  public render() {
    return (
      <>
        <SpeciesSelectorAppBar />
        <SpeciesSearchPanel />
      </>
    );
  }
}

export default SpeciesSelector;
