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
import { Link } from 'react-router-dom';

import * as urlHelper from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { CircleLoader } from 'src/shared/components/loader';

import styles from './ExampleLinks.scss';

// NOTE: the component currently handles only example gene
const ExampleLinks = () => {
  const { activeGenomeId, genomeIdForUrl } = useEntityViewerIds();
  const { currentData, isLoading } = useExampleObjectsForGenomeQuery(
    activeGenomeId ?? '',
    {
      skip: !activeGenomeId
    }
  );

  if (isLoading) {
    return (
      <div>
        <div className={styles.exampleLinks__emptyTopbar} />
        <div className={styles.exampleLinks}>
          <CircleLoader size="small" />
        </div>
      </div>
    );
  }

  const exampleGene = (currentData ?? []).find(({ type }) => {
    return type === 'gene';
  });
  if (!exampleGene) {
    return null;
  }

  const featureIdInUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: exampleGene.id
  });
  const path = urlHelper.entityViewer({
    genomeId: genomeIdForUrl,
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
