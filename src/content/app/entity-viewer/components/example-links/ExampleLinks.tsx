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
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import * as urlHelper from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';

import { CircleLoader } from 'src/shared/components/loader';

import { RootState } from 'src/store';

import styles from './ExampleLinks.scss';

type ExampleGene = {
  unversioned_stable_id: string;
  symbol: string;
};

const QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      unversioned_stable_id
      symbol
    }
  }
`;

// NOTE: the component currently handles only example gene
const ExampleLinks = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);
  const exampleEntities = useSelector((state: RootState) =>
    getGenomeExampleFocusObjects(state, activeGenomeId || '')
  );
  const exampleGeneId = exampleEntities.find(({ type }) => type === 'gene')?.id;
  const { loading, data, error } = useQuery<{ gene: ExampleGene }>(QUERY, {
    variables: { geneId: exampleGeneId, genomeId: activeGenomeId },
    skip: !exampleGeneId || !activeGenomeId
  });

  if (loading) {
    return (
      <div>
        <div className={styles.exampleLinks__emptyTopbar} />
        <div className={styles.exampleLinks}>
          <CircleLoader />
        </div>
      </div>
    );
  }

  // TODO: Data doesn't get changed when there is an error?
  if (!data || error) {
    return null;
  }

  const featureIdInUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: data.gene.unversioned_stable_id
  });
  const path = urlHelper.entityViewer({
    genomeId: activeGenomeId,
    entityId: featureIdInUrl
  });

  return (
    <div>
      <div className={styles.exampleLinks}>
        <Link to={path}>Example gene</Link>
      </div>
    </div>
  );
};

export default ExampleLinks;
