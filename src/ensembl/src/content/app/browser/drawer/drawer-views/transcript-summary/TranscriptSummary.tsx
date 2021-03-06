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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import {
  getDisplayStableId,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';
import { getBrowserActiveEnsObject } from 'src/content/app/browser/browserSelectors';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';

// TODO: check if this can be moved to a common place
import {
  getNumberOfCodingExons,
  getSplicedRNALength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import { EnsObjectGene } from 'src/shared/state/ens-object/ensObjectTypes';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullGene } from 'src/shared/types/thoas/gene';

import styles from './TranscriptSummary.scss';

// TODO: narrow down the types for spliced exons and product-generating_contexts
type Transcript = Pick<
  FullTranscript,
  | 'stable_id'
  | 'unversioned_stable_id'
  | 'so_term'
  | 'external_references'
  | 'slice'
  | 'spliced_exons'
  | 'product_generating_contexts'
>;

// TODO: narrow down the type and use it in the Transcript type
type ProductGeneratingContext = Transcript['product_generating_contexts'][number];

type Gene = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol' | 'name'
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
      so_term
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
    }
  }
`;

const TranscriptSummary = () => {
  const ensObjectGene = useSelector(getBrowserActiveEnsObject) as EnsObjectGene;

  const transcriptTrack = ensObjectGene?.track?.child_tracks?.[0];

  const [shouldShowDownload, showDownload] = useState(false);

  const { data, loading } = useQuery<{
    gene: Gene;
    transcript: Transcript;
  }>(GENE_AND_TRANSCRIPT_QUERY, {
    variables: {
      geneId: ensObjectGene.stable_id,
      transcriptId: transcriptTrack?.stable_id,
      genomeId: ensObjectGene.genome_id
    },
    skip: !transcriptTrack?.stable_id
  });

  if (loading) {
    return null;
  }

  if (!data?.gene || !data.transcript) {
    return <div>No data available</div>;
  }

  const { gene, transcript } = data;
  const defaultProductGeneratingContext = transcript.product_generating_contexts.find(
    (entry) => entry.default
  ) as ProductGeneratingContext;

  const product = defaultProductGeneratingContext.product;
  const stableId = getDisplayStableId(transcript);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.unversioned_stable_id
  });

  const entityViewerUrl = urlFor.entityViewer({
    genomeId: ensObjectGene.genome_id,
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
            <span className={styles.featureSymbol}>{stableId}</span>
            {transcript.so_term && (
              <span>{transcript.so_term.toLowerCase()}</span>
            )}
            {transcript.slice.strand.code && (
              <span>{getStrandDisplayName(transcript.slice.strand.code)}</span>
            )}
            <span>{getFormattedLocation(ensObjectGene.location)}</span>
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

      {transcript.so_term === 'protein_coding' && (
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
                classNames={{ label: styles.lightText }}
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

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.value}>
          <span
            className={styles.downloadLink}
            onClick={() => showDownload(!shouldShowDownload)}
          >
            Download
          </span>
          {shouldShowDownload && (
            <div className={styles.downloadWrapper}>
              <InstantDownloadTranscript
                genomeId={ensObjectGene.genome_id}
                transcript={{
                  id: transcript.unversioned_stable_id,
                  so_term: transcript.so_term
                }}
                gene={{ id: gene.unversioned_stable_id }}
                theme="light"
              />
              <CloseButton
                className={styles.closeButton}
                onClick={() => showDownload(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div>
            {gene.symbol && <span className={styles.geneSymbol}>{gene.symbol}</span>}
            {gene.symbol !== stableId && <span>{gene.stable_id}</span>}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.value}>{getGeneName(gene.name)}</div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.value}>
          <ViewInApp
            classNames={{ label: styles.lightText }}
            links={{ entityViewer: { url: entityViewerUrl } }}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptSummary;
