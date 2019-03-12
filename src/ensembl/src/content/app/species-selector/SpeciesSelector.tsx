import React, { Component } from 'react';

import SpeciesSearchPanel from 'src/content/app/species-selector/containers/species-search-panel/SpeciesSearchPanel';

// TODO:
// - AppBar should belong to a particular app (e.g. to Species Selector)

class SpeciesSelector extends Component {
  public render() {
    return <SpeciesSearchPanel />;
  }
}

export default SpeciesSelector;
