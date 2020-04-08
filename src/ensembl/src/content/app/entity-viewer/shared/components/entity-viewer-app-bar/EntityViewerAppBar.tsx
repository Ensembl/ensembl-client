import React, { memo, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { changeActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralActions';

import AppBar from 'src/shared/components/app-bar/AppBar';
import AppBarHelp from 'src/content/app/help-and-docs/app-bar/AppBarHelp';

import { FocusableSelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type EntityViewerAppBarProps = {
  species: CommittedItem[];
  activeGenomeId: string | null;
  onSpeciesSelect: (genomeId: string) => void;
};

const EntityViewerAppBar = (props: EntityViewerAppBarProps) => {
  const speciesTabs = useMemo(() => {
    return props.species.map((species, index) => (
      <FocusableSelectedSpecies
        key={index}
        species={species}
        isActive={species.genome_id === props.activeGenomeId}
        onClick={() => props.onSpeciesSelect(species.genome_id)}
      />
    ));
  }, [props.species]);
  const speciesSelectorLink = useMemo(() => {
    return <Link to={urlFor.speciesSelector()}>Change</Link>;
  }, []);

  const wrappedSpecies = (
    <SpeciesTabsWrapper
      isWrappable={false}
      speciesTabs={speciesTabs}
      link={speciesSelectorLink}
    />
  );

  return (
    <AppBar
      appName={AppName.ENTITY_VIEWER}
      mainContent={wrappedSpecies}
      aside={<AppBarHelp />}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  species: getEnabledCommittedSpecies(state),
  activeGenomeId: getEntityViewerActiveGenomeId(state)
});

const mapDispatchToProps = {
  onSpeciesSelect: changeActiveGenomeId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(EntityViewerAppBar, isEqual));
