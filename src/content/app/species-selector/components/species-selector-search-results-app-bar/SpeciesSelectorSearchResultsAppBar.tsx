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

import { useAppSelector } from 'src/store';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';
import { PlaceholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';

const SpeciesSearchResultsAppBar = () => {
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);

  const mainContent = enabledCommittedSpecies.length ? (
    <SpeciesTabsSlider>
      {enabledCommittedSpecies.map((species) => (
        <SelectedSpecies
          key={species.genome_id}
          species={species}
          disabled={true}
        />
      ))}
    </SpeciesTabsSlider>
  ) : (
    <PlaceholderMessage />
  );

  return (
    <AppBar
      topLeft={<AppName>Species Selector</AppName>}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

export default SpeciesSearchResultsAppBar;
