import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  toggleSpeciesUseAndSave,
  deleteSpeciesAndSave
} from 'src/content/app/species-selector/state/speciesSelectorActions';
import * as urlFor from 'src/shared/helpers/urlHelper';

import AppBar from 'src/shared/components/app-bar/AppBar';
import AppBarHelp from 'src/content/app/help-and-docs/app-bar/AppBarHelp';
import SelectedSpecies from 'src/content/app/species-selector/components/selected-species/SelectedSpecies';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSelectorAppBar.scss';

type Props = {
  selectedSpecies: CommittedItem[];
  toggleSpeciesUse: (genomeId: string) => void;
  onSpeciesDelete: (genomeId: string) => void;
};

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>
    Search for a species, select from popular species or browse species by data
    to manage your favourites
  </div>
);

export const SpeciesSelectorAppBar = (props: Props) => {
  const mainContent =
    props.selectedSpecies.length > 0 ? (
      <SelectedSpeciesList {...props} />
    ) : (
      <PlaceholderMessage />
    );

  return (
    <AppBar
      appName="Species Selector"
      mainContent={mainContent}
      aside={<AppBarHelp />}
    />
  );
};

const SelectedSpeciesList = (props: Props) => {
  const shouldLinkToGenomeBrowser =
    props.selectedSpecies.filter(({ isEnabled }) => isEnabled).length > 0;

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onToggleUse={props.toggleSpeciesUse}
      onRemove={props.onSpeciesDelete}
    />
  ));

  const link = shouldLinkToGenomeBrowser ? (
    <Link to={urlFor.browser()}>View in Genome Browser</Link>
  ) : null;

  return <SpeciesTabsWrapper speciesTabs={selectedSpecies} link={link} />;
};

const mapStateToProps = (state: RootState) => ({
  selectedSpecies: getCommittedSpecies(state)
});

const mapDispatchToProps = {
  toggleSpeciesUse: toggleSpeciesUseAndSave,
  onSpeciesDelete: deleteSpeciesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSelectorAppBar);
