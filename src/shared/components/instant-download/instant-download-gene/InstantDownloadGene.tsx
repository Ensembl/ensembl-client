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
import intersection from 'lodash/intersection';
import classNames from 'classnames';

import { fetchForGene } from '../instant-download-fetch/fetchForGene';
import { filterTranscriptOptions } from '../instant-download-transcript/InstantDownloadTranscript';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import styles from './InstantDownloadGene.scss';

type Theme = 'light' | 'dark';

type GeneFields = {
  id: string;
  isProteinCoding: boolean;
};

export type InstantDownloadGeneEntityProps = {
  genomeId: string;
  gene: GeneFields;
};

type Props = InstantDownloadGeneEntityProps & {
  theme: Theme;
  onDownloadSuccess?: (params: OnDownloadPayload) => void;
  onDownloadFailure?: (params: OnDownloadPayload) => void;
};

export type OnDownloadPayload = {
  genomeId: string;
  geneId: string;
  options: {
    transcript: Partial<TranscriptOptions>;
    gene: { genomicSequence: boolean };
  };
};

type TranscriptSectionProps = {
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
  'cds',
  'proteinSequence'
];

const transcriptOptionLabels: Record<keyof TranscriptOptions, string> = {
  genomicSequence: 'Genomic sequence',
  cdna: 'cDNA',
  cds: 'CDS',
  proteinSequence: 'Protein sequence'
};

export const getCheckboxTheme = (theme: Theme) =>
  theme === 'light' ? 'lighter' : 'dark';

const InstantDownloadGene = (props: Props) => {
  const {
    genomeId,
    gene: { id: geneId, isProteinCoding }
  } = props;
  const [transcriptOptions, setTranscriptOptions] = useState(
    filterTranscriptOptions(isProteinCoding)
  );
  const [isGeneSequenceSelected, setIsGeneSequenceSelected] = useState(false);

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

  const resetCheckboxes = () => {
    setIsGeneSequenceSelected(false);
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  };

  const onSubmit = async () => {
    const payload = {
      genomeId,
      geneId,
      options: {
        transcript: transcriptOptions,
        gene: { genomicSequence: isGeneSequenceSelected }
      }
    };

    try {
      await fetchForGene(payload);
      props.onDownloadSuccess?.(payload);
    } catch {
      props.onDownloadFailure?.(payload);
    } finally {
      resetCheckboxes();
    }
  };

  const themeClass =
    props.theme === 'dark' ? styles.themeDark : styles.themeLight;

  const containerClasses = classNames(styles.container, themeClass);

  const isButtonDisabled = !hasSelectedOptions({
    ...transcriptOptions,
    geneSequence: isGeneSequenceSelected
  });

  return (
    <div className={containerClasses}>
      <GeneSection
        gene={props.gene}
        isGenomicSequenceSelected={isGeneSequenceSelected}
        theme={props.theme}
        onChange={onGeneOptionChange}
      />
      <TranscriptSection
        options={transcriptOptions}
        theme={props.theme}
        onChange={onTranscriptOptionChange}
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

InstantDownloadGene.defaultProps = {
  theme: 'light'
} as Props;

const GeneSection = (props: GeneSectionProps) => (
  <div className={styles.geneSection}>
    <div className={styles.label}>
      Gene
      <span className={styles.featureId}>{props.gene.id}</span>
    </div>
    <Checkbox
      theme={getCheckboxTheme(props.theme)}
      label="Genomic sequence"
      checked={props.isGenomicSequenceSelected}
      onChange={props.onChange}
    />
  </div>
);

const TranscriptSection = (props: TranscriptSectionProps) => {
  const { options } = props;
  const orderedOptionKeys = intersection(
    transcriptOptionsOrder,
    Object.keys(options)
  );
  const checkboxes = orderedOptionKeys.map((key) => (
    <Checkbox
      key={key}
      theme={getCheckboxTheme(props.theme)}
      label={transcriptOptionLabels[key as TranscriptOption]}
      checked={options[key as TranscriptOption] as boolean}
      onChange={() => props.onChange(key as TranscriptOption)}
    />
  ));

  return (
    <div className={styles.transcriptSection}>
      <div className={styles.label}>All transcripts</div>
      {checkboxes}
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

export default InstantDownloadGene;
