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

import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { AppName as AppNameText } from 'src/global/globalConfig';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

type BrowserAppBarProps = {
  onSpeciesSelect: (genomeId: string) => void;
};

const BrowserAppBar = (props: BrowserAppBarProps) => {
  const enabledCommittedSpecies = useSelector(getEnabledCommittedSpecies);
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);

  const { trackGenomeChanged } = useGenomeBrowserAnalytics();

  const onSpeciesSelect = (species: CommittedItem) => {
    props.onSpeciesSelect(species.genome_id);

    trackGenomeChanged();
  };

  const speciesTabs = useMemo(() => {
    return enabledCommittedSpecies.map((species, index) => (
      <SelectedSpecies
        key={index}
        species={species}
        isActive={species.genome_id === activeGenomeId}
        onClick={() => onSpeciesSelect(species)}
      />
    ));
  }, [enabledCommittedSpecies.length, activeGenomeId]);

  const tabsSlider = <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>;

  const mainContent = enabledCommittedSpecies.length
    ? tabsSlider
    : 'To start using this app...';

  return (
    <AppBar
      topLeft={<AppName>{AppNameText.GENOME_BROWSER}</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="genome-browser" />}
    />
  );
};

export default memo(BrowserAppBar, isEqual);
