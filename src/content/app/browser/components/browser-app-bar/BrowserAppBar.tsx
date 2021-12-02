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

import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';

import { getBrowserActiveGenomeId } from 'src/content/app/browser/state/browserSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { HelpPopupButton } from 'src/shared/components/help-popup';

type BrowserAppBarProps = {
  onSpeciesSelect: (genomeId: string) => void;
};

const BrowserAppBar = (props: BrowserAppBarProps) => {
  const species = useSelector(getEnabledCommittedSpecies);
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);

  const speciesTabs = useMemo(() => {
    return species.map((species, index) => (
      <SelectedSpecies
        key={index}
        species={species}
        isActive={species.genome_id === activeGenomeId}
        onClick={() => props.onSpeciesSelect(species.genome_id)}
      />
    ));
  }, [species.length, activeGenomeId]);

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

  const mainContent = activeGenomeId
    ? wrappedSpecies
    : 'To start using this app...';

  return (
    <AppBar
      appName={AppName.GENOME_BROWSER}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="genome-browser" />}
    />
  );
};

export default memo(BrowserAppBar, isEqual);
