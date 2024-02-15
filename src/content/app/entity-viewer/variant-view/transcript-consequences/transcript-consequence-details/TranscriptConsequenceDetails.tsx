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

import useTranscriptDetails from '../useTranscriptDetails';

import TranscriptVariantDiagram from '../transcript-variant-diagram/TranscriptVariantDiagram';
import { CircleLoader } from 'src/shared/components/loader';

import type { TranscriptConsequencesData } from 'src/content/app/entity-viewer/variant-view/transcript-consequences/useTranscriptConsequencesData';

import commonStyles from '../TranscriptConsequences.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
};

const TranscriptConsequenceDetails = (props: Props) => {
  const { gene, variant } = props;

  const { currentData: transcriptDetailsData, isLoading } =
    useTranscriptDetails(props);

  const transcript = transcriptDetailsData?.transcriptData;

  if (isLoading) {
    return (
      <div className={commonStyles.row}>
        <div className={commonStyles.middle}>
          <CircleLoader />;
        </div>
      </div>
    );
  } else if (!transcript) {
    return null;
  }

  return (
    <>
      <div className={commonStyles.row}>
        <div className={commonStyles.left}>Genomic</div>
        <div className={commonStyles.middle}></div>
      </div>

      <div className={commonStyles.row}>
        <div className={commonStyles.left}>Transcript</div>
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

export default TranscriptConsequenceDetails;
