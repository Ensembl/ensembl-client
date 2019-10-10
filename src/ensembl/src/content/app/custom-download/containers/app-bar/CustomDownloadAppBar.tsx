import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import AppBar, {
  HelpAndDocumentation
} from 'src/shared/components/app-bar/AppBar';
import { FocusableSelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { getCustomDownloadActiveGenomeId } from '../../state/customDownloadSelectors';

type CustomDownloadAppBarProps = {
  species: CommittedItem[];
  activeGenomeId: string | null;
  onSpeciesSelect: (genomeId: string) => void;
};

const CustomDownloadAppBar = (props: CustomDownloadAppBarProps) => {
  const speciesTabs = props.species.map((species, index) => (
    <FocusableSelectedSpecies
      key={index}
      species={species}
      isActive={species.genome_id === props.activeGenomeId}
      onClick={() => props.onSpeciesSelect(species.genome_id)}
    />
  ));
  const speciesSelectorLink = <Link to={urlFor.speciesSelector()}>Change</Link>;
  const wrappedSpecies = (
    <SpeciesTabsWrapper
      isWrappable={false}
      speciesTabs={speciesTabs}
      link={speciesSelectorLink}
    />
  );

  return (
    <AppBar
      appName={AppName.CUSTOM_DOWNLOADS}
      mainContent={wrappedSpecies}
      aside={<HelpAndDocumentation />}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  species: getEnabledCommittedSpecies(state),
  activeGenomeId: getCustomDownloadActiveGenomeId(state)
});

export default connect(mapStateToProps)(CustomDownloadAppBar);
