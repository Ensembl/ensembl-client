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

/**
 * The UI allows the user to expand or collapse transcripts
 * that are the part of transcript consequences of an alternative allele.
 * Hierarchically, a transcript belongs to a gene;
 * and both are within the scope of an alternative allele.
 * This is reflected in the ExpandedTranscriptsPath below.
 */
export type ExpandedTranscriptsPath = {
  altAllele: string;
  geneId: string;
};

type Params = {
  variant: VariantInResponse;
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
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
  const { variant, expandedTranscriptPaths } = params;

  const tabularData = useMemo(() => {
    return getTabularData(params);
  }, [variant, expandedTranscriptPaths]);

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
  expandedTranscriptPaths
}: {
  variant: VariantInResponse;
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
}) => {
  const alternativeAlleles: UpdatedAlternativeAllele[] =
    variant.alternative_alleles.map((allele) => {
      const { transcriptConsequences, intergenicConsequences } =
        groupAlleleConsequencesByType(allele.predicted_molecular_consequences);

      const genes = buildGeneData({
        transcriptConsequences,
        altAllele: allele,
        expandedTranscriptPaths
      });

      return {
        ...allele,
        genes,
        intergenicConsequences
      };
    });

  return {
    ...variant,
    alternative_alleles: alternativeAlleles
  };
};

/**
 * Consider:
 * - A variant may affect transcripts from more than one gene.
 *   In that case, return an array containing one transcript consequence per gene.
 * - A variant may not affect the canonical transcript of a gene.
 *   In that case, return an array containing the first transcript per gene
 */
const buildGeneData = ({
  transcriptConsequences,
  expandedTranscriptPaths,
  altAllele
}: {
  transcriptConsequences: PredictedTranscriptConsequence[];
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
  altAllele: AlternativeVariantAllele;
}) => {
  const genesMap = new Map<string, VariantAffectedGene>();

  // transform transcript paths array into a set for faster access
  const transcriptPathAccessor = (transcriptPath: ExpandedTranscriptsPath) =>
    `${transcriptPath.altAllele}-${transcriptPath.geneId}`;
  const transcriptPathsSet = new Set(
    expandedTranscriptPaths.map(transcriptPathAccessor)
  );

  // Sort transcript consequences so the one shown by default (the first per
  // gene) is the preferred transcript: MANE (human GRCh38) first, then GENCODE
  // primary, then canonical, then the original VEP order. This mirrors the badge
  // precedence in VariantTranscript. A variant may not affect any MANE / GENCODE
  // primary / canonical transcript, in which case the order is unchanged.
  // Array.prototype.sort is stable, so equal-rank transcripts keep their order.
  const transcriptRank = (consequence: PredictedTranscriptConsequence) => {
    if (consequence.is_mane_select) {
      return 0;
    }
    if (consequence.is_mane_plus_clinical) {
      return 1;
    }
    if (consequence.is_gencode_primary) {
      return 2;
    }
    if (consequence.is_canonical) {
      return 3;
    }
    return 4;
  };
  transcriptConsequences.sort((a, b) => transcriptRank(a) - transcriptRank(b));

  for (const consequence of transcriptConsequences) {
    const geneId = consequence.gene_stable_id;
    const visitedGene = genesMap.get(geneId);
    const shouldShowOneTranscriptPerGene = !transcriptPathsSet.has(
      transcriptPathAccessor({ geneId, altAllele: altAllele.allele_sequence })
    );

    if (visitedGene) {
      if (!shouldShowOneTranscriptPerGene) {
        visitedGene.transcripts.push(consequence);
      }
      visitedGene.transcriptsCount++;
    } else {
      // after transcript consequences have been sorted, canonical transcripts, if they exist, will be first
      const gene: VariantAffectedGene = {
        stable_id: geneId,
        symbol: consequence.gene_symbol,
        transcripts: [consequence],
        transcriptsCount: 1
      };
      genesMap.set(geneId, gene);
    }
  }

  return [...genesMap.values()];
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
        altAlleleSequence: string;
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
    structural_variant_detail?: string | null;
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
export const getTabularData = ({
  variant,
  expandedTranscriptPaths
}: {
  variant: VariantInResponse;
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
}): VepResultsTableRowData[] => {
  const result: VepResultsTableRowData[] = [];
  const reshapedVariant = reshapeVariant({
    variant,
    expandedTranscriptPaths
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
            isLastTranscript: i === gene.transcripts.length - 1,
            altAlleleSequence: altAllele.allele_sequence
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
            structural_variant_detail: altAllele.structural_variant_detail,
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

      // The variant cell spans the whole variant, so — as in the transcript loop
      // above — it belongs only on the very first row of the variant. Setting it
      // again on a later allele's first intergenic row collides with that rowspan
      // and pushes the row's cells into phantom columns (a wildly over-wide table
      // and a header line that falls short of the row width).
      if (!result.length) {
        tableRowData.variant = {
          name: variant.name,
          allele_type: variant.allele_type,
          referenceAllele: variant.reference_allele.allele_sequence,
          location: variant.location,
          rowspan: getTotalRowsForVariant(reshapedVariant)
        };
      }
      // The alternative-allele cell belongs on each allele's first intergenic row.
      if (i === 0) {
        tableRowData.alternativeAllele = {
          allele_sequence: altAllele.allele_sequence,
          structural_variant_detail: altAllele.structural_variant_detail,
          rowspan: getTotalRowsForAltAllele(altAllele)
        };
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
