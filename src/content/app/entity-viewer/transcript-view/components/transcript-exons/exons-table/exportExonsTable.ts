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

import type {
  Data,
  EnrichedExon as Exon,
  EnrichedIntron as Intron
} from 'src/content/app/entity-viewer/transcript-view/components/transcript-exons/useExonsData';

type RowMap = {
  number?: number;
  name: string;
  start?: number;
  end?: number;
  startPhase?: number | string;
  endPhase?: number | string;
  length?: number;
  strand: string;
  sequence: string;
};

export const prepareExportTSV = ({ data }: { data: Data }) => {
  const headerRow = [
    'No.',
    'Exon/Intron',
    'Start',
    'End',
    'Start phase',
    'End phase',
    'Length',
    'Strand',
    'Sequence'
  ].join('\t');

  const upstreamSequenceRow = prepareTableRow(
    prepareFlankingSequenceRowData({
      sequence: data.upstreamFlankingSequence.sequence,
      strand: data.upstreamFlankingSequence.strand,
      flank: 'upstream'
    })
  );
  const downstreamSequenceRow = prepareTableRow(
    prepareFlankingSequenceRowData({
      sequence: data.downstreamFlankingSequence.sequence,
      strand: data.downstreamFlankingSequence.strand,
      flank: 'downstream'
    })
  );
  const featureRows = data.exonsAndIntrons.map((feature) => {
    if (feature.type === 'exon') {
      return prepareTableRow(prepareExonRowData({ exon: feature }));
    } else {
      return prepareTableRow(prepareIntronRowData({ intron: feature }));
    }
  });

  return [
    headerRow,
    upstreamSequenceRow,
    ...featureRows,
    downstreamSequenceRow
  ].join('\n');
};

const prepareFlankingSequenceRowData = ({
  sequence,
  strand,
  flank
}: {
  sequence: string;
  strand: string;
  flank: 'upstream' | 'downstream';
}): RowMap => {
  sequence = flank === 'upstream' ? `...${sequence}` : `${sequence}...`;
  const title =
    flank === 'upstream' ? "5' upstream sequence" : "3' downstream sequence";

  return {
    name: title,
    strand,
    sequence
  };
};

const prepareExonRowData = ({ exon }: { exon: Exon }): RowMap => {
  return {
    number: exon.index,
    name: exon.stable_id,
    start: exon.start,
    end: exon.end,
    startPhase: exon.startPhase ?? undefined,
    endPhase: exon.endPhase ?? undefined,
    length: exon.length,
    strand: exon.strand,
    sequence: exon.sequence
  };
};

const prepareIntronRowData = ({ intron }: { intron: Intron }): RowMap => {
  return {
    name: intron.id,
    start: intron.start,
    end: intron.end,
    startPhase: '-',
    endPhase: '-',
    length: intron.length,
    strand: intron.strand,
    sequence: intron.sequence
  };
};

const prepareTableRow = (data: RowMap) => {
  const cells = [
    data.number ?? '',
    data.name,
    data.start ?? '',
    data.end ?? '',
    data.startPhase ?? '',
    data.endPhase ?? '',
    data.length ?? '',
    data.strand,
    data.sequence
  ];

  return cells.join('\t');
};
