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
import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames';

import { fetchForGene } from '../instant-download-fetch/fetchForGene';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import styles from './InstantDownloadGene.scss';

const QUERY = gql`
  query Gene($genomeId: String!, $entityId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $entityId }) {
      stable_id
      unversioned_stable_id
    }
  }
`;

type Theme = 'light' | 'dark';

type GeneFields = {
  id: string;
};

export type InstantDownloadGeneEntityProps = {
  genomeId: string;
  gene: GeneFields;
};

type Props = InstantDownloadGeneEntityProps & {
  theme: Theme;
};

type TranscriptSectionProps = {
  options: Partial<TranscriptOptions>;
  theme: Theme;
  onChange: (key: keyof TranscriptOptions) => void;
};

type GeneSectionProps = {
  gene: GeneFields;
  isGenomicSequenceSelected: boolean;
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

const defaultTranscriptOptions: TranscriptOptions = {
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

const InstantDownloadGene = (props: Props) => {
  const {
    genomeId,
    gene: { id: geneId }
  } = props;
  const [transcriptOptions, setTranscriptOptions] = useState(
    defaultTranscriptOptions
  );
  const [isGeneSequenceSelected, setIsGeneSequenceSelected] = useState(false);

  const { data } = useQuery<{ gene: { unversioned_stable_id: string } }>(
    QUERY,
    {
      variables: { genomeId, entityId: geneId }
    }
  );

  if (!data) {
    return null;
  }

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

  const onSubmit = () => {
    const payload = {
      genomeId,
      geneId: data.gene.unversioned_stable_id,
      options: {
        transcript: transcriptOptions,
        gene: { genomicSequence: isGeneSequenceSelected }
      }
    };

    fetchForGene(payload);
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
        onChange={onGeneOptionChange}
      />
      <TranscriptSection
        options={transcriptOptions}
        theme={props.theme}
        onChange={onTranscriptOptionChange}
      />
      <InstantDownloadButton
        className={isButtonDisabled ? styles.downloadButtonDisabled : undefined}
        isDisabled={isButtonDisabled}
        onClick={onSubmit}
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
    <div>
      <Checkbox
        classNames={{
          checkboxHolder: styles.checkboxWrapper,
          unchecked: styles.checkboxUnchecked
        }}
        labelClassName={styles.checkboxLabel}
        label="Genomic sequence"
        checked={props.isGenomicSequenceSelected}
        onChange={props.onChange}
      />
    </div>
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
      classNames={{ unchecked: styles.checkboxUnchecked }}
      labelClassName={styles.checkboxLabel}
      label={transcriptOptionLabels[key as TranscriptOption]}
      checked={options[key as TranscriptOption] as boolean}
      onChange={() => props.onChange(key as TranscriptOption)}
    />
  ));

  return (
    <div className={styles.transcriptSection}>
      <div className={styles.label}>All transcripts</div>
      <div className={styles.checkboxGrid}>{checkboxes}</div>
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
