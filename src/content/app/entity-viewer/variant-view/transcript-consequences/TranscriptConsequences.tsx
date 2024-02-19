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
import classnames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';
import { getExpandedTranscriptConseqeuenceIds } from '../../state/variant-view/general/variantViewGeneralSelectors';
import { setExpandedTranscriptConsequenceIds } from '../../state/variant-view/general/variantViewGeneralSlice';
import { formatAlleleSequence } from '../variant-view-sidebar/overview/MainAccordion';

import useTranscriptConsequencesData, {
  type TranscriptConsequencesData
} from './useTranscriptConsequencesData';

import Panel from 'src/shared/components/panel/Panel';
import TranscriptConsequenceDetails from './transcript-consequence-details/TranscriptConsequenceDetails';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './TranscriptConsequences.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

const TranscriptConsequences = (props: Props) => {
  const { genomeId, variantId, activeAlleleId } = props;

  const { currentData, isLoading } = useTranscriptConsequencesData({
    genomeId,
    variantId,
    alleleId: activeAlleleId
  });

  if (isLoading) {
    const panelHeader = (
      <div className={styles.panelHeader}>
        <span className={styles.transcriptConsqTitle}>
          Transcript Consequences
        </span>
      </div>
    );

    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>
          <CircleLoader />
        </div>
      </Panel>
    );
  } else if (!currentData || !currentData.allele) {
    return null;
  }

  const { variant, transcriptConsequences, allele, geneData } = currentData;
  const panelHeader = <PanelHeader variant={variant} />;

  if (!transcriptConsequences) {
    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>No data</div>
      </Panel>
    );
  }

  const strand = geneData.slice.strand.code;
  const alleleSequence = allele?.allele_sequence ?? '';

  return (
    <Panel header={panelHeader}>
      <div className={styles.container}>
        <div className={classnames(styles.row, styles.header)}>
          <div className={styles.left}></div>
          <div className={styles.middle}>
            <div className={styles.headerMiddleColumn}>
              <TranscriptAllele
                referenceSequence={allele.reference_sequence}
                alleleSequence={alleleSequence}
                alleleType={allele.allele_type.value}
                strand={strand}
              />
              <div className={styles.geneDetails}>
                <span className={styles.label}>Gene</span>
                {geneData.symbol && (
                  <span className={styles.geneSymbol}>{geneData.symbol}</span>
                )}
                <span className={styles.geneStableId}>
                  {geneData.stable_id}
                </span>
              </div>
            </div>
          </div>
          <div className={classnames(styles.right, styles.headerRightColumn)}>
            <span>{`${transcriptConsequences.length} transcripts`}</span>
          </div>
        </div>
        <TranscriptConsquencesTable
          transcriptConsequences={transcriptConsequences}
          genomeId={genomeId}
          variantId={variantId}
          gene={geneData}
          variant={variant}
          allele={allele}
        />
      </div>
    </Panel>
  );
};

const PanelHeader = (props: {
  variant: TranscriptConsequencesData['variant'];
}) => {
  const { variant } = props;

  return (
    <div className={styles.panelHeader}>
      <span className={styles.variantName}>{variant.name}</span>
      <span className={styles.variantType}>{variant.allele_type.value}</span>
      <span className={styles.colonSeparator}>:</span>
      <span className={styles.transcriptConsqTitle}>
        Transcript Consequences
      </span>
    </div>
  );
};

const TranscriptAllele = ({
  referenceSequence,
  alleleSequence,
  alleleType,
  strand
}: {
  referenceSequence: string;
  alleleSequence: string;
  alleleType: string;
  strand: 'forward' | 'reverse';
}) => {
  if (alleleType === 'deletion') {
    // deletion is represented as a sequence of dashes
    // of the same lengh as the deleted fragment
    const characters = referenceSequence
      .split('')
      .slice(1) // remove anchor base
      .map(() => '-')
      .join('');

    return (
      <div className={styles.transcriptAllele}>
        <span className={styles.label}>Transcript strand allele</span>
        <span className={styles.value}>{formatAlleleSequence(characters)}</span>
      </div>
    );
  } else if (strand === 'forward') {
    return (
      <div className={styles.transcriptAllele}>
        <span className={styles.label}>Transcript strand allele</span>
        <span className={styles.value}>
          {formatAlleleSequence(alleleSequence)}
        </span>
      </div>
    );
  } else {
    const reverseComplement = getReverseComplement(alleleSequence);

    return (
      <div className={styles.transcriptAllele}>
        <div>
          <span className={styles.label}>Transcript strand allele</span>
          <span className={styles.value}>
            {formatAlleleSequence(reverseComplement)}
          </span>
        </div>
        <div>
          <span className={styles.label}>Reference strand allele</span>
          <span className={styles.value}>
            {formatAlleleSequence(alleleSequence)}
          </span>
        </div>
      </div>
    );
  }
};

// FIXME: remove this component?
const TranscriptConsquencesTable = (props: {
  genomeId: string;
  variantId: string;
  transcriptConsequences: NonNullable<
    TranscriptConsequencesData['transcriptConsequences']
  >;
  gene: TranscriptConsequencesData['geneData'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  variant: TranscriptConsequencesData['variant'];
}) => {
  return <TranscriptConsequencesList {...props} />;
};

type TranscriptConsequencesListProps = {
  genomeId: string;
  variantId: string;
  transcriptConsequences: NonNullable<
    TranscriptConsequencesData['transcriptConsequences']
  >;
  gene: TranscriptConsequencesData['geneData'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  variant: TranscriptConsequencesData['variant'];
};

const TranscriptConsequencesList = (props: TranscriptConsequencesListProps) => {
  const { genomeId, variantId, gene, allele, variant } = props;
  const expandedTranscriptIds = useAppSelector((state) =>
    getExpandedTranscriptConseqeuenceIds(state, genomeId, variantId)
  );
  const expandedIds = new Set<string>(expandedTranscriptIds);
  const dispatch = useAppDispatch();

  const handleTranscriptConsequenceClick = (transcriptId: string) => {
    if (expandedIds.has(transcriptId)) {
      expandedIds.delete(transcriptId);
    } else {
      expandedIds.add(transcriptId);
    }

    dispatch(
      setExpandedTranscriptConsequenceIds({
        genomeId,
        variantId,
        expandedTranscriptConseqeuenceIds: [...expandedIds.values()]
      })
    );
  };

  const { transcriptConsequences } = props;
  return (
    <div className={styles.transcriptConsequenceListView}>
      {transcriptConsequences.map((transcript, index) => (
        <div key={index}>
          <div className={styles.row}>
            {/* <TranscriptQualityLabel metadata={props.transcript.metadata} /> */}
            <div className={styles.transcriptLeftColumn}></div>
            <div className={styles.middle}>
              <div className={styles.clickableTranscriptArea}>
                <div className={styles.transcriptMiddleColumn}>
                  <div>
                    <span className={styles.label}>
                      Transcript variant type
                    </span>
                    <span className={styles.value}>
                      {transcript.consequences
                        .map(({ value }) => value)
                        .join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className={styles.label}>Transcript biotype</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.right}
              onClick={() =>
                handleTranscriptConsequenceClick(transcript.feature_stable_id)
              }
            >
              <div className={styles.transcriptId}>
                {transcript.feature_stable_id}
              </div>
            </div>
          </div>

          {expandedTranscriptIds.includes(transcript.feature_stable_id) ? (
            <TranscriptConsequenceDetails
              genomeId={genomeId}
              transcriptId={transcript.feature_stable_id}
              gene={gene}
              allele={allele}
              variant={variant}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default TranscriptConsequences;
