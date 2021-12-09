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
import { gql, useQuery } from '@apollo/client';
import { Pick3 } from 'ts-multipick';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';
import { isProteinCodingGene } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import {
  buildFocusIdForUrl,
  getDisplayStableId
} from 'src/shared/helpers/focusObjectHelpers';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import InstantDownloadGene from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { FocusObjectGene } from 'src/content/app/genome-browser/state/focus-object/focusObjectTypes';
import { FullGene } from 'src/shared/types/thoas/gene';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';

import styles from './GeneSummary.scss';

const GENE_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      unversioned_stable_id
      symbol
      transcripts {
        stable_id
        product_generating_contexts {
          product_type
        }
      }
      slice {
        strand {
          code
        }
        location {
          length
        }
      }
      metadata {
        biotype {
          label
          value
          definition
        }
        name {
          accession_id
          url
        }
      }
    }
  }
`;

type Transcript = Pick<FullTranscript, 'stable_id'> & {
  product_generating_contexts: Pick<
    FullProductGeneratingContext,
    'product_type'
  >[];
};

type Gene = Pick<
  FullGene,
  | 'stable_id'
  | 'unversioned_stable_id'
  | 'symbol'
  | 'name'
  | 'alternative_symbols'
  | 'metadata'
> &
  Pick3<FullGene, 'slice', 'strand', 'code'> &
  Pick3<FullGene, 'slice', 'location', 'length'> & {
    transcripts: Transcript[];
  };

const GeneSummary = () => {
  const focusObjectGene = useSelector(
    getBrowserActiveFocusObject
  ) as FocusObjectGene;
  const [shouldShowDownload, showDownload] = useState(false);
  const { data, loading } = useQuery<{ gene: Gene }>(GENE_QUERY, {
    variables: {
      geneId: focusObjectGene.stable_id,
      genomeId: focusObjectGene.genome_id
    },
    skip: !focusObjectGene.stable_id
  });

  if (loading || !data?.gene) {
    return null;
  }

  if (!data?.gene) {
    return <div>No data available</div>;
  }

  const { gene } = data;

  const stableId = getDisplayStableId(gene);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.unversioned_stable_id
  });
  const entityViewerUrl = urlFor.entityViewer({
    genomeId: focusObjectGene.genome_id,
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
              <span>{getFormattedLocation(focusObjectGene.location)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={rowClasses}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.geneName}>
          {getGeneName(gene.name)}
          {gene.metadata.name && (
            <ExternalReference
              classNames={{ container: styles.marginTop }}
              to={gene.metadata.name.url}
              linkText={gene.metadata.name.accession_id}
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
                genomeId={focusObjectGene.genome_id}
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
