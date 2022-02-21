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
import { useParams } from 'react-router-dom';

import { parseFocusObjectIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';
import { useGeneOverviewQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import GenePublications from '../publications/GenePublications';
import MainAccordion from './MainAccordion';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import styles from './GeneOverview.scss';

const GeneOverview = () => {
  const { entityId, genomeId } = useParams<'genomeId' | 'entityId'>();
  const geneId = entityId ? parseFocusObjectIdFromUrl(entityId).objectId : null;

  const { trackExternalReferenceLinkClick } = useEntityViewerAnalytics();

  const { currentData, isFetching } = useGeneOverviewQuery(
    {
      geneId: geneId || '',
      genomeId: genomeId as string
    },
    {
      skip: !geneId
    }
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!currentData || !currentData.gene) {
    return <div>No data to display</div>;
  }

  const { gene } = currentData;
  const {
    metadata: { name: geneNameMetadata }
  } = gene;

  const trackLink = () => {
    if (!geneNameMetadata?.accession_id) {
      return;
    }

    trackExternalReferenceLinkClick({
      tabName: SidebarTabName.OVERVIEW,
      linkLabel: geneNameMetadata.accession_id
    });
  };

  return (
    <div className={styles.overviewContainer}>
      <section>
        <div className={styles.sectionContent}>
          {!!gene.symbol && (
            <span className={styles.geneSymbol}>{gene.symbol}</span>
          )}
          <span data-test-id="stableId">{gene.stable_id}</span>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>Gene name</div>
        <div className={styles.sectionContent}>
          <div className={styles.geneName}>{getGeneName(gene.name)}</div>
          {geneNameMetadata?.accession_id && geneNameMetadata?.url && (
            <ExternalReference
              classNames={{
                container: styles.externalRefContainer,
                link: styles.externalRefLink
              }}
              to={geneNameMetadata.url}
              linkText={geneNameMetadata.accession_id}
              onClick={trackLink}
            />
          )}
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>Synonyms</div>
        <div className={styles.sectionContent}>
          <div className={styles.synonyms}>
            {gene.alternative_symbols.length
              ? gene.alternative_symbols.join(', ')
              : 'None'}
          </div>
        </div>
      </section>

      <MainAccordion />

      <GenePublications gene={gene} />
    </div>
  );
};

export default GeneOverview;
