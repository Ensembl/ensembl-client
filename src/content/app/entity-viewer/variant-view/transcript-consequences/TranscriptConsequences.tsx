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

import { useEffect } from 'react';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { defaultSort as defaultSortForTranscripts } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { getExpandedTranscriptConseqeuenceIds } from 'src/content/app/entity-viewer/state/variant-view/transcriptConsequenceSelectors';
import {
  collapseTranscript,
  expandTranscript
} from 'src/content/app/entity-viewer/state/variant-view/transcriptConsequenceSlice';
import { formatAlleleSequence } from '../variant-view-sidebar/overview/MainAccordion';

import useTranscriptConsequencesData, {
  type TranscriptConsequencesData
} from './useTranscriptConsequencesData';

import Panel from 'src/shared/components/panel/Panel';
import TranscriptConsequenceDetails from './transcript-consequence-details/TranscriptConsequenceDetails';
import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import { CircleLoader } from 'src/shared/components/loader';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { GeneInResponse } from '../../state/api/queries/variantTranscriptConsequencesQueries';

import styles from './TranscriptConsequences.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

type TranscriptConsequencesWithTranscriptType = NonNullable<
  TranscriptConsequencesData['transcriptConsequences']
>[number] & {
  transcript: TranscriptConsequencesData['geneData'][number]['transcripts'][number];
};

type GeneDataWithTranscriptConsequencesType = GeneInResponse & {
  transcriptConsequences: TranscriptConsequencesWithTranscriptType[];
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
          Transcript consequences
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
    return (
      <Panel>
        <div className={styles.container}>No data</div>
      </Panel>
    );
  }

  const { variant, transcriptConsequences, allele, geneData } = currentData;
  const panelHeader = (
    <PanelHeader variant={variant} genesCount={geneData.length} />
  );

  if (!transcriptConsequences) {
    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>No data</div>
      </Panel>
    );
  }

  const geneDataWithTranscriptConsequences = geneData.map((gene) => {
    const transcriptConsequencesWithTranscript: Array<
      (typeof transcriptConsequences)[number] & {
        transcript: (typeof gene)['transcripts'][number];
      }
    > = [];

    const sortedTranscripts = defaultSortForTranscripts(gene.transcripts);

    for (const transcript of sortedTranscripts) {
      // Currently, stable ids in transcript consequences returned by the api
      // are unversioned; later on, they are expected to be changed to versioned ids.
      const consequence = transcriptConsequences.find(
        (cons) =>
          cons.stable_id === transcript.stable_id ||
          cons.stable_id === transcript.unversioned_stable_id
      );

      if (consequence) {
        transcriptConsequencesWithTranscript.push({
          ...consequence,
          transcript
        });
      }
    }

    return {
      ...gene,
      transcriptConsequences: transcriptConsequencesWithTranscript
    };
  });

  return (
    <Panel header={panelHeader}>
      <GenesWithTranscriptConsequences
        {...props}
        allele={allele}
        variant={variant}
        genes={geneDataWithTranscriptConsequences}
      />
    </Panel>
  );
};

const PanelHeader = (props: {
  variant: TranscriptConsequencesData['variant'];
  genesCount: number;
}) => {
  const { variant, genesCount } = props;

  const scrollToGene = (geneIndex: number) => {
    const geneSections = document.querySelectorAll(`.${styles.geneDetails}`);
    const geneSection = geneSections[geneIndex];

    if (geneSection) {
      // this should always be the case
      geneSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.panelHeader}>
      <span className={styles.variantName}>{variant.name}</span>
      <span className={styles.variantType}>{variant.allele_type.value}</span>
      <span className={styles.colonSeparator}>:</span>
      <span className={styles.transcriptConsqTitle}>
        Transcript consequences
      </span>

      {genesCount > 1 && (
        <div className={styles.scrollToGeneSection}>
          <span className={styles.scrollToLabel}>Scroll to</span>
          <div className={styles.geneButtons}>
            {[...Array(genesCount)].map((_, index) => (
              <TextButton key={index} onClick={() => scrollToGene(index)}>
                Gene {index + 1}
              </TextButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GenesWithTranscriptConsequences = (
  props: Props & {
    allele: NonNullable<TranscriptConsequencesData['allele']>;
    variant: TranscriptConsequencesData['variant'];
    genes: GeneDataWithTranscriptConsequencesType[];
  }
) => {
  const { genomeId, variantId, activeAlleleId, allele, variant, genes } = props;
  const expandedTranscriptIds = useAppSelector((state) =>
    getExpandedTranscriptConseqeuenceIds(
      state,
      genomeId,
      variantId,
      activeAlleleId
    )
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // After initial load, before the user has interacted with any of the transcripts,
    // expandedTranscriptIds will be null.
    // Use this as a signal to expand the first transcript in each of the genes.
    if (expandedTranscriptIds === null) {
      const defaultExpandedTranscriptIds = genes.map(
        (gene) => gene.transcriptConsequences[0].stable_id
      );

      for (const transcriptId of defaultExpandedTranscriptIds) {
        dispatch(
          expandTranscript({
            genomeId,
            variantId,
            alleleId: activeAlleleId,
            transcriptId
          })
        );
      }
    }
  }, [genomeId, variantId, activeAlleleId, genes]);

  return (
    <div className={styles.container}>
      {genes.map((gene) => {
        return (
          <TranscriptConsequencesPerGene
            key={gene.stable_id}
            genomeId={genomeId}
            gene={gene}
            allele={allele}
            variantId={variantId}
            variant={variant}
            alleleId={activeAlleleId}
            transcriptConsequences={gene.transcriptConsequences}
          />
        );
      })}
    </div>
  );
};

const TranscriptConsequencesPerGene = (props: {
  genomeId: string;
  variantId: string;
  gene: TranscriptConsequencesData['geneData'][number];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  alleleId: string;
  transcriptConsequences: TranscriptConsequencesWithTranscriptType[];
}) => {
  const {
    genomeId,
    gene,
    variantId,
    variant,
    allele,
    alleleId,
    transcriptConsequences
  } = props;
  const strand = gene.slice.strand.code;
  const alleleSequence = allele.allele_sequence;
  const transcriptConsCount = transcriptConsequences.length;

  return (
    <div className={styles.geneSection}>
      <div className={classNames(styles.row, styles.header)}>
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
              {gene.symbol && (
                <span className={styles.geneSymbol}>{gene.symbol}</span>
              )}
              <span className={styles.geneStableId}>{gene.stable_id}</span>
            </div>
          </div>
        </div>
        <div className={classNames(styles.right, styles.transcriptsCount)}>
          <span>{transcriptConsCount}</span>{' '}
          <span className={styles.label}>
            {pluralise('transcript', transcriptConsCount)}
          </span>
        </div>
      </div>
      <TranscriptConsequencesList
        transcriptConsequences={transcriptConsequences}
        genomeId={genomeId}
        variantId={variantId}
        gene={gene}
        variant={variant}
        allele={allele}
        alleleId={alleleId}
      />
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

type TranscriptConsequencesListProps = {
  genomeId: string;
  variantId: string;
  transcriptConsequences: TranscriptConsequencesWithTranscriptType[];
  gene: TranscriptConsequencesData['geneData'][number];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  alleleId: string;
  variant: TranscriptConsequencesData['variant'];
};

const TranscriptConsequencesList = (props: TranscriptConsequencesListProps) => {
  const { genomeId, variantId, gene, allele, alleleId, variant } = props;
  const dispatch = useAppDispatch();
  const expandedTranscriptIds = useAppSelector((state) =>
    getExpandedTranscriptConseqeuenceIds(state, genomeId, variantId, alleleId)
  );

  const expandedIds = new Set<string>(expandedTranscriptIds || []);

  const handleTranscriptConsequenceClick = (transcriptId: string) => {
    const toggleTranscript = expandedIds.has(transcriptId)
      ? collapseTranscript
      : expandTranscript;

    dispatch(
      toggleTranscript({
        genomeId,
        variantId,
        alleleId,
        transcriptId
      })
    );
  };

  const { transcriptConsequences } = props;
  return (
    <div className={styles.transcriptConsequenceListView}>
      {transcriptConsequences.map((consequencesForSingleTranscript, index) => (
        <div key={index}>
          <div
            className={classNames(styles.row, {
              [styles.rowCollapsed]: !expandedIds.has(
                consequencesForSingleTranscript.stable_id
              ),
              [styles.rowExpanded]: expandedIds.has(
                consequencesForSingleTranscript.stable_id
              )
            })}
          >
            <div className={styles.transcriptLeftColumn}>
              <TranscriptQualityLabel
                metadata={consequencesForSingleTranscript.transcript.metadata}
              />
            </div>
            <div className={styles.middle}>
              <div className={styles.clickableTranscriptArea}>
                <div className={styles.transcriptMiddleColumn}>
                  <div>
                    <span className={styles.label}>Transcript consequence</span>
                    <span className={styles.value}>
                      {consequencesForSingleTranscript.consequences
                        .map(({ value }) => value)
                        .join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className={styles.label}>Transcript biotype</span>{' '}
                    {
                      consequencesForSingleTranscript.transcript.metadata
                        .biotype.value
                    }
                  </div>
                </div>
              </div>
            </div>
            <TextButton
              className={classNames(styles.right, styles.transcriptId)}
              onClick={() =>
                handleTranscriptConsequenceClick(
                  consequencesForSingleTranscript.stable_id
                )
              }
            >
              {consequencesForSingleTranscript.stable_id}
            </TextButton>
          </div>

          {expandedIds.has(consequencesForSingleTranscript.stable_id) ? (
            <TranscriptConsequenceDetails
              genomeId={genomeId}
              transcriptId={consequencesForSingleTranscript.stable_id}
              gene={gene}
              allele={allele}
              variant={variant}
              transcriptConsequences={consequencesForSingleTranscript}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default TranscriptConsequences;
