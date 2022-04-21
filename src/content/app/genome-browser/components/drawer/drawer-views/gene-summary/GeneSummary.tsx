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

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';
import { isProteinCodingGene } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { useGbGeneSummaryQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import {
  buildFocusIdForUrl,
  getDisplayStableId
} from 'src/shared/helpers/focusObjectHelpers';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import GeneSequenceView from 'src/content/app/genome-browser/components/drawer/components/sequence-view/GeneSequenceView';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import InstantDownloadGene from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './GeneSummary.scss';

const GeneSummary = () => {
  const focusGene = useSelector(getBrowserActiveFocusObject) as FocusGene;
  const [shouldShowDownload, showDownload] = useState(false);

  const geneQueryParams = {
    geneId: focusGene.stable_id,
    genomeId: focusGene.genome_id
  };
  const { currentData, isFetching } = useGbGeneSummaryQuery(geneQueryParams, {
    skip: !focusGene.stable_id
  });

  if (isFetching) {
    return null;
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
    genomeId: focusGene.genome_id,
    entityId: focusId
  });

  const rowClasses = classNames(styles.row, styles.spaceAbove);

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
              <span>{gene.metadata.biotype.label}</span>
              <div className={styles.questionButton}>
                <QuestionButton helpText={gene.metadata.biotype.definition} />
              </div>
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

      {isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) && (
        <div className={classNames(rowClasses, styles.downloadRow)}>
          <div className={styles.value}>
            <GeneSequenceView gene={gene} />
          </div>
        </div>
      )}

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
              classNames={{ container: styles.marginTop }}
              to={geneNameMetadata.url}
              linkText={geneNameMetadata.accession_id}
            />
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
          <ViewInApp
            links={{ entityViewer: { url: entityViewerUrl } }}
            classNames={{ label: styles.viewInAppLabel }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneSummary;
