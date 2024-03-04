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

import { GraphQLClient } from 'graphql-request';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';
import { getExonRelativeLocationInGene } from './genomicSequenceHelpers';

import {
  geneAndTranscriptsQuery,
  transcriptAndGeneQuery,
  type GeneAndTranscriptsResponse,
  type TranscriptAndGeneResponse,
  type TranscriptInResponse
} from './queries/geneAndTranscriptsQuery';

import type {
  GeneDownloadOptions,
  TranscriptDownloadOptions
} from './featureSequenceDownload.worker';

type SequenceDownloadOptions = Pick<
  GeneDownloadOptions,
  'geneSequenceTypes' | 'transcriptSequenceTypes'
>;

/**
 * - Fetch gene and transcripts metadata
 * - Find if genomic sequences have been requested. If yes:
 *  - fetch the sequence of the gene
 *  - create a reverse complement if needed
 * - Iterate in the following order:
 *   - Gene genomic
 *   - Exons gene
 *   - Transcripts
 *      - Transcript genomic
 *      - Transcript cDNA
 *      - Transcript CDS
 *      - Transcript exons, genomic sequence
 *      - Transcript protein
 */

/**
 * Download sequences for one gene, and all of its transcripts
 */
export async function* geneAndTranscriptsSequences(
  params: GeneDownloadOptions
) {
  const { genomeId, geneId, geneSequenceTypes, transcriptSequenceTypes } =
    params;
  const metadata = await fetchGeneAndTranscriptsMetadata({ genomeId, geneId });
  const strand = metadata.gene.slice.strand.code;

  let geneSequence = '';

  if (needsGenomicSequence(params)) {
    const regionChecksum = metadata.gene.slice.region.sequence.checksum;
    const geneStart = metadata.gene.slice.location.start;
    const geneEnd = metadata.gene.slice.location.end;

    const refgetUrl = urlFor.refget({
      checksum: regionChecksum,
      start: geneStart, // refget is 0-based, end-exclusive
      end: geneEnd
    });

    geneSequence = await fetch(refgetUrl).then((response) => response.text());
    if (strand === 'reverse') {
      geneSequence = getReverseComplement(geneSequence);
    }
  }

  if (geneSequenceTypes?.genomic) {
    yield {
      label: `${geneId} genomic`,
      sequence: geneSequence
    };
  }
  if (geneSequenceTypes?.exons) {
    for (const transcript of metadata.gene.transcripts) {
      for (const splicedExon of transcript.spliced_exons) {
        const exonSequence = getExonSequence({
          geneSequence,
          transcript_relative_location: transcript.relative_location,
          exon_relative_location: splicedExon.relative_location
        });
        const exonLabel = buildExonLabel({
          splicedExon,
          geneId: metadata.gene.stable_id,
          transcriptId: transcript.stable_id,
          exonsCount: transcript.spliced_exons.length
        });

        yield {
          label: exonLabel,
          sequence: exonSequence
        };
      }
    }
  }

  for (const transcript of metadata.gene.transcripts) {
    const productGeneratingContext = transcript.product_generating_contexts[0];

    if (transcriptSequenceTypes?.genomic) {
      const transcriptSequence = getTranscriptSequence({
        geneSequence,
        transcript_relative_location: transcript.relative_location
      });
      yield {
        label: `${transcript.stable_id} genomic`,
        sequence: transcriptSequence
      };
    }

    if (transcriptSequenceTypes?.exons) {
      for (const splicedExon of transcript.spliced_exons) {
        const exonSequence = getExonSequence({
          geneSequence,
          transcript_relative_location: transcript.relative_location,
          exon_relative_location: splicedExon.relative_location
        });
        const exonLabel = buildExonLabel({
          splicedExon,
          transcriptId: transcript.stable_id,
          exonsCount: transcript.spliced_exons.length
        });

        yield {
          label: exonLabel,
          sequence: exonSequence
        };
      }
    }

    if (transcriptSequenceTypes?.cdna) {
      const sequenceChecksum = productGeneratingContext.cdna.sequence.checksum;
      const url = urlFor.refget({ checksum: sequenceChecksum });
      const sequence = await fetch(url).then((response) => response.text());
      yield {
        label: `${transcript.stable_id} cdna`,
        sequence
      };
    }

    if (transcriptSequenceTypes?.cds) {
      const sequenceChecksum = productGeneratingContext.cds?.sequence.checksum;
      if (sequenceChecksum) {
        const url = urlFor.refget({ checksum: sequenceChecksum });
        const sequence = await fetch(url).then((response) => response.text());
        yield {
          label: `${transcript.stable_id} cds`,
          sequence
        };
      }
    }

    if (transcriptSequenceTypes?.protein) {
      const product = productGeneratingContext.product;
      if (product) {
        const sequenceChecksum = product.sequence.checksum;
        const url = urlFor.refget({ checksum: sequenceChecksum });
        const sequence = await fetch(url).then((response) => response.text());
        yield {
          label: `${product.stable_id} pep`,
          sequence
        };
      }
    }
  }
}

/**
 * Download sequences for one transcript, and for the gene that it belongs to.
 * This function is very similar to geneAndTranscriptsSequences; but it focuses on one transcript
 */
export async function* transcriptAndGeneSequences(
  params: TranscriptDownloadOptions
) {
  const { genomeId, transcriptId, geneSequenceTypes, transcriptSequenceTypes } =
    params;
  const metadata = await fetchTranscriptAndGeneMetadata({
    genomeId,
    transcriptId
  });
  const gene = metadata.transcript.gene;
  const transcript = metadata.transcript.gene.transcripts.find(
    ({ stable_id }) => stable_id === transcriptId
  ) as TranscriptInResponse;
  const strand = metadata.transcript.gene.slice.strand.code;

  let geneSequence = '';

  if (needsGenomicSequence(params)) {
    const regionChecksum = gene.slice.region.sequence.checksum;
    const geneStart = gene.slice.location.start;
    const geneEnd = gene.slice.location.end;

    const refgetUrl = urlFor.refget({
      checksum: regionChecksum,
      start: geneStart,
      end: geneEnd
    });

    geneSequence = await fetch(refgetUrl).then((response) => response.text());
    if (strand === 'reverse') {
      geneSequence = getReverseComplement(geneSequence);
    }
  }

  const productGeneratingContext = transcript.product_generating_contexts[0];

  if (transcriptSequenceTypes?.genomic) {
    const transcriptSequence = getTranscriptSequence({
      geneSequence,
      transcript_relative_location: transcript.relative_location
    });
    yield {
      label: `${transcript.stable_id} genomic`,
      sequence: transcriptSequence
    };
  }

  if (transcriptSequenceTypes?.exons) {
    for (const splicedExon of transcript.spliced_exons) {
      const exonSequence = getExonSequence({
        geneSequence,
        transcript_relative_location: transcript.relative_location,
        exon_relative_location: splicedExon.relative_location
      });
      const exonLabel = buildExonLabel({
        splicedExon,
        transcriptId: transcript.stable_id,
        exonsCount: transcript.spliced_exons.length
      });

      yield {
        label: exonLabel,
        sequence: exonSequence
      };
    }
  }

  if (transcriptSequenceTypes?.cdna) {
    const sequenceChecksum = productGeneratingContext.cdna.sequence.checksum;
    const url = urlFor.refget({ checksum: sequenceChecksum });
    const sequence = await fetch(url).then((response) => response.text());
    yield {
      label: `${transcript.stable_id} cdna`,
      sequence
    };
  }

  if (transcriptSequenceTypes?.cds) {
    const sequenceChecksum = productGeneratingContext.cds?.sequence.checksum;
    if (sequenceChecksum) {
      const url = urlFor.refget({ checksum: sequenceChecksum });
      const sequence = await fetch(url).then((response) => response.text());
      yield {
        label: `${transcript.stable_id} cds`,
        sequence
      };
    }
  }

  if (transcriptSequenceTypes?.protein) {
    const product = productGeneratingContext.product;
    if (product) {
      const sequenceChecksum = product.sequence.checksum;
      const url = urlFor.refget({ checksum: sequenceChecksum });
      const sequence = await fetch(url).then((response) => response.text());
      yield {
        label: `${product.stable_id} pep`,
        sequence
      };
    }
  }

  if (geneSequenceTypes?.genomic) {
    yield {
      label: `${gene.stable_id} genomic`,
      sequence: geneSequence
    };
  }

  if (geneSequenceTypes?.exons) {
    for (const transcript of gene.transcripts) {
      for (const splicedExon of transcript.spliced_exons) {
        const exonSequence = getExonSequence({
          geneSequence,
          transcript_relative_location: transcript.relative_location,
          exon_relative_location: splicedExon.relative_location
        });
        const exonLabel = buildExonLabel({
          splicedExon,
          geneId: gene.stable_id,
          transcriptId: transcript.stable_id,
          exonsCount: transcript.spliced_exons.length
        });

        yield {
          label: exonLabel,
          sequence: exonSequence
        };
      }
    }
  }
}

const needsGenomicSequence = (params: SequenceDownloadOptions) => {
  const { geneSequenceTypes, transcriptSequenceTypes } = params;

  return (
    geneSequenceTypes?.genomic ||
    geneSequenceTypes?.exons ||
    transcriptSequenceTypes?.genomic ||
    transcriptSequenceTypes?.exons
  );
};

const getTranscriptSequence = (params: {
  geneSequence: string;
  transcript_relative_location: {
    start: number;
    end: number;
  };
}) => {
  const { start, end } = params.transcript_relative_location;
  return params.geneSequence.slice(start - 1, end);
};

const getExonSequence = (params: {
  geneSequence: string;
  transcript_relative_location: {
    start: number;
    end: number;
  };
  exon_relative_location: {
    start: number;
    end: number;
  };
}) => {
  const exonRelativeLocationInGene = getExonRelativeLocationInGene({
    exon: {
      relative_start: params.exon_relative_location.start,
      relative_end: params.exon_relative_location.end
    },
    transcript: {
      relative_start: params.transcript_relative_location.start
    }
  });
  const exonStartIndex = exonRelativeLocationInGene.start - 1;
  const exonEndIndex = exonRelativeLocationInGene.end;

  return params.geneSequence.slice(exonStartIndex, exonEndIndex);
};

const buildExonLabel = (params: {
  transcriptId: string;
  geneId?: string;
  splicedExon: GeneAndTranscriptsResponse['gene']['transcripts'][number]['spliced_exons'][number];
  exonsCount: number;
}) => {
  // Proposed heading format:
  // EXON_ID.VERSION gene:GENE_ID.VERSION transcript:TRANSCRIPT_ID.VERSION exon:N total_exons:exon_count_number{}
  const {
    index: exonIndex,
    exon: { stable_id: exonId }
  } = params.splicedExon;
  const genePart = params.geneId ? `gene:${params.geneId} ` : '';
  const transcriptPart = `transcript:${params.transcriptId} `;
  const exonOrderPart = `exon:${exonIndex} total_exons:${params.exonsCount}`;

  return `${exonId} ${genePart}${transcriptPart}${exonOrderPart}`;
};

const fetchGeneAndTranscriptsMetadata = async (variables: {
  genomeId: string;
  geneId: string;
}) => {
  // Creating a client below instead of just calling "request",
  // so that it would be possible to inject a JSON serializer,
  // because either webpack, or comlink break the import of the default json serializer
  const graphQLClient = new GraphQLClient('/api/graphql/core', {
    jsonSerializer: JSON
  });

  return await graphQLClient.request<GeneAndTranscriptsResponse>(
    geneAndTranscriptsQuery,
    variables
  );
};

const fetchTranscriptAndGeneMetadata = async (variables: {
  genomeId: string;
  transcriptId: string;
}) => {
  // Creating a client below instead of just calling "request",
  // so that it would be possible to inject a JSON serializer,
  // because either webpack, or comlink break the import of the default json serializer
  const graphQLClient = new GraphQLClient('/api/graphql/core', {
    jsonSerializer: JSON
  });

  return await graphQLClient.request<TranscriptAndGeneResponse>(
    transcriptAndGeneQuery,
    variables
  );
};
