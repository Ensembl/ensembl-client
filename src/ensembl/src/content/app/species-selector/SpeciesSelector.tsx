import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setActiveComponentId } from 'src/content/app/help-and-docs/state/helpAndDocsActions';
import SpeciesSearchPanel from 'src/content/app/species-selector/containers/species-search-panel/SpeciesSearchPanel';
import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import PopularSpeciesPanel from 'src/content/app/species-selector/containers/popular-species-panel/PopularSpeciesPanel';

type Props = {
  setActiveComponentId: (componentId: string | null) => void;
};

const SpeciesSelector = (props: Props) => {
  useEffect(() => {
    props.setActiveComponentId('app-species-selector');

    return () => props.setActiveComponentId(null);
  }, []);

  return (
    <>
      <SpeciesSelectorAppBar />
      <SpeciesSearchPanel />
      <PopularSpeciesPanel />
    </>
  );
};

const mapDispatchToProps = {
  setActiveComponentId
};

export default connect(null, mapDispatchToProps)(SpeciesSelector);
