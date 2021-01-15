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

import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from 'src/shared/components/instant-download/instant-download-button/InstantDownloadButton';

import { fetchForProtein } from '../instant-download-fetch/fetchForProtein';

import { TranscriptOptions } from '../instant-download-transcript/InstantDownloadTranscript';

import styles from './InstantDownloadProtein.scss';

type InstantDownloadProteinProps = {
  genomeId: string;
  transcriptId: string;
};

export type ProteinOptions = Pick<TranscriptOptions, 'proteinSequence' | 'cds'>;

export type ProteinOption = keyof Partial<ProteinOptions>;

export const proteinOptionsOrder: ProteinOption[] = ['proteinSequence', 'cds'];

const proteinOptionLabels: Record<keyof ProteinOptions, string> = {
  proteinSequence: 'Protein sequence',
  cds: 'CDS'
};

const QUERY = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      product_generating_contexts {
        cds {
          sequence_checksum
        }
        product {
          sequence_checksum
        }
      }
    }
  }
`;

const InstantDownloadProtein = (props: InstantDownloadProteinProps) => {
  const [isProteinSeqSelected, setProteinSeqSelected] = useState(false);
  const [isCdsSeqSelected, setCdsSeqSelected] = useState(false);
  const [shouldFetchForProtein, setShouldFetchForProtein] = useState(false);

  const { genomeId, transcriptId } = props;

  const { data, loading } = useQuery<{
    transcript: Partial<Transcript>;
  }>(QUERY, {
    variables: { genomeId, transcriptId }
  });

  const onProteinCheckboxChange = () =>
    setProteinSeqSelected(!isProteinSeqSelected);
  const onCdsCheckboxChange = () => setCdsSeqSelected(!isCdsSeqSelected);

  useEffect(() => {
    if (shouldFetchForProtein && !loading) {
      const productGeneratingContexts =
        data?.transcript.product_generating_contexts;

      if (productGeneratingContexts?.length) {
        const payload = {
          transcriptId: props.transcriptId,
          options: {
            proteinSequence: isProteinSeqSelected,
            cds: isCdsSeqSelected
          }
        };

        fetchForProtein(productGeneratingContexts[0], payload);
      }
    }

    setShouldFetchForProtein(false);
  }, [shouldFetchForProtein]);

  const onSubmit = async () => {
    setShouldFetchForProtein(true);
  };

  const isDownloadDisabled = () => !isProteinSeqSelected && !isCdsSeqSelected;

  return (
    <div className={styles.inputGroup}>
      <Checkbox
        label={proteinOptionLabels.proteinSequence}
        labelClassName={styles.checkboxLabel}
        checked={isProteinSeqSelected}
        onChange={onProteinCheckboxChange}
      />
      <Checkbox
        label={proteinOptionLabels.cds}
        labelClassName={styles.checkboxLabel}
        checked={isCdsSeqSelected}
        onChange={onCdsCheckboxChange}
      />
      <InstantDownloadButton
        className={
          isDownloadDisabled() ? styles.downloadButtonDisabled : undefined
        }
        isDisabled={isDownloadDisabled()}
        onClick={onSubmit}
      />
    </div>
  );
};

export default InstantDownloadProtein;
