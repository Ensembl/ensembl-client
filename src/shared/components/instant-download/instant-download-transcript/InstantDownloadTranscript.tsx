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

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import pick from 'lodash/pick';
import intersection from 'lodash/intersection';

import { fetchForTranscript } from '../instant-download-fetch/fetchForTranscript';

import InstantDownloadTranscriptVisualisation from './InstantDownloadTranscriptVisualisation';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import styles from './InstantDownloadTranscript.scss';

type Layout = 'horizontal' | 'vertical';
type Theme = 'light' | 'dark';

type TranscriptFields = {
  id: string;
  isProteinCoding: boolean;
};

type GeneFields = {
  id: string;
};

export type TrackTranscriptDownloadPayload = {
  genomeId: string;
  transcriptId: string;
  options: {
    transcript: Partial<TranscriptOptions>;
    gene: { genomicSequence: boolean };
  };
};

export type InstantDownloadTranscriptEntityProps = {
  genomeId: string;
  transcript: TranscriptFields;
  gene: GeneFields;
  onDownloadSuccess?: (params: TrackTranscriptDownloadPayload) => void;
  onDownloadFailure?: (params: TrackTranscriptDownloadPayload) => void;
};

type Props = InstantDownloadTranscriptEntityProps & {
  layout: Layout;
  theme: Theme;
};

type TranscriptSectionProps = {
  transcript: TranscriptFields;
  options: Partial<TranscriptOptions>;
  theme: Theme;
  onChange: (key: keyof TranscriptOptions) => void;
};

type GeneSectionProps = {
  gene: GeneFields;
  isGenomicSequenceSelected: boolean;
  theme: Theme;
  onChange: () => void;
};

export type TranscriptOptions = {
  genomicSequence: boolean;
  proteinSequence: boolean;
  cdna: boolean;
  cds: boolean;
};

export type TranscriptOption = keyof Partial<TranscriptOptions>;

export const transcriptOptionsOrder: TranscriptOption[] = [
  'genomicSequence',
  'cdna',
  'proteinSequence',
  'cds'
];

export const defaultTranscriptOptions: TranscriptOptions = {
  genomicSequence: false,
  cdna: false,
  proteinSequence: false,
  cds: false
};

const transcriptOptionLabels: Record<keyof TranscriptOptions, string> = {
  genomicSequence: 'Genomic sequence',
  proteinSequence: 'Protein sequence',
  cdna: 'cDNA',
  cds: 'CDS'
};

export const filterTranscriptOptions = (
  isProteinCoding: boolean
): Partial<TranscriptOptions> => {
  return isProteinCoding
    ? defaultTranscriptOptions
    : pick(defaultTranscriptOptions, ['genomicSequence', 'cdna']);
};

export const getCheckboxTheme = (theme: Theme) =>
  theme === 'light' ? 'lighter' : 'dark';

const InstantDownloadTranscript = (props: Props) => {
  const {
    genomeId,
    gene: { id: geneId },
    transcript: { id: transcriptId, isProteinCoding }
  } = props;
  const [transcriptOptions, setTranscriptOptions] = useState(
    filterTranscriptOptions(isProteinCoding)
  );
  const [isGeneSequenceSelected, setIsGeneSequenceSelected] = useState(false);

  useEffect(() => {
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  }, [isProteinCoding]);

  const resetCheckboxes = () => {
    setIsGeneSequenceSelected(false);
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  };

  const onSubmit = async () => {
    const payload = {
      genomeId,
      geneId,
      transcriptId,
      options: {
        transcript: transcriptOptions,
        gene: { genomicSequence: isGeneSequenceSelected }
      }
    };
    try {
      await fetchForTranscript(payload);
      props.onDownloadSuccess?.(payload);
    } catch {
      props.onDownloadFailure?.(payload);
    } finally {
      resetCheckboxes();
    }
  };

  const onTranscriptOptionChange = (key: keyof TranscriptOptions) => {
    const updatedOptions = {
      ...transcriptOptions,
      [key]: !transcriptOptions[key]
    };
    setTranscriptOptions(updatedOptions);
  };
  const onGeneOptionChange = () => {
    setIsGeneSequenceSelected(!isGeneSequenceSelected);
  };

  const wrapperClasses =
    props.layout === 'horizontal'
      ? classNames(styles.layout, styles.layoutHorizontal)
      : classNames(styles.layout, styles.layoutVertical);

  const isButtonDisabled = !hasSelectedOptions({
    ...transcriptOptions,
    geneSequence: isGeneSequenceSelected
  });

  return (
    <div className={wrapperClasses}>
      <TranscriptSection
        transcript={props.transcript}
        options={transcriptOptions}
        theme={props.theme}
        onChange={onTranscriptOptionChange}
      />
      <GeneSection
        gene={props.gene}
        isGenomicSequenceSelected={isGeneSequenceSelected}
        theme={props.theme}
        onChange={onGeneOptionChange}
      />
      <InstantDownloadButton
        isDisabled={isButtonDisabled}
        onClick={onSubmit}
        theme={props.theme}
        classNames={{
          wrapper: styles.downloadButtonWrapper
        }}
      />
    </div>
  );
};

InstantDownloadTranscript.defaultProps = {
  layout: 'horizontal',
  theme: 'dark'
} as Props;

const TranscriptSection = (props: TranscriptSectionProps) => {
  const { transcript, options } = props;
  const orderedOptionKeys = intersection(
    transcriptOptionsOrder,
    Object.keys(options)
  );

  const checkboxes = orderedOptionKeys.map((key) => (
    <Checkbox
      key={key}
      classNames={{
        default: styles.checkboxDefault
      }}
      theme={getCheckboxTheme(props.theme)}
      label={transcriptOptionLabels[key as TranscriptOption]}
      checked={options[key as TranscriptOption] as boolean}
      onChange={() => props.onChange(key as TranscriptOption)}
    />
  ));

  const transcriptVisualisation = (
    <InstantDownloadTranscriptVisualisation
      isGenomicSequenceEnabled={options.genomicSequence}
      isProteinSequenceEnabled={options.proteinSequence}
      isCDNAEnabled={options.cdna}
      isCDSEnabled={options.cds}
      theme={props.theme}
    />
  );

  return (
    <div className={styles.transcriptSection}>
      <div className={styles.label}>
        Transcript
        <span className={styles.featureId}>{transcript.id}</span>
      </div>
      <div className={styles.transcriptVis}>{transcriptVisualisation}</div>
      <div className={styles.checkboxGrid}>{checkboxes}</div>
    </div>
  );
};

const GeneSection = (props: GeneSectionProps) => {
  return (
    <div className={styles.geneSection}>
      <div className={styles.label}>
        Gene
        <span className={styles.featureId}>{props.gene.id}</span>
      </div>
      <div>
        <Checkbox
          classNames={{
            default: styles.checkboxDefault
          }}
          theme={getCheckboxTheme(props.theme)}
          label="Genomic sequence"
          checked={props.isGenomicSequenceSelected}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};

const hasSelectedOptions = (
  options: Partial<TranscriptOptions> & { geneSequence: boolean }
) => {
  return Object.keys(options).some(
    (key) => options[key as keyof TranscriptOptions]
  );
};

export default InstantDownloadTranscript;
