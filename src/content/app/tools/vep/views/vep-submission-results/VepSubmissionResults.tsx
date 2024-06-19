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

import { useVepResultsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import { Table, ColumnHead } from 'src/shared/components/table';
import VariantConsequence from 'src/shared/components/variant-consequence/VariantConsequence';
import VepResultsGene from './components/vep-results-gene/VepResultsGene';
import VepResultsLocation from './components/vep-results-location/VepResultsLocation';

import type {
  VEPResultsResponse,
  AlternativeVariantAllele,
  PredictedTranscriptConsequence
} from 'src/content/app/tools/vep/types/vepResultsResponse';

import styles from './VepSubmissionResults.module.css';

/**
 * - Request vep results
 * - Add unique id to variants after they are requested (to use for keys)
 * - Draw the table
 *   - Population frequencies column is optional
 *   - predicted molecular consequences
 *     - transcripts can expand
 *   - Consider pagination (should be part of url?)
 *
 * - Special elements
 *  - Location
 *    - Format start coordinate using commas
 *    - Add a ViewInApp tooltip
 *  - Gene
 *    - Symbol in bold if present
 *    - Stable id with "show in app" popup
 * - Make the table scrollable
 * - Collapse rows
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
  variants: VEPResultsResponse['variants'];
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
  variant: VEPResultsResponse['variants'][number];
}) => {
  // group transcript consequences by gene
  // const variant = updateVariant(props.variant);

  const transcriptConsequencesForTable = getTranscriptConsequences(
    props.variant
  );

  // if (props.variant.location.start === 378149) {
  //   console.log(props.variant);
  //   console.log(transcriptConsequencesForTable);
  // }

  return transcriptConsequencesForTable.map((cons, index) => (
    <tr key={index}>
      {cons.variant && (
        <>
          <td
            rowSpan={
              cons.variant.rowspan > 1 ? cons.variant.rowspan : undefined
            }
            style={{ verticalAlign: 'top' }}
          >
            <VariantName variant={cons.variant} />
          </td>
          <td
            rowSpan={
              cons.variant.rowspan > 1 ? cons.variant.rowspan : undefined
            }
            style={{ verticalAlign: 'top' }}
          >
            {cons.variant.referenceAllele}
          </td>
          <td
            rowSpan={
              cons.variant.rowspan > 1 ? cons.variant.rowspan : undefined
            }
            style={{ verticalAlign: 'top' }}
          >
            <VepResultsLocation
              genomeId="grch38"
              location={cons.variant.location}
            />
          </td>
        </>
      )}
      {cons.alternativeAllele && (
        <td
          rowSpan={
            cons.alternativeAllele.rowspan > 1
              ? cons.alternativeAllele.rowspan
              : undefined
          }
          style={{ verticalAlign: 'top' }}
        >
          {cons.alternativeAllele.allele_sequence}
        </td>
      )}
      {cons.gene && (
        <td
          rowSpan={cons.gene.rowspan > 1 ? cons.gene.rowspan : undefined}
          style={{ verticalAlign: 'top' }}
        >
          <VepResultsGene {...cons.gene} genomeId="grch38" />
        </td>
      )}
      <td style={{ verticalAlign: 'top' }}>
        <VariantTranscript transcript={cons} />
      </td>
      <td>
        <VariantConsequences consequences={cons.consequences} />
      </td>
    </tr>
  ));
};

const VariantName = (props: {
  variant: NonNullable<TranscriptConsequenceForTable['variant']>;
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

type VariantAffectedGene = {
  stable_id: string;
  symbol: string | null;
  transcripts: PredictedTranscriptConsequence[];
};

type UpdatedAlternativeAllele = AlternativeVariantAllele & {
  genes: VariantAffectedGene[];
};

const updateVariant = (variant: VEPResultsResponse['variants'][number]) => {
  const alternativeAlleles: UpdatedAlternativeAllele[] =
    variant.alternative_alleles.map((allele) => {
      const genesMap = new Map<string, VariantAffectedGene>();
      // NOTE: typescript 5.5 should be able to infer the PredictedTranscriptConsequence type on its own
      const transcriptConsequences =
        allele.predicted_molecular_consequences.filter(
          (cons) => cons.feature_type === 'transcript'
        ) as PredictedTranscriptConsequence[];

      // make sure canonical transcripts are the first
      transcriptConsequences.sort((a, b) => {
        const aScore = a.is_canonical ? 0 : 1;
        const bScore = b.is_canonical ? 0 : 1;
        return aScore - bScore;
      });

      for (const consequence of transcriptConsequences) {
        const geneId = consequence.gene_stable_id;
        const storedGene = genesMap.get(geneId);

        if (storedGene) {
          storedGene.transcripts.push(consequence);
        } else {
          const gene: VariantAffectedGene = {
            stable_id: geneId,
            symbol: consequence.gene_symbol,
            transcripts: [consequence]
          };
          genesMap.set(geneId, gene);
        }
      }

      return {
        ...allele,
        genes: [...genesMap.values()]
      };
    });

  return {
    ...variant,
    alternative_alleles: alternativeAlleles
  };
};

type TranscriptConsequenceForTable = PredictedTranscriptConsequence & {
  gene: {
    stableId: string;
    symbol: string | null;
    strand: 'forward' | 'reverse';
    rowspan: number;
  } | null;
  alternativeAllele: {
    allele_sequence: string;
    rowspan: number;
  } | null;
  variant: {
    name: string;
    referenceAllele: string;
    allele_type: string;
    location: {
      region_name: string;
      start: number;
    };
    rowspan: number;
  } | null;
};

const getTranscriptConsequences = (
  variant: VEPResultsResponse['variants'][number]
): TranscriptConsequenceForTable[] => {
  const result: TranscriptConsequenceForTable[] = [];
  const updatedVariant = updateVariant(variant);

  for (const altAllele of updatedVariant.alternative_alleles) {
    // FIXME: should not just throw away all other consequences
    // also, manual type casting will be unnecessary in typescript 5.5

    for (let geneIndex = 0; geneIndex < altAllele.genes.length; geneIndex++) {
      const gene = altAllele.genes[geneIndex];

      for (let i = 0; i < gene.transcripts.length; i++) {
        const transcriptConsequence = gene.transcripts[i];
        const consequenceForTable: TranscriptConsequenceForTable = {
          ...transcriptConsequence,
          gene: null,
          alternativeAllele: null,
          variant: null
        };
        if (!result.length) {
          consequenceForTable.variant = {
            name: variant.name,
            allele_type: variant.allele_type,
            referenceAllele: variant.reference_allele.allele_sequence,
            location: variant.location,
            rowspan: getTotalRowsForVariant(updatedVariant)
          };
        }
        if (geneIndex === 0 && i === 0) {
          consequenceForTable.alternativeAllele = {
            allele_sequence: altAllele.allele_sequence,
            rowspan: getTotalRowsForAltAllele(altAllele)
          };
        }
        if (i === 0) {
          consequenceForTable.gene = {
            stableId: gene.stable_id,
            symbol: gene.symbol,
            strand: transcriptConsequence.strand,
            rowspan: Math.max(gene.transcripts.length, 1)
          };
        }

        result.push(consequenceForTable);
      }
    }
  }

  return result;
};

const getTotalRowsForVariant = (variant: ReturnType<typeof updateVariant>) => {
  let count = 0;

  for (const altAllele of variant.alternative_alleles) {
    for (const gene of altAllele.genes) {
      for (let i = 0; i < gene.transcripts.length; i++) {
        count++;
      }
    }
  }

  return Math.max(count, 1);
};

const getTotalRowsForAltAllele = (
  allele: ReturnType<typeof updateVariant>['alternative_alleles'][number]
) => {
  let count = 0;

  for (const gene of allele.genes) {
    for (let i = 0; i < gene.transcripts.length; i++) {
      count++;
    }
  }

  return Math.max(count, 1);
};

export default VepSubmissionResults;
