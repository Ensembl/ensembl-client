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

import { useState } from 'react';
import { wrap } from 'comlink';
import intersection from 'lodash/intersection';
import classNames from 'classnames';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';
import { filterTranscriptOptions } from '../instant-download-transcript/InstantDownloadTranscript';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import type { WorkerApi } from 'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker';

import styles from './InstantDownloadGene.module.css';

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
  theme?: Theme;
  onDownloadSuccess?: (params: OnDownloadPayload) => void;
  onDownloadFailure?: (params: OnDownloadPayload) => void;
};

export type OnDownloadPayload = {
  genomeId: string;
  geneId: string;
  options: {
    transcript: Partial<TranscriptOptions>;
    gene: { genomic: boolean; exons: boolean };
  };
};

type TranscriptSectionProps = {
  options: Partial<TranscriptOptions>;
  theme: Theme;
  onChange: (key: keyof TranscriptOptions) => void;
};

type GeneSectionProps = {
  gene: GeneFields;
  options: Partial<GeneOptions>;
  theme: Theme;
  onChange: (key: keyof GeneOptions) => void;
};

export type GeneOptions = {
  genomic: boolean;
  exons: boolean;
};

export type TranscriptOptions = {
  genomic: boolean;
  protein: boolean;
  cdna: boolean;
  cds: boolean;
  exons: boolean;
};

export type TranscriptOption = keyof Partial<TranscriptOptions>;

export const transcriptOptionsOrder: TranscriptOption[] = [
  'genomic',
  'cdna',
  'cds',
  'exons',
  'protein'
];

const transcriptOptionLabels: Record<keyof TranscriptOptions, string> = {
  genomic: 'Genomic sequence',
  cdna: 'cDNA',
  cds: 'CDS',
  exons: 'Exons',
  protein: 'Protein sequence'
};

const defaultGeneOptions: GeneOptions = {
  genomic: false,
  exons: false
};

export const getCheckboxTheme = (theme: Theme) =>
  theme === 'light' ? 'light' : 'dark';

const InstantDownloadGene = (props: Props) => {
  const {
    genomeId,
    gene: { id: geneId, isProteinCoding },
    theme = 'light'
  } = props;
  const [transcriptOptions, setTranscriptOptions] = useState(
    filterTranscriptOptions(isProteinCoding)
  );
  const [geneOptions, setGeneOptions] = useState(defaultGeneOptions);

  const onTranscriptOptionChange = (key: keyof TranscriptOptions) => {
    const updatedOptions = {
      ...transcriptOptions,
      [key]: !transcriptOptions[key]
    };

    setTranscriptOptions(updatedOptions);
  };

  const onGeneOptionChange = (key: keyof GeneOptions) => {
    const updatedOptions = {
      ...geneOptions,
      [key]: !geneOptions[key]
    };

    setGeneOptions(updatedOptions);
  };

  const resetCheckboxes = () => {
    setGeneOptions(defaultGeneOptions);
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  };

  const onSubmit = async () => {
    const payload = {
      genomeId,
      geneId,
      options: {
        gene: geneOptions,
        transcript: transcriptOptions
      }
    };

    try {
      await downloadGeneSequences(payload);
      props.onDownloadSuccess?.(payload);
    } catch (error) {
      props.onDownloadFailure?.(payload);
      throw error;
    } finally {
      resetCheckboxes();
    }
  };

  const themeClass = theme === 'dark' ? styles.themeDark : styles.themeLight;

  const containerClasses = classNames(styles.container, themeClass);

  const isButtonDisabled = !hasSelectedOptions([
    transcriptOptions,
    geneOptions
  ]);

  return (
    <div className={containerClasses}>
      <GeneSection
        gene={props.gene}
        options={geneOptions}
        theme={theme}
        onChange={onGeneOptionChange}
      />
      <TranscriptSection
        options={transcriptOptions}
        theme={theme}
        onChange={onTranscriptOptionChange}
      />
      <InstantDownloadButton
        disabled={isButtonDisabled}
        onClick={onSubmit}
        theme={theme}
        className={styles.downloadButton}
      />
    </div>
  );
};

const GeneSection = (props: GeneSectionProps) => (
  <div className={styles.geneSection}>
    <div className={styles.label}>
      Gene
      <span className={styles.featureId}>{props.gene.id}</span>
    </div>
    <Checkbox
      theme={getCheckboxTheme(props.theme)}
      label="Genomic sequence"
      checked={!!props.options.genomic}
      onChange={() => props.onChange('genomic')}
      className={styles.checkbox}
    />
    <Checkbox
      theme={getCheckboxTheme(props.theme)}
      label="Exons"
      checked={!!props.options.exons}
      onChange={() => props.onChange('exons')}
      className={styles.checkbox}
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
      className={styles.checkbox}
    />
  ));

  return (
    <div className={styles.transcriptSection}>
      <div className={styles.label}>All transcripts</div>
      {checkboxes}
    </div>
  );
};

const hasSelectedOptions = (options: Record<string, boolean>[]) => {
  return options.some((obj) => Object.values(obj).includes(true));
};

const downloadGeneSequences = async (params: OnDownloadPayload) => {
  const { geneId } = params;

  const worker = new Worker(
    new URL(
      'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts',
      import.meta.url
    )
  );

  try {
    const service = wrap<WorkerApi>(worker);
    const sequences = await service.downloadSequencesForGene({
      genomeId: params.genomeId,
      geneId: params.geneId,
      geneSequenceTypes: params.options.gene,
      transcriptSequenceTypes: params.options.transcript
    });

    await downloadTextAsFile(sequences, `${geneId}.fasta`, {
      type: 'text/x-fasta'
    });
  } finally {
    worker.terminate();
  }
};

export default InstantDownloadGene;
