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
import classNames from 'classnames';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  getDisplayStableId,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';
import {
  getNumberOfCodingExons,
  getSplicedRNALength,
  isProteinCodingTranscript
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/genomeBrowserApiSlice';
import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';

import { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullGene } from 'src/shared/types/thoas/gene';
import { TranscriptDrawerView } from 'src/content/app/genome-browser/state/drawer/types';

import styles from './TranscriptSummary.scss';

// TODO: narrow down the types for spliced exons and product-generating_contexts
type Transcript = Pick<
  FullTranscript,
  | 'stable_id'
  | 'unversioned_stable_id'
  | 'external_references'
  | 'slice'
  | 'spliced_exons'
  | 'product_generating_contexts'
  | 'metadata'
>;

// TODO: narrow down the type and use it in the Transcript type
type ProductGeneratingContext =
  Transcript['product_generating_contexts'][number];

type Gene = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol' | 'name' | 'transcripts'
>;

const GENE_AND_TRANSCRIPT_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!, $transcriptId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      name
      stable_id
      unversioned_stable_id
      symbol
    }
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      unversioned_stable_id
      external_references {
        accession_id
        url
        source {
          id
        }
      }
      spliced_exons {
        relative_location {
          start
          end
        }
        exon {
          stable_id
          slice {
            location {
              length
            }
          }
        }
      }
      product_generating_contexts {
        product_type
        default
        cds {
          protein_length
        }
        phased_exons {
          start_phase
          end_phase
          exon {
            stable_id
          }
        }
        product {
          stable_id
          external_references {
            accession_id
            url
            source {
              id
            }
          }
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
        canonical {
          value
          label
          definition
        }
        mane {
          value
          label
          definition
        }
      }
    }
  }
`;

type Props = {
  drawerView: TranscriptDrawerView;
};

const TranscriptSummary = (props: Props) => {
  const { transcriptId } = props.drawerView;
  const focusGene = useSelector(getBrowserActiveFocusObject) as FocusGene;
  const [shouldShowDownload, showDownload] = useState(false);

  const { data: geneData } = useGetTrackPanelGeneQuery({
    genomeId: focusGene.genome_id,
    geneId: focusGene.stable_id
  });

  // TODO: change this to a single transcript query
  const activeDrawerTranscript = geneData?.gene.transcripts.find(
    (transcript) => transcript.stable_id === transcriptId
  );

  const { data, loading } = useQuery<{
    gene: Gene;
    transcript: Transcript;
  }>(GENE_AND_TRANSCRIPT_QUERY, {
    variables: {
      geneId: focusGene.stable_id,
      transcriptId: activeDrawerTranscript?.stable_id,
      genomeId: focusGene.genome_id
    },
    skip: !activeDrawerTranscript?.stable_id
  });

  if (loading) {
    return null;
  }

  if (!data?.gene || !data.transcript) {
    return <div>No data available</div>;
  }

  const { gene, transcript } = data;
  const metadata = transcript.metadata;

  const defaultProductGeneratingContext =
    transcript.product_generating_contexts.find(
      (entry) => entry.default
    ) as ProductGeneratingContext;

  const product = defaultProductGeneratingContext.product;
  const stableId = getDisplayStableId(transcript);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.unversioned_stable_id
  });

  const entityViewerUrl = urlFor.entityViewer({
    genomeId: focusGene.genome_id,
    entityId: focusId
  });

  const uniprotXref = product?.external_references.find(
    (xref) => xref.source.id === 'Uniprot/SWISSPROT'
  );

  const ccdsXref = transcript.external_references.find(
    (xref) => xref.source.id === 'CCDS'
  );

  const splicedRNALength = getCommaSeparatedNumber(
    getSplicedRNALength(transcript)
  );

  const productAminoAcidLength = getCommaSeparatedNumber(
    defaultProductGeneratingContext?.cds?.protein_length || 0
  );

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.label}>Transcript</div>
        <div className={styles.value}>
          <div className={styles.featureDetails}>
            <div className={styles.featureDetail}>
              <span className={styles.featureSymbol}>{stableId}</span>
              <div className={styles.transcriptQuality}>
                <TranscriptQualityLabel metadata={metadata} />
              </div>
            </div>

            {metadata.biotype && (
              <div className={styles.featureDetail}>
                <span>{metadata.biotype.label}</span>
                <div className={styles.questionButton}>
                  <QuestionButton helpText={metadata.biotype.definition} />
                </div>
              </div>
            )}
            {transcript.slice.strand.code && (
              <div className={styles.featureDetail}>
                <span>
                  {getStrandDisplayName(transcript.slice.strand.code)}
                </span>
              </div>
            )}
            <div className={styles.featureDetail}>
              <span>{getFormattedLocation(focusGene.location)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.label}>Transcript length</div>
        <div className={styles.value}>
          {getCommaSeparatedNumber(transcript.slice.location.length)}{' '}
          <span className={styles.unit}>bp</span>{' '}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.value}>
          {transcript.spliced_exons.length} exons
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.label}>Coding exons</div>
        <div className={styles.value}>{getNumberOfCodingExons(transcript)}</div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Combined exon length </div>
        <div className={styles.value}>
          {splicedRNALength} <span className={styles.unit}>bp</span>
        </div>
      </div>

      {metadata.biotype.value === 'protein_coding' && (
        <div className={styles.row}>
          <div className={styles.label}>Protein</div>
          <div className={styles.value}>
            <div>
              {productAminoAcidLength} <span className={styles.unit}>aa</span>
            </div>
            {product && (
              <div className={styles.lightText}>{product.stable_id}</div>
            )}
            {uniprotXref && (
              <ExternalReference
                label={'UniProtKB/Swiss-Prot'}
                to={uniprotXref.url}
                linkText={uniprotXref.accession_id}
              />
            )}
          </div>
        </div>
      )}

      {ccdsXref && (
        <div className={`${styles.row} ${styles.spaceAbove}`}>
          <div className={styles.value}>
            <ExternalReference
              classNames={{ label: styles.lightText }}
              label={'CCDS'}
              to={ccdsXref.url}
              linkText={ccdsXref.accession_id}
            />
          </div>
        </div>
      )}

      <div
        className={classNames(
          styles.row,
          styles.spaceAbove,
          styles.downloadRow
        )}
      >
        <div className={styles.value}>
          <ShowHide
            label="Download"
            isExpanded={shouldShowDownload}
            onClick={() => showDownload(!shouldShowDownload)}
          />
          {shouldShowDownload && (
            <div className={styles.downloadWrapper}>
              <InstantDownloadTranscript
                genomeId={focusGene.genome_id}
                transcript={{
                  id: transcript.stable_id,
                  isProteinCoding: isProteinCodingTranscript(transcript)
                }}
                gene={{ id: gene.stable_id }}
                theme="light"
                layout="vertical"
              />
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div>
            {gene.symbol && (
              <span className={styles.geneSymbol}>{gene.symbol}</span>
            )}
            {gene.symbol !== stableId && <span>{gene.stable_id}</span>}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Gene name</div>
        <div className={`${styles.value} ${styles.geneName}`}>
          {getGeneName(gene.name)}
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.value}>
          <ViewInApp
            classNames={{ label: styles.viewInAppLabel }}
            links={{ entityViewer: { url: entityViewerUrl } }}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptSummary;