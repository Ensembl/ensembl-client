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

import { useNavigate } from 'react-router';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { latestRoutesMap } from 'src/content/app/sequence-viewer/utils/latestRoutes';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import useGenomeRemoval from 'src/content/app/species-selector/hooks/useGenomeRemoval';
import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import { PlaceholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const SequenceViewerAppBar = () => {
  const { genomeId } = useSequenceViewerIds();
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);
  const { removeGenome } = useGenomeRemoval();
  const navigate = useNavigate();

  const onSpeciesClick = (genome: CommittedItem) => {
    const savedUrl = latestRoutesMap.genomeUrls[genome.genome_id];
    if (savedUrl) {
      navigate(savedUrl);
    } else {
      const genomeIdForUrl = genome.genome_tag ?? genome.genome_id;
      const url = urlFor.sequenceViewer({
        genomeId: genomeIdForUrl
      });
      navigate(url);
    }
  };

  const mainContent = enabledCommittedSpecies.length ? (
    <SpeciesTabsSlider>
      {enabledCommittedSpecies.map((genome) => (
        <SelectedSpecies
          key={genome.genome_id}
          species={genome}
          isActive={genome.genome_id === genomeId}
          onClick={() => onSpeciesClick(genome)}
          onRemove={removeGenome}
        />
      ))}
    </SpeciesTabsSlider>
  ) : (
    <PlaceholderMessage />
  );

  return (
    <AppBar
      topLeft={<AppName>Sequence viewer</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
    />
  );
};

export default SequenceViewerAppBar;
