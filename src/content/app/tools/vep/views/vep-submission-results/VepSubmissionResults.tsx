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

import { useVepResultsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import useVepVariantTabularData, {
  type VepResultsTableRowData
} from './useVepVariantTabularData';

import { Table, ColumnHead } from 'src/shared/components/table';
import VariantConsequence from 'src/shared/components/variant-consequence/VariantConsequence';
import VepResultsGene from './components/vep-results-gene/VepResultsGene';
import VepResultsLocation from './components/vep-results-location/VepResultsLocation';
import Pill from 'src/shared/components/pill/Pill';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

import styles from './VepSubmissionResults.module.css';

/**
 * TODO:
 * - Add unique id to variants after they are requested (to use for keys)
 * - Consider pagination (should it be part of url?)
 */

const VepSubmissionResults = () => {
  const { currentData: vepResults } = useVepResultsQuery();

  return (
    <div className={styles.container}>
      <div>Vep analysis</div>
      <div className={styles.resultsBox}>
        <div>Area above the table</div>
        {vepResults && <VepResultsTable variants={vepResults.variants} />}
      </div>
    </div>
  );
};

const VepResultsTable = (props: {
  variants: VepResultsResponse['variants'];
}) => {
  const { variants } = props;

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Variant</ColumnHead>
          <ColumnHead>Ref</ColumnHead>
          <ColumnHead>Location</ColumnHead>
          <ColumnHead>Alt allele</ColumnHead>
          <ColumnHead>Genes</ColumnHead>
          <ColumnHead>Transcripts</ColumnHead>
          <ColumnHead>Consequences</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {/* Use something more reliable for key than index */}
        {variants.map((variant, index) => (
          <VariantRow variant={variant} key={index} />
        ))}
      </tbody>
    </Table>
  );
};

const VariantRow = (props: {
  variant: VepResultsResponse['variants'][number];
}) => {
  const [showAllTranscripts, setShowAllTranscripts] = useState(false);

  const tabularData = useVepVariantTabularData({
    variant: props.variant,
    showAllTranscripts
  });

  const toggleExpandedTranscripts = () => {
    setShowAllTranscripts(!showAllTranscripts);
  };

  return tabularData.map((row, index) => (
    <tr key={index}>
      {row.variant && (
        <>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            <VariantName variant={row.variant} />
          </td>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            {row.variant.referenceAllele}
          </td>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            <VepResultsLocation
              genomeId="grch38"
              location={row.variant.location}
            />
          </td>
        </>
      )}
      {row.alternativeAllele && (
        <td
          rowSpan={
            row.alternativeAllele.rowspan > 1
              ? row.alternativeAllele.rowspan
              : undefined
          }
        >
          {row.alternativeAllele.allele_sequence}
        </td>
      )}
      <GeneTableCell row={row} />
      <TranscriptTableCell
        row={row}
        isCollapsed={!showAllTranscripts}
        toggleExpanded={toggleExpandedTranscripts}
      />
      <td>
        <VariantConsequences consequences={row.consequence.consequences} />
      </td>
    </tr>
  ));
};

const GeneTableCell = (props: { row: VepResultsTableRowData }) => {
  const { row } = props;

  if (row.gene) {
    return (
      <td rowSpan={row.gene.rowspan > 1 ? row.gene.rowspan : undefined}>
        <VepResultsGene {...row.gene} genomeId="grch38" />
      </td>
    );
  } else if (row.consequence.feature_type === null) {
    // for an intergenic consequence, render an empty cell
    return <td />;
  } else {
    return null;
  }
};

const TranscriptTableCell = (props: {
  row: VepResultsTableRowData;
  isCollapsed: boolean;
  toggleExpanded: () => void;
}) => {
  const { row, isCollapsed, toggleExpanded } = props;

  if (row.consequence.feature_type === 'transcript') {
    const { totalTranscriptsCount, isLastTranscript } = row.consequence;

    return (
      <td>
        <VariantTranscript transcript={row.consequence} />
        {isCollapsed && totalTranscriptsCount > 1 && (
          <div>
            <button onClick={toggleExpanded} className={styles.expandButton}>
              <Pill>+ {totalTranscriptsCount - 1}</Pill>
              <span className={styles.smallLight}>transcripts</span>
            </button>
          </div>
        )}
        {!isCollapsed && totalTranscriptsCount > 1 && isLastTranscript && (
          <div>
            <CloseButton
              onClick={toggleExpanded}
              className={styles.collapseButton}
            />
          </div>
        )}
      </td>
    );
  } else {
    return <td />;
  }
};

const VariantName = (props: {
  variant: NonNullable<VepResultsTableRowData['variant']>;
}) => {
  return (
    <>
      <div>{props.variant.name}</div>
      <div className={styles.smallLight}>{props.variant.allele_type}</div>
    </>
  );
};

const VariantTranscript = (props: {
  transcript: {
    stable_id: string;
    biotype: string;
  };
}) => {
  return (
    <>
      <div>{props.transcript.stable_id}</div>
      <div className={styles.smallLight}>{props.transcript.biotype}</div>
    </>
  );
};

const VariantConsequences = ({ consequences }: { consequences: string[] }) => {
  return consequences.map((consequence) => (
    <div key={consequence}>
      <VariantConsequence consequence={consequence} />
    </div>
  ));
};

export default VepSubmissionResults;
