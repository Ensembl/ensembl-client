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

// TODO: check if this can be moved to a common place
import {
  getNumberOfCodingExons,
  getProductAminoAcidLength,
  getSplicedRNALength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { EnsObjectGene } from 'src/shared/state/ens-object/ensObjectTypes';
import { Transcript as TranscriptFromGraphql } from 'src/content/app/entity-viewer/types/transcript';
import { Gene as GeneFromGraphql } from 'src/content/app/entity-viewer/types/gene';

import styles from './TranscriptSummary.scss';

type Transcript = Required<
  Pick<
    TranscriptFromGraphql,
    | 'stable_id'
    | 'symbol'
    | 'so_term'
    | 'slice'
    | 'spliced_exons'
    | 'product_generating_contexts'
  >
>;

type Gene = Required<Pick<GeneFromGraphql, 'stable_id' | 'symbol' | 'name'>>;

const GENE_AND_TRANSCRIPT_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!, $transcriptId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      name
      stable_id
      symbol
    }
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      so_term
      symbol
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
        cds {
          relative_start
          relative_end
        }
        cdna {
          length
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
          unversioned_stable_id
          length
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
          value
        }
        location {
          start
          end
          length
        }
      }
    }
  }
`;

const TranscriptSummary = () => {
  const ensObjectGene = useSelector(getBrowserActiveEnsObject) as EnsObjectGene;

  const transcriptTrack = ensObjectGene?.track?.child_tracks?.[0];

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

  const { product } = transcript.product_generating_contexts[0];
  const stableId = getDisplayStableId(transcript);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.stable_id as string
  });

  const entityViewerUrl = urlFor.entityViewer({
    genomeId: ensObjectGene.genome_id,
    entityId: focusId
  });

  // TODO: Wait for Jyo's PR #436 to be merged in
  const uniprotXref = product?.external_references.find(
    (xref) => xref.source.id == 'Uniprot/SWISSPROT'
  );

  const splicedRNALength = getCommaSeparatedNumber(
    getSplicedRNALength(transcript)
  );

  const productAminoAcidLength = getCommaSeparatedNumber(
    getProductAminoAcidLength(transcript)
  );

  return (
    <div className={styles.container}>
      <div className={styles.standardLabelValue}>
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

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Transcript name</div>
        <div className={styles.value}>{transcript.symbol}</div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Transcript length</div>
        <div className={styles.value}>{transcript.slice.location.length}</div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          {transcript.spliced_exons.length} exons
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Coding exons</div>
        <div className={styles.value}>{getNumberOfCodingExons(transcript)}</div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Combined exon length </div>
        <div className={styles.value}>
          {splicedRNALength} <span className={styles.unit}>bp</span>
        </div>
      </div>

      {transcript.so_term === 'protein_coding' && (
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Protein</div>
          <div className={styles.value}>
            <div>
              {productAminoAcidLength} <span className={styles.unit}>aa</span>
            </div>
            <div className={styles.greyedText}>{product.stable_id}</div>
            {uniprotXref && (
              <ExternalReference
                classNames={{ label: styles.greyedText }}
                label={'UniProtKB/Swiss-Prot'}
                to={uniprotXref.url}
                linkText={uniprotXref.accession_id}
              />
            )}
          </div>
        </div>
      )}

      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          <ViewInApp
            classNames={{ label: styles.greyedText }}
            links={{ entityViewer: entityViewerUrl }}
          />
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div>
            {gene.symbol && <span>{gene.symbol}</span>}
            {gene.symbol !== stableId && <span>{stableId}</span>}
          </div>
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.value}>{gene.name}</div>
      </div>
    </div>
  );
};

export default TranscriptSummary;
