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

import React from 'react';
import classNames from 'classnames';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import useTranscriptDetails from '../useTranscriptDetails';

import TranscriptVariantDiagram from '../transcript-variant-diagram/TranscriptVariantDiagram';
import TranscriptVariantGenomicSequence from '../transcript-variant-genomic-sequence/TranscriptVariantGenomicSequence';
import { CircleLoader } from 'src/shared/components/loader';

import type { TranscriptConsequencesData } from 'src/content/app/entity-viewer/variant-view/transcript-consequences/useTranscriptConsequencesData';

import commonStyles from '../TranscriptConsequences.module.css';
import styles from './TranscriptConsequenceDetails.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
};

const TranscriptConsequenceDetails = (props: Props) => {
  const { gene, variant, allele } = props;

  const { currentData: transcriptDetailsData, isLoading } =
    useTranscriptDetails(props);

  const transcript = transcriptDetailsData?.transcriptData;
  const genomicRegionData = transcriptDetailsData?.genomicRegionData;

  if (isLoading) {
    return (
      <div className={commonStyles.row}>
        <div className={commonStyles.middle}>
          <CircleLoader />
        </div>
      </div>
    );
  } else if (!transcript || !genomicRegionData) {
    return null;
  }

  const strand = gene.slice.strand.code;

  return (
    <>
      <div className={commonStyles.row}>
        <div className={commonStyles.left}>Genomic</div>
        <div className={commonStyles.middle}>
          <VariantPositionInTranscript
            distanceToTranscriptStart={
              genomicRegionData.variantToTranscriptStartDistance
            }
            referenceAlleleSequence={genomicRegionData.referenceAlleleSequence}
            transcriptLength={transcript.slice.location.length}
          />
        </div>
      </div>

      <div className={commonStyles.row}>
        <div className={commonStyles.middle}>
          <TranscriptVariantGenomicSequence
            {...genomicRegionData}
            variantSequence={genomicRegionData.referenceAlleleSequence}
            variantType={variant.allele_type.value}
            alleleType={allele.allele_type.value}
          />
        </div>
        <div className={commonStyles.right}>
          <span className={styles.smallLight}>
            {strand === 'forward' ? 'forward strand' : 'reverse complement'}
          </span>
        </div>
      </div>

      <div className={commonStyles.row}>
        <div
          className={classNames(
            commonStyles.left,
            styles.transcriptDiagramLabel
          )}
        >
          Transcript position in gene
        </div>
        <div className={commonStyles.middle}>
          <TranscriptVariantDiagram
            gene={gene}
            transcript={transcript}
            variant={variant}
          />
        </div>
      </div>
    </>
  );
};

const VariantPositionInTranscript = ({
  distanceToTranscriptStart,
  referenceAlleleSequence,
  transcriptLength
}: {
  distanceToTranscriptStart: number;
  referenceAlleleSequence: string;
  transcriptLength: number;
}) => {
  const variantLength = referenceAlleleSequence.length;
  const variantStartInTranscript = distanceToTranscriptStart + 1;
  const variantEndInTranscript = Math.max(
    variantStartInTranscript + variantLength - 1,
    variantStartInTranscript
  );

  const formattedVarStart = formatNumber(variantStartInTranscript);
  const formattedVarEnd = formatNumber(variantEndInTranscript);
  const formattedTranscriptLength = formatNumber(transcriptLength);

  return (
    <span>
      <span className={styles.smallLight}>Position in transcript</span>{' '}
      <span className={styles.small}>
        {variantStartInTranscript === variantEndInTranscript
          ? formattedVarStart
          : `${formattedVarStart} - ${formattedVarEnd}`}
      </span>{' '}
      <span className={styles.smallLight}>of {formattedTranscriptLength}</span>
    </span>
  );
};

export default TranscriptConsequenceDetails;
