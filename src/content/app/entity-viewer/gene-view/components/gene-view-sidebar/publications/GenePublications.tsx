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

import React from 'react';
import { useSelector } from 'react-redux';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { RootState } from 'src/store';

import geneOverviewStyles from '../overview/GeneOverview.scss';

type Props = {
  gene: {
    symbol: string | null;
  };
};

const GenePublications = (props: Props) => {
  const {
    gene: { symbol }
  } = props;
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId) || '';
  const species = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );

  if (!species || !symbol) {
    return null;
  }

  const linkToEuroPMC = buildLinkToEuroPMC(symbol, species);

  return (
    <section>
      <div className={geneOverviewStyles.sectionHead}>Publications</div>

      <div className={geneOverviewStyles.sectionContent}>
        <ExternalReference
          to={linkToEuroPMC}
          linkText="Europe PMC"
          classNames={{
            link: geneOverviewStyles.externalRefLink
          }}
        />
      </div>
    </section>
  );
};

const buildLinkToEuroPMC = (geneSymbol: string, species: CommittedItem) => {
  const { common_name, scientific_name } = species;
  const speciesSearchFragment = common_name
    ? `("${common_name}" OR "${scientific_name}")`
    : `"${scientific_name}"`;
  const query = encodeURIComponent(`${geneSymbol} ${speciesSearchFragment}`);
  const sortBy = encodeURIComponent('CITED+desc');

  return `https://europepmc.org/search?query=${query}&sortBy=${sortBy}`;
};

export default GenePublications;
