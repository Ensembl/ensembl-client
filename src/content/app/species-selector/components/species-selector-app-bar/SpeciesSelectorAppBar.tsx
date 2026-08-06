/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useGenomeRemoval from 'src/content/app/species-selector/hooks/useGenomeRemoval';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesSelectorAppBar.module.css';

export const placeholderMessage =
  'Find and add your favourite genomes to use them across the site';

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>{placeholderMessage}</div>
);

export const SpeciesSelectorAppBar = () => {
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);
  const hasEnabledSpecies = enabledCommittedSpecies.length > 0;

  const mainContent = useMemo(() => {
    return hasEnabledSpecies ? <AppBarMainContent /> : <PlaceholderMessage />;
  }, [hasEnabledSpecies]);

  return (
    <AppBar
      topLeft={<AppName>Genome selector</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="genome-selector-intro" />}
    />
  );
};

const AppBarMainContent = () => {
  return (
    <div className={styles.grid}>
      <SelectedGenomes />
      <div className={styles.aside}>
        <span className={styles.selectTabMessage}>
          Select a tab to see a Genome home page
        </span>
      </div>
    </div>
  );
};

export const SelectedGenomes = () => {
  const enabledCommittedGenomes = useAppSelector(getEnabledCommittedSpecies);
  const navigate = useNavigate();
  const { removeGenome } = useGenomeRemoval();

  const openGenomePage = (genome: CommittedItem) => {
    const genomeIdForUrl = genome.genome_tag ?? genome.genome_id;
    const genomePageUrl = urlFor.speciesPage({
      genomeId: genomeIdForUrl
    });

    navigate(genomePageUrl);
  };

  const selectedGenomes = enabledCommittedGenomes.map((genome) => (
    <SelectedSpecies
      key={genome.genome_id}
      species={genome}
      onClick={() => openGenomePage(genome)}
      onRemove={removeGenome}
    />
  ));

  return <SpeciesTabsSlider>{selectedGenomes}</SpeciesTabsSlider>;
};

export default SpeciesSelectorAppBar;
