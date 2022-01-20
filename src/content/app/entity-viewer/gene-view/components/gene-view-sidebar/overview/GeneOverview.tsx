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

  const { data, isLoading } = useGeneOverviewQuery(
    {
      geneId: geneId || '',
      genomeId: genomeId as string
    },
    {
      skip: !geneId
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.gene) {
    return <div>No data to display</div>;
  }

  const { gene } = data;

  const trackLink = () => {
    if (!gene.metadata.name) {
      return;
    }

    trackExternalReferenceLinkClick({
      tabName: SidebarTabName.OVERVIEW,
      linkLabel: gene.metadata.name.accession_id
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
          {gene.metadata.name && (
            <ExternalReference
              classNames={{
                container: styles.externalRefContainer,
                link: styles.externalRefLink
              }}
              to={gene.metadata.name.url}
              linkText={gene.metadata.name.accession_id}
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