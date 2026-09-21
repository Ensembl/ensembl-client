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

import type { SequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/queries/geneQuery';

export type FeatureReference =
  | { type: 'transcript'; id: string }
  | { type: 'exon'; id: string; transcriptId: string; coding?: boolean }
  | { type: 'intron'; id: string; transcriptId: string };

type CodingRegionInLookup = {
  start: number; // genomic, in Ensembl coordinates
  end: number; // genomic, in Ensembl coordinates
};

type ExonInLookup = {
  id: string;
  start: number; // genomic, in Ensembl coordinates
  end: number; // genomic, in Ensembl coordinates
  transcriptId: string;
};

type IntronInLookup = {
  id: string;
  start: number; // genomic, in Ensembl coordinates
  end: number; // genomic, in Ensembl coordinates
  transcriptId: string;
};

type TranscriptInLookup = {
  id: string;
  start: number; // genomic, in Ensembl coordinates
  end: number; // genomic, in Ensembl coordinates
};

export type GeneFeaturesLookup = {
  transcripts: TranscriptInLookup[];
  cds_regions: CodingRegionInLookup[];
  exons: ExonInLookup[];
  introns: IntronInLookup[];
};

/**
 * Iterate over gene transcripts, and extract all cds regions.
 * Store them
 */

export const generateFeatureLookup = (
  gene: SequenceViewerGene
): GeneFeaturesLookup => {
  const lookup: GeneFeaturesLookup = {
    transcripts: [],
    cds_regions: [],
    exons: [],
    introns: []
  };
  const codingRegionKeys = new Set<string>();

  for (const transcript of gene.transcripts) {
    lookup.transcripts.push({
      id: transcript.stable_id,
      start: transcript.slice.location.start,
      end: transcript.slice.location.end
    });

    for (const context of transcript.product_generating_contexts) {
      if (context.cds) {
        const { start, end } = context.cds;
        const key = `${start}:${end}`;
        if (!codingRegionKeys.has(key)) {
          codingRegionKeys.add(key);
          lookup.cds_regions.push({ start, end });
        }
      }
    }

    const exons = transcript.spliced_exons.toSorted(
      (left, right) =>
        left.exon.slice.location.start - right.exon.slice.location.start
    );

    for (const [index, splicedExon] of exons.entries()) {
      const { start, end } = splicedExon.exon.slice.location;
      lookup.exons.push({
        id: splicedExon.exon.stable_id,
        start,
        end,
        transcriptId: transcript.stable_id
      });

      if (index === 0) continue;

      const previous = exons[index - 1].exon.slice.location;
      const intronStart = previous.end + 1;
      const intronEnd = start - 1;

      if (intronStart <= intronEnd) {
        lookup.introns.push({
          id: `${transcript.stable_id}:intron:${index}`,
          start: intronStart,
          end: intronEnd,
          transcriptId: transcript.stable_id
        });
      }
    }
  }

  lookup.transcripts.sort((left, right) => left.start - right.start);
  lookup.cds_regions.sort((left, right) => left.start - right.start);
  lookup.exons.sort((left, right) => left.start - right.start);
  lookup.introns.sort((left, right) => left.start - right.start);

  return lookup;
};
