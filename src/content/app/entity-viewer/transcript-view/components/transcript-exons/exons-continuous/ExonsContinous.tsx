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

import { useState, useMemo } from 'react';

// import { LINE_LENGTH } from 'src/shared/helpers/formatters/fastaFormatter';

import RadioGroup, {
  type RadioOption,
  type OptionValue
} from 'src/shared/components/radio-group/RadioGroup';

import type {
  EnrichedExon as Exon,
  EnrichedIntron as Intron
} from 'src/content/app/entity-viewer/transcript-view/components/transcript-exons/useExonsData';

import styles from './ExonsContinuous.module.css';

const LINE_LENGTH = 100;

type Props = {
  exons: Exon[];
  introns: Intron[];
  exonsAndIntrons: Array<Exon | Intron>;
};

const ExonsContinuous = (props: Props) => {
  const [view, setView] = useState('unspliced');

  const onViewChange = (view: OptionValue) => {
    setView(view as string);
  };

  const rowData = useMemo(() => {
    if (view === 'unspliced') {
      return generateRowData({
        features: props.exonsAndIntrons
      });
    } else {
      return generateRowData({
        features: props.exons
      });
    }
  }, [props.exonsAndIntrons, props.exons, view]);

  return (
    <div className={styles.container}>
      <ViewOptions selectedOption={view} onChange={onViewChange} />
      <SequenceRows data={rowData} />
    </div>
  );
};

const viewOptions: RadioOption[] = [
  { value: 'unspliced', label: 'Unspliced' },
  { value: 'spliced', label: 'Spliced' }
];

const ViewOptions = ({
  selectedOption,
  onChange
}: {
  selectedOption: string;
  onChange: (view: OptionValue) => void;
}) => {
  return (
    <RadioGroup
      options={viewOptions}
      selectedOption={selectedOption}
      onChange={onChange}
      direction="row"
    />
  );
};

const SequenceRows = ({ data }: { data: RowData[] }) => {
  return (
    <div className={styles.rowGrid}>
      {data.map((dataItem) => (
        <SequenceRow data={dataItem} key={dataItem.relativeStart} />
      ))}
    </div>
  );
};

const SequenceRow = ({ data }: { data: RowData }) => {
  return (
    <div className={styles.row}>
      <div className={styles.rowLeft}>{data.relativeStart}</div>
      <div>
        <span className={styles.sequence}>
          <Sequence data={data} />
        </span>
      </div>
      <div className={styles.rowRight}>{data.relativeEnd}</div>
    </div>
  );
};

const Sequence = ({ data }: { data: RowData }) => {
  const features = data.features;
  const sequence = data.sequence;

  const parts: Array<
    | {
        type: 'sequence';
        sequence: string;
      }
    | {
        type: 'start';
        sequence: string;
        feature: RowData['features'][number];
      }
    | {
        type: 'end';
        sequence: string;
        feature: RowData['features'][number];
      }
  > = [];

  for (const feature of features) {
    if (feature.isFirstInstance && feature.isLastInstance) {
      const firstBaseIndex = feature.offsetLeft;
      const lastBaseIndex = feature.offsetLeft + feature.length - 1;
      const firstBase = sequence[firstBaseIndex];
      const lastBase = sequence[lastBaseIndex];
      const remainingSequence = sequence.slice(
        firstBaseIndex + 1,
        lastBaseIndex
      );
      parts.push({
        type: 'start',
        sequence: firstBase,
        feature
      });
      parts.push({
        type: 'sequence',
        sequence: remainingSequence
      });
      parts.push({
        type: 'end',
        sequence: lastBase,
        feature
      });
    } else if (feature.isFirstInstance) {
      const firstBaseIndex = feature.offsetLeft;
      const lastBaseIndex = feature.offsetLeft + feature.length - 1;
      const firstBase = sequence[firstBaseIndex];
      const remainingSequence = sequence.slice(
        firstBaseIndex + 1,
        lastBaseIndex + 1
      );
      parts.push({
        type: 'start',
        sequence: firstBase,
        feature
      });
      parts.push({
        type: 'sequence',
        sequence: remainingSequence
      });
    } else if (feature.isLastInstance) {
      const firstBaseIndex = feature.offsetLeft;
      const lastBaseIndex = feature.offsetLeft + feature.length - 1;
      const lastBase = sequence[lastBaseIndex];
      const remainingSequence = sequence.slice(firstBaseIndex, lastBaseIndex);
      parts.push({
        type: 'sequence',
        sequence: remainingSequence
      });
      parts.push({
        type: 'end',
        sequence: lastBase,
        feature
      });
    }
  }

  if (!parts.length) {
    return sequence;
  } else {
    return parts.map((part, index) => {
      if (part.type === 'start') {
        return (
          <span key={index} className={styles.firstBase}>
            {part.sequence}
            <span className={styles.featureName}>
              {getFeatureLabel(part.feature.feature)}
            </span>
          </span>
        );
      } else if (part.type === 'end') {
        return (
          <span key={index} className={styles.lastBase}>
            {part.sequence}
            <Junction />
          </span>
        );
      } else {
        return <span key={index}>{part.sequence}</span>;
      }
    });
  }
};

const Junction = () => {
  return (
    <svg
      viewBox="0 0 16 50"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.boundaryMarker}
    >
      <polygon points="0,0 8,10 16 0" />
      <line x1="8" y1="10" x2="8" y2="50" strokeWidth="2" strokeDasharray="2" />
    </svg>
  );
};

const getFeatureLabel = (feature: Exon | Intron) => {
  if (feature.type === 'exon') {
    return feature.stable_id;
  } else {
    return feature.id;
  }
};

type RowData = {
  relativeStart: number; // start relative to the transcript, 1-based
  relativeEnd: number; // start relative to the transcript, 1-based
  genomicStart: number | null; // start relative to top-level region; does not make sense post-splicing
  genomicEnd: number | null; // end relative to top-level region; does not make sense post-splicing
  sequence: string; // stretch of sequence within this row
  features: {
    offsetLeft: number; // in nucleotides, 0-based, counting from the first nucleotide in the row
    length: number;
    isFirstInstance: boolean;
    isLastInstance: boolean;
    feature: Exon | Intron;
  }[];
};

const generateRowData = ({
  features
}: {
  features: Array<Exon | Intron>;
}): RowData[] => {
  let counterSinceStart = 1;
  let offsetLeft = 0;

  const rowItems: RowData[] = [];

  for (const feature of features) {
    const sequenceStep = LINE_LENGTH;
    const firstLineLength = LINE_LENGTH - offsetLeft;
    const sequenceForFirstLine = feature.sequence.slice(0, firstLineLength);
    const remainingSequence = feature.sequence.slice(firstLineLength);

    const prevRowItem = rowItems.at(-1);
    const prevFeature = prevRowItem?.features.at(-1);
    if (prevFeature) {
      prevFeature.isLastInstance = true;
    }
    if (offsetLeft && prevRowItem) {
      prevRowItem.sequence = prevRowItem.sequence + sequenceForFirstLine;
      prevRowItem.features.push({
        isFirstInstance: true,
        isLastInstance: false,
        offsetLeft,
        length: sequenceForFirstLine.length,
        feature
      });

      // FIXME: this is duplicated code (see below)
      offsetLeft = offsetLeft + firstLineLength;
      if (offsetLeft === LINE_LENGTH) {
        counterSinceStart += LINE_LENGTH;
        offsetLeft = 0;
      }
    } else {
      const rowItem: RowData = {
        relativeStart: counterSinceStart,
        relativeEnd: counterSinceStart + LINE_LENGTH - 1,
        genomicStart: null,
        genomicEnd: null,
        sequence: sequenceForFirstLine,
        features: [
          {
            offsetLeft: offsetLeft,
            isFirstInstance: true,
            isLastInstance: false,
            length: sequenceForFirstLine.length,
            feature
          }
        ]
      };
      rowItems.push(rowItem);

      // FIXME: this is duplicated code (see above)
      offsetLeft = offsetLeft + firstLineLength;
      if (offsetLeft === LINE_LENGTH) {
        counterSinceStart += LINE_LENGTH;
        offsetLeft = 0;
      }
    }

    for (let i = 0; i < remainingSequence.length; i += sequenceStep) {
      const sequenceSlice = remainingSequence.slice(i, i + sequenceStep);
      const rowItem: RowData = {
        relativeStart: counterSinceStart,
        relativeEnd: counterSinceStart + LINE_LENGTH - 1,
        genomicStart: null,
        genomicEnd: null,
        sequence: sequenceSlice,
        features: [
          {
            isFirstInstance: false,
            isLastInstance: i + sequenceStep >= remainingSequence.length,
            offsetLeft: offsetLeft,
            length: sequenceSlice.length,
            feature
          }
        ]
      };
      rowItems.push(rowItem);

      offsetLeft = offsetLeft + sequenceSlice.length;
      if (offsetLeft === LINE_LENGTH) {
        offsetLeft = 0;
      }
      if (sequenceSlice.length === LINE_LENGTH) {
        counterSinceStart += sequenceSlice.length;
      }
    }
  }

  return rowItems;
};

export default ExonsContinuous;
