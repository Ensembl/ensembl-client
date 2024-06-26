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

import { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';
import { isProteinCodingGene } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { useGbGeneSummaryQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import {
  buildFocusIdForUrl,
  getDisplayStableId
} from 'src/shared/helpers/focusObjectHelpers';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import GeneSequenceView from 'src/content/app/genome-browser/components/drawer/components/sequence-view/GeneSequenceView';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import InstantDownloadGene, {
  type OnDownloadPayload
} from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import { Spinner } from 'src/content/app/genome-browser/components/drawer/DrawerSpinner';

import { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './GeneSummary.module.css';

const GeneSummary = () => {
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const focusGene = useSelector(getBrowserActiveFocusObject) as FocusGene;
  const [shouldShowDownload, showDownload] = useState(false);
  const { trackDrawerSequenceDownloaded } = useGenomeBrowserAnalytics();

  const geneQueryParams = {
    geneId: focusGene.stable_id,
    genomeId: focusGene.genome_id
  };
  const { currentData, isFetching } = useGbGeneSummaryQuery(geneQueryParams, {
    skip: !focusGene.stable_id
  });

  if (isFetching) {
    return <Spinner />;
  }

  if (!currentData?.gene) {
    return <div>No data available</div>;
  }

  const { gene } = currentData;
  const {
    metadata: { name: geneNameMetadata }
  } = gene;

  const stableId = getDisplayStableId(gene);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.unversioned_stable_id
  });
  const entityViewerUrl = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: focusId
  });

  const rowClasses = classNames(styles.row, styles.spaceAbove);

  const onDownloadSuccess = (params: OnDownloadPayload) => {
    const {
      options: { gene, transcript }
    } = params;

    const selectedOptions = Object.entries(gene)
      .filter(([, isSet]) => isSet)
      .map(([option]) => `gene-${option}`);

    Object.entries(transcript).forEach(([option, isSet]) => {
      if (isSet) {
        selectedOptions.push(`transcript-${option}`);
      }
    });

    trackDrawerSequenceDownloaded(selectedOptions.join(','));
  };

  const biotype_definition = gene.metadata.biotype.definition;
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div className={styles.featureDetails}>
            <div className={styles.featureDetail}>
              {gene.symbol && (
                <span className={styles.featureSymbol}>{gene.symbol}</span>
              )}
              <span className={styles.stableId}>{stableId}</span>
            </div>
            <div className={styles.featureDetail}>
              <span className={styles.labelWithPadding}>Biotype</span>
              <span>{gene.metadata.biotype.label}</span>
              {biotype_definition && (
                <div className={styles.questionButton}>
                  <QuestionButton helpText={biotype_definition} />
                </div>
              )}
            </div>
            {gene.slice.strand.code && (
              <div className={styles.featureDetail}>
                <span>{getStrandDisplayName(gene.slice.strand.code)}</span>
              </div>
            )}
            <div className={styles.featureDetail}>
              <span>{getFormattedLocation(focusGene.location)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(rowClasses, styles.downloadRow)}>
        <div className={styles.value}>
          <GeneSequenceView gene={gene} />
        </div>
      </div>
      <div className={classNames(rowClasses, styles.downloadRow)}>
        <div className={styles.value}>
          <ShowHide
            label="Download"
            isExpanded={shouldShowDownload}
            onClick={() => showDownload(!shouldShowDownload)}
          />
          {shouldShowDownload && (
            <div className={styles.downloadWrapper}>
              <InstantDownloadGene
                genomeId={focusGene.genome_id}
                gene={{
                  id: gene.stable_id,
                  isProteinCoding: isProteinCodingGene(gene)
                }}
                onDownloadSuccess={onDownloadSuccess}
              />
            </div>
          )}
        </div>
      </div>

      <div className={rowClasses}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.geneName}>
          {getGeneName(gene.name)}
          {geneNameMetadata?.accession_id && geneNameMetadata?.url && (
            <ExternalReference
              className={styles.marginTop}
              to={geneNameMetadata.url}
            >
              {geneNameMetadata.accession_id}
            </ExternalReference>
          )}
        </div>
      </div>

      {gene.alternative_symbols.length > 0 && (
        <div className={rowClasses}>
          <div className={styles.label}>Synonyms</div>
          <div className={styles.value}>
            {gene.alternative_symbols.join(', ')}
          </div>
        </div>
      )}

      <div className={rowClasses}>
        <div className={styles.value}>
          {gene.transcripts.length}{' '}
          {pluralise('transcript', gene.transcripts.length)}
        </div>
      </div>

      <div className={rowClasses}>
        <div className={styles.value}>
          <ViewInApp links={{ entityViewer: { url: entityViewerUrl } }} />
        </div>
      </div>
    </div>
  );
};

export default GeneSummary;
