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
import { addRelativeLocationInCDSToExons } from 'src/shared/helpers/exon-helpers/exonHelpers';

import useTranscriptDetails from '../useTranscriptDetails';

import TranscriptVariantDiagram from '../transcript-variant-diagram/TranscriptVariantDiagram';
import TranscriptVariantGenomicSequence from '../transcript-variant-genomic-sequence/TranscriptVariantGenomicSequence';
import TranscriptVariantCDS from '../transcript-variant-cds/TranscriptVariantCDS';
import { CircleLoader } from 'src/shared/components/loader';

import type { TranscriptConsequencesData } from 'src/content/app/entity-viewer/variant-view/transcript-consequences/useTranscriptConsequencesData';
import type { PredictedMolecularConsequenceInResponse } from 'src/content/app/entity-viewer/state/api/queries/variantPredictedMolecularConsequencesQuery';

import commonStyles from '../TranscriptConsequences.module.css';
import styles from './TranscriptConsequenceDetails.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'][number];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  transcriptConsequences: PredictedMolecularConsequenceInResponse;
};

const TranscriptConsequenceDetails = (props: Props) => {
  const { gene, variant, allele, transcriptConsequences } = props;

  const { currentData: transcriptDetailsData, isLoading } =
    useTranscriptDetails(props);

  const transcript = transcriptDetailsData?.transcriptData;
  const genomicRegionData = transcriptDetailsData?.genomicRegionData;

  if (isLoading) {
    const middleColumnClasses = classNames(
      commonStyles.middle,
      styles.loaderContainer
    );

    return (
      <div className={commonStyles.row}>
        <div className={middleColumnClasses}>
          <CircleLoader />
        </div>
      </div>
    );
  } else if (!transcript || !genomicRegionData) {
    return null;
  }

  const strand = gene.slice.strand.code;
  const cds = transcript.product_generating_contexts[0]?.cds;

  return (
    <>
      {cds && transcriptConsequences.cds_location && (
        <CDSSection
          exons={transcript.spliced_exons}
          cds={cds}
          allele={{
            type: allele.allele_type.value,
            relativeLocation: transcriptConsequences.cds_location
          }}
        />
      )}

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
        <div className={classNames(commonStyles.middle, styles.spacingBottom)}>
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

type TranscriptDetailsData = NonNullable<
  ReturnType<typeof useTranscriptDetails>['currentData']
>['transcriptData'];

const CDSSection = (props: {
  exons: TranscriptDetailsData['spliced_exons'];
  cds: NonNullable<
    TranscriptDetailsData['product_generating_contexts'][number]['cds']
  >;
  allele: {
    type: string;
    relativeLocation: NonNullable<
      PredictedMolecularConsequenceInResponse['cds_location']
    >;
  };
}) => {
  const { exons, cds, allele } = props;

  // NOTE: instead of using the function below that tries to calculate exon locations in CDS,
  // the api should report this to the client.
  const exonsWithinCDS = addRelativeLocationInCDSToExons({
    exons,
    cds
  }).filter((exon) => Boolean(exon.relative_location_in_cds));

  const variantStartInCDS = allele.relativeLocation.start;
  const variantEndInCDS = allele.relativeLocation.end;
  const singleVariantCoord = variantStartInCDS || (variantEndInCDS as number); // we are promised that there will always be either a start or an end

  let variantLocationString: string;

  if (allele.type === 'insertion') {
    // just show the start coordinate for an insertion; it should be available
    variantLocationString = formatNumber(variantStartInCDS as number);
  } else if (variantStartInCDS === variantEndInCDS) {
    // start and end shouldn't both be null; which means that they both are the same number
    variantLocationString = formatNumber(variantStartInCDS as number);
  } else if (variantStartInCDS && variantEndInCDS) {
    // both start and end are present, and are different from each other
    variantLocationString = `${formatNumber(variantStartInCDS)} - ${formatNumber(variantEndInCDS)}`;
  } else {
    // one of the coordinates is unknown; show the known one
    variantLocationString = formatNumber(singleVariantCoord);
  }

  return (
    <>
      <div className={commonStyles.row}>
        <div className={commonStyles.left}>CDS</div>
        <div className={commonStyles.middle}>
          <span className={styles.smallLight}>Position in CDS</span>{' '}
          <span className={styles.small}>{variantLocationString}</span>{' '}
          <span className={styles.smallLight}>
            of {formatNumber(cds.nucleotide_length)}
          </span>
        </div>
      </div>

      <div className={commonStyles.row}>
        <div className={commonStyles.middle}>
          <TranscriptVariantCDS
            exons={exonsWithinCDS}
            cds={cds}
            allele={props.allele}
          />
        </div>
      </div>
    </>
  );
};

export default TranscriptConsequenceDetails;
