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
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { changeActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralActions';

import AppBar, {
  HelpAndDocumentation
} from 'src/shared/components/app-bar/AppBar';
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
      aside={<HelpAndDocumentation />}
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
