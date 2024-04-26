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

import { useSelector } from 'react-redux';

import { AppName as AppNameText } from 'src/global/globalConfig';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

type SpeciesAppBarProps = {
  onSpeciesSelect: (species: CommittedItem) => void;
};

const SpeciesAppBar = (props: SpeciesAppBarProps) => {
  const activeGenomeId = useSelector(getActiveGenomeId);
  const species = useSelector(getCommittedSpecies);

  const speciesTabs = species.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      isActive={species.genome_id === activeGenomeId}
      onClick={props.onSpeciesSelect}
    />
  ));

  const tabsSlider = <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>;

  return (
    <AppBar
      topLeft={<AppName>{AppNameText.SPECIES_SELECTOR}</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={tabsSlider}
      aside={<HelpPopupButton slug="species-homepage" />}
    />
  );
};

export default SpeciesAppBar;
