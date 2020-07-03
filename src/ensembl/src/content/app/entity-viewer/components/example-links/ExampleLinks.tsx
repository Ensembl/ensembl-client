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
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import * as urlHelper from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { RootState } from 'src/store';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import styles from './ExampleLinks.scss';

type ExampleGene = {
  id: string;
  symbol: string;
};

type ExampleLinksProps = {
  activeGenomeId: string | null;
  exampleEntities: ExampleFocusObject[];
};

const QUERY = gql`
  query Gene($id: String!) {
    gene(byId: { id: $id }) {
      id
      symbol
    }
  }
`;

// NOTE: the component currently handles only example gene
const ExampleLinks = (props: ExampleLinksProps) => {
  const exampleGeneId = props.exampleEntities.find(
    ({ type }) => type === 'gene'
  )?.id;
  const { loading, data, error } = useQuery<{ gene: ExampleGene }>(QUERY, {
    variables: { id: exampleGeneId },
    skip: !exampleGeneId
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
    objectId: data.gene.id
  });
  const path = urlHelper.entityViewer({
    genomeId: props.activeGenomeId,
    entityId: featureIdInUrl
  });

  return (
    <div>
      <div className={styles.exampleLinks__emptyTopbar} />
      <div className={styles.exampleLinks}>
        <Link to={path}>
          <span className={styles.exampleLinks__label}>Gene</span>
          <span>{data.gene.symbol}</span>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const exampleEntities = activeGenomeId
    ? getGenomeExampleFocusObjects(state, activeGenomeId)
    : [];
  return {
    activeGenomeId,
    exampleEntities
  };
};

export default connect(mapStateToProps)(ExampleLinks);
