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

import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';
import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';
import { useGeneOverviewQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { useAppDispatch } from 'src/store';

import GenePublications from '../publications/GenePublications';
import MainAccordion from './MainAccordion';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import SearchIcon from 'static/icons/icon_search.svg';

import {
  openSidebarModal,
  SidebarModalView,
  SidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import styles from './GeneOverview.module.css';

const GeneOverview = () => {
  const { genomeId, geneId } = useGeneViewIds();
  const dispatch = useAppDispatch();

  const { trackExternalReferenceLinkClick } = useEntityViewerAnalytics();

  const { currentData, isFetching } = useGeneOverviewQuery(
    {
      geneId: geneId ?? '',
      genomeId: genomeId ?? ''
    },
    {
      skip: !genomeId || !geneId
    }
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!currentData?.gene) {
    return <div>No data to display</div>;
  }

  const { gene } = currentData;
  const {
    metadata: { name: geneNameMetadata, biotype: geneBiotype }
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

  const openSearch = () => {
    dispatch(openSidebarModal(SidebarModalView.SEARCH));
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
              className={styles.externalReference}
              to={geneNameMetadata.url}
              onClick={trackLink}
            >
              {geneNameMetadata.accession_id}
            </ExternalReference>
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

      <section>
        <div className={styles.sectionHead}>Attributes</div>
        <div className={styles.sectionContent}>
          <div className={styles.attributes}>
            <div className={styles.attributeRow}>
              <span className={styles.attributeLabel}>Biotype</span>{' '}
              <span className={styles.biotypeValue}>{geneBiotype.value}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionContent}>
          <div className={styles.findAGene} onClick={openSearch}>
            <span>Find a gene</span>
            <SearchIcon />
          </div>
        </div>
      </section>

      <MainAccordion />

      <GenePublications gene={gene} />
    </div>
  );
};

export default GeneOverview;
