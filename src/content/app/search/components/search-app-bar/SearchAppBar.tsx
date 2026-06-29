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

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useGenomeRemoval from 'src/content/app/species-selector/hooks/useGenomeRemoval';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import { PlaceholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';

const SearchAppBar = () => {
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);
  const navigate = useNavigate();
  const { removeGenome } = useGenomeRemoval();

  const showSpeciesPage = (genomeId: string, genomeTag?: string) => {
    navigate(
      urlFor.speciesPage({
        genomeId: genomeTag ?? genomeId
      })
    );
  };

  const mainContent = enabledCommittedSpecies.length ? (
    <SpeciesTabsSlider>
      {enabledCommittedSpecies.map((species) => (
        <SelectedSpecies
          key={species.genome_id}
          species={species}
          onClick={() =>
            showSpeciesPage(species.genome_id, species.genome_tag ?? undefined)
          }
          onRemove={removeGenome}
        />
      ))}
    </SpeciesTabsSlider>
  ) : (
    <PlaceholderMessage />
  );

  return (
    <AppBar
      topLeft={<AppName>Search</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
    />
  );
};

export default SearchAppBar;
