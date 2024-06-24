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

import { useMemo } from 'react';

import type {
  VepResultsResponse,
  AlternativeVariantAllele,
  PredictedMolecularConsequence,
  PredictedTranscriptConsequence,
  PredictedIntergenicConsequence
} from 'src/content/app/tools/vep/types/vepResultsResponse';

type VariantInResponse = VepResultsResponse['variants'][number];

type Params = {
  variant: VariantInResponse;
  showAllTranscripts: boolean;
};

/**
 * The data fetched from the api is shaped hierarchically,
 * where top-level items are variants, each of which has an array of alt alleles,
 * each of which has an array of predicted consequences...
 *
 * The purpose of this hook is to reshape the data such as to represent a table.
 * The data is transformed into an array in which any given element
 * is associated with a single table row.
 * The most appropriate candidate for row-level elements
 * seems to be predicted molecular consequences of a variant allele.
 */
const useVepVariantTabularData = (params: Params) => {
  const { variant, showAllTranscripts } = params;

  const tabularData = useMemo(() => {
    return getTabularData(params);
  }, [variant, showAllTranscripts]);

  return tabularData;
};

type VariantAffectedGene = {
  stable_id: string;
  symbol: string | null;
  transcripts: PredictedTranscriptConsequence[];
  transcriptsCount: number;
};

type UpdatedAlternativeAllele = AlternativeVariantAllele & {
  genes: VariantAffectedGene[];
  intergenicConsequences: PredictedIntergenicConsequence[];
};

type ReshapedVariant = Omit<VariantInResponse, 'alternative_alleles'> & {
  alternative_alleles: UpdatedAlternativeAllele[];
};

/**
 * - Group transcripts belonging to the same gene, and extract gene information
 */
const reshapeVariant = ({
  variant,
  onlyCanonicalTranscripts
}: {
  variant: VariantInResponse;
  onlyCanonicalTranscripts: boolean;
}) => {
  const alternativeAlleles: UpdatedAlternativeAllele[] =
    variant.alternative_alleles.map((allele) => {
      let {
        transcriptConsequences,
        intergenicConsequences // eslint-disable-line prefer-const
      } = groupAlleleConsequencesByType(
        allele.predicted_molecular_consequences
      );

      const allTranscriptConsequences = transcriptConsequences;

      const genesMap = new Map<string, VariantAffectedGene>();

      if (onlyCanonicalTranscripts) {
        transcriptConsequences = transcriptConsequences.filter(
          (cons) => cons.is_canonical
        );
      } else {
        // make sure canonical transcripts go first
        transcriptConsequences.sort((a, b) => {
          const aScore = a.is_canonical ? 0 : 1;
          const bScore = b.is_canonical ? 0 : 1;
          return aScore - bScore;
        });
      }

      for (const consequence of transcriptConsequences) {
        const geneId = consequence.gene_stable_id;
        const visitedGene = genesMap.get(geneId);

        if (visitedGene) {
          visitedGene.transcripts.push(consequence);
        } else {
          const gene: VariantAffectedGene = {
            stable_id: geneId,
            symbol: consequence.gene_symbol,
            transcripts: [consequence],
            transcriptsCount: getTotalTranscriptsCountForGene({
              transcriptConsequences: allTranscriptConsequences,
              geneId
            })
          };
          genesMap.set(geneId, gene);
        }
      }

      return {
        ...allele,
        genes: [...genesMap.values()],
        intergenicConsequences
      };
    });

  return {
    ...variant,
    alternative_alleles: alternativeAlleles
  };
};

const getTotalTranscriptsCountForGene = ({
  transcriptConsequences,
  geneId
}: {
  transcriptConsequences: PredictedTranscriptConsequence[];
  geneId: string;
}) => {
  let count = 0;
  for (let i = 0; i < transcriptConsequences.length; i++) {
    if (transcriptConsequences[i].gene_stable_id === geneId) {
      count++;
    }
  }
  return count;
};

type ConsequenceGroups = {
  transcriptConsequences: PredictedTranscriptConsequence[];
  intergenicConsequences: PredictedIntergenicConsequence[];
};

const groupAlleleConsequencesByType = (
  consequences: PredictedMolecularConsequence[]
) => {
  const consequenceGroups: ConsequenceGroups = {
    transcriptConsequences: [],
    intergenicConsequences: []
  };

  for (const consequence of consequences) {
    if (consequence.feature_type === 'transcript') {
      consequenceGroups.transcriptConsequences.push(consequence);
    } else if (consequence.feature_type === null) {
      consequenceGroups.intergenicConsequences.push(consequence);
    }
  }

  return consequenceGroups;
};

export type VepResultsTableRowData = {
  consequence:
    | PredictedIntergenicConsequence
    | (PredictedTranscriptConsequence & {
        totalTranscriptsCount: number;
        isLastTranscript: boolean;
      });
  gene: {
    stableId: string;
    symbol: string | null;
    strand: 'forward' | 'reverse';
    transcriptsCount: number;
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

/**
 * NOTE: this function will need updating after regulatory features are added
 */
const getTabularData = ({
  variant,
  showAllTranscripts
}: {
  variant: VariantInResponse;
  showAllTranscripts: boolean;
}): VepResultsTableRowData[] => {
  const result: VepResultsTableRowData[] = [];
  const reshapedVariant = reshapeVariant({
    variant,
    onlyCanonicalTranscripts: !showAllTranscripts
  });

  // First, start by creating table row data for transcript consequences of each of variant's alt alleles
  for (const altAllele of reshapedVariant.alternative_alleles) {
    for (let geneIndex = 0; geneIndex < altAllele.genes.length; geneIndex++) {
      const gene = altAllele.genes[geneIndex];

      for (let i = 0; i < gene.transcripts.length; i++) {
        const transcriptConsequence = gene.transcripts[i];
        const tableRowData: VepResultsTableRowData = {
          consequence: {
            ...transcriptConsequence,
            totalTranscriptsCount: gene.transcriptsCount,
            isLastTranscript: i === gene.transcripts.length - 1
          },
          gene: null,
          alternativeAllele: null,
          variant: null
        };
        if (!result.length) {
          tableRowData.variant = {
            name: variant.name,
            allele_type: variant.allele_type,
            referenceAllele: variant.reference_allele.allele_sequence,
            location: variant.location,
            rowspan: getTotalRowsForVariant(reshapedVariant)
          };
        }
        if (geneIndex === 0 && i === 0) {
          tableRowData.alternativeAllele = {
            allele_sequence: altAllele.allele_sequence,
            rowspan: getTotalRowsForAltAllele(altAllele)
          };
        }
        if (i === 0) {
          tableRowData.gene = {
            stableId: gene.stable_id,
            symbol: gene.symbol,
            strand: transcriptConsequence.strand,
            transcriptsCount: gene.transcriptsCount,
            rowspan: Math.max(gene.transcripts.length, 1)
          };
        }

        result.push(tableRowData);
      }
    }

    // Run the loop for intergenic consequences after the loop for transcript consequences
    // Note: unless something went very wrong, it should be impossible for an alt allele
    // to have both transcript consequences and intergenic consequences at the same time.
    for (let i = 0; i < altAllele.intergenicConsequences.length; i++) {
      const intergenicConsequence = altAllele.intergenicConsequences[i];

      const tableRowData: VepResultsTableRowData = {
        consequence: intergenicConsequence,
        gene: null,
        alternativeAllele: null,
        variant: null
      };

      if (i === 0) {
        const variantForRow = {
          name: variant.name,
          allele_type: variant.allele_type,
          referenceAllele: variant.reference_allele.allele_sequence,
          location: variant.location,
          rowspan: getTotalRowsForVariant(reshapedVariant)
        };
        const altAlleleForRow = {
          allele_sequence: altAllele.allele_sequence,
          rowspan: getTotalRowsForAltAllele(altAllele)
        };

        tableRowData.variant = variantForRow;
        tableRowData.alternativeAllele = altAlleleForRow;
      }

      result.push(tableRowData);
    }
  }

  return result;
};

// Note: the number of transcripts in variant->alternative_allele->gene
// will depend on whether the list of transcripts is collapsed or expanded
// (see how transcripts are filtered out in the reshapeVariant function)
const getTotalRowsForVariant = (variant: ReshapedVariant) => {
  let count = 0;

  for (const altAllele of variant.alternative_alleles) {
    for (const gene of altAllele.genes) {
      for (let i = 0; i < gene.transcripts.length; i++) {
        count++;
      }
    }
    for (let i = 0; i < altAllele.intergenicConsequences.length; i++) {
      count++;
    }
  }

  return Math.max(count, 1);
};

// Note: the number of transcripts in allele->gene
// will depend on whether the list of transcripts is collapsed or expanded
// (see how transcripts are filtered out in the reshapeVariant function)
const getTotalRowsForAltAllele = (allele: UpdatedAlternativeAllele) => {
  let count = 0;

  for (const gene of allele.genes) {
    for (let i = 0; i < gene.transcripts.length; i++) {
      count++;
    }
  }
  for (let i = 0; i < allele.intergenicConsequences.length; i++) {
    count++;
  }

  return Math.max(count, 1);
};

export default useVepVariantTabularData;
