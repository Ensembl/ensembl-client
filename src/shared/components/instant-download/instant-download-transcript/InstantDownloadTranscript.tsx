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
import { wrap } from 'comlink';
import classNames from 'classnames';
import pick from 'lodash/pick';
import intersection from 'lodash/intersection';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import InstantDownloadTranscriptVisualisation from './InstantDownloadTranscriptVisualisation';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import type { WorkerApi } from 'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker';

import styles from './InstantDownloadTranscript.module.css';

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
    gene: Partial<GeneOptions>;
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
  layout?: Layout;
  theme?: Theme;
};

type TranscriptSectionProps = {
  transcript: TranscriptFields;
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
  'exons',
  'cdna',
  'protein',
  'cds'
];

export const defaultTranscriptOptions: TranscriptOptions = {
  genomic: false,
  cdna: false,
  exons: false,
  protein: false,
  cds: false
};

const defaultGeneOptions: GeneOptions = {
  genomic: false,
  exons: false
};

const transcriptOptionLabels: Record<keyof TranscriptOptions, string> = {
  genomic: 'Genomic sequence',
  protein: 'Protein sequence',
  cdna: 'cDNA',
  exons: 'Exons',
  cds: 'CDS'
};

export const filterTranscriptOptions = (
  isProteinCoding: boolean
): Partial<TranscriptOptions> => {
  return isProteinCoding
    ? defaultTranscriptOptions
    : pick(defaultTranscriptOptions, ['genomic', 'cdna', 'exons']);
};

export const getCheckboxTheme = (theme: Theme) =>
  theme === 'light' ? 'lighter' : 'dark';

const InstantDownloadTranscript = (props: Props) => {
  const {
    genomeId,
    gene: { id: geneId },
    transcript: { id: transcriptId, isProteinCoding },
    layout = 'horizontal',
    theme = 'dark'
  } = props;
  const [transcriptOptions, setTranscriptOptions] = useState(
    filterTranscriptOptions(isProteinCoding)
  );
  const [geneOptions, setGeneOptions] = useState(defaultGeneOptions);

  useEffect(() => {
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  }, [isProteinCoding]);

  const resetCheckboxes = () => {
    setGeneOptions(defaultGeneOptions);
    setTranscriptOptions(filterTranscriptOptions(isProteinCoding));
  };

  const onSubmit = async () => {
    const payload = {
      genomeId,
      geneId,
      transcriptId,
      options: {
        transcript: transcriptOptions,
        gene: geneOptions
      }
    };
    try {
      await downloadSequences(payload);
      props.onDownloadSuccess?.(payload);
    } catch (error) {
      props.onDownloadFailure?.(payload);
      throw error;
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
  const onGeneOptionChange = (key: keyof GeneOptions) => {
    setGeneOptions({
      ...geneOptions,
      [key]: !geneOptions[key]
    });
  };

  const wrapperClasses = classNames(styles.layout, {
    [styles.layoutHorizontal]: layout === 'horizontal',
    [styles.layoutVertical]: layout === 'vertical'
  });

  const isButtonDisabled = !hasSelectedOptions([
    transcriptOptions,
    geneOptions
  ]);

  return (
    <div className={wrapperClasses}>
      <TranscriptSection
        transcript={props.transcript}
        options={transcriptOptions}
        theme={theme}
        onChange={onTranscriptOptionChange}
      />
      <GeneSection
        gene={props.gene}
        options={geneOptions}
        theme={theme}
        onChange={onGeneOptionChange}
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

const TranscriptSection = (props: TranscriptSectionProps) => {
  const { transcript, options } = props;
  const orderedOptionKeys = intersection(
    transcriptOptionsOrder,
    Object.keys(options)
  );

  const checkboxes = orderedOptionKeys.map((key) => (
    <Checkbox
      key={key}
      className={styles[key]}
      theme={getCheckboxTheme(props.theme)}
      label={transcriptOptionLabels[key as TranscriptOption]}
      checked={options[key as TranscriptOption] as boolean}
      onChange={() => props.onChange(key as TranscriptOption)}
    />
  ));

  const transcriptVisualisation = (
    <InstantDownloadTranscriptVisualisation
      isGenomicSequenceEnabled={options.genomic}
      isProteinSequenceEnabled={options.protein}
      isCDNAEnabled={options.cdna || options.exons}
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
      <div className={styles.checkboxes}>
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
    </div>
  );
};

const hasSelectedOptions = (options: Record<string, boolean>[]) => {
  return options.some((obj) => Object.values(obj).includes(true));
};

const downloadSequences = async (params: TrackTranscriptDownloadPayload) => {
  const { transcriptId } = params;

  const worker = new Worker(
    new URL(
      'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts',
      import.meta.url
    )
  );

  try {
    const service = wrap<WorkerApi>(worker);
    const sequences = await service.downloadSequencesForTranscript({
      genomeId: params.genomeId,
      transcriptId: params.transcriptId,
      geneSequences: params.options.gene,
      transcriptSequences: params.options.transcript
    });

    await downloadTextAsFile(sequences, `${transcriptId}.fasta`, {
      type: 'text/x-fasta'
    });
  } finally {
    worker.terminate();
  }
};

export default InstantDownloadTranscript;
