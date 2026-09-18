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
  PredictedIntergenicConsequence,
  PredictedRegulatoryConsequence
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
    // `params` is a new object every render, so its fields are the dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  regulatoryConsequences: PredictedRegulatoryConsequence[];
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
      const {
        transcriptConsequences,
        regulatoryConsequences,
        intergenicConsequences
      } = groupAlleleConsequencesByType(
        allele.predicted_molecular_consequences
      );

      const genes = buildGeneData({
        transcriptConsequences,
        altAllele: allele,
        expandedTranscriptPaths
      });

      return {
        ...allele,
        genes,
        regulatoryConsequences,
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
  regulatoryConsequences: PredictedRegulatoryConsequence[];
  intergenicConsequences: PredictedIntergenicConsequence[];
};

const groupAlleleConsequencesByType = (
  consequences: PredictedMolecularConsequence[]
) => {
  const consequenceGroups: ConsequenceGroups = {
    transcriptConsequences: [],
    regulatoryConsequences: [],
    intergenicConsequences: []
  };

  for (const consequence of consequences) {
    if (consequence.feature_type === 'transcript') {
      consequenceGroups.transcriptConsequences.push(consequence);
    } else if (consequence.feature_type === 'regulatory') {
      consequenceGroups.regulatoryConsequences.push(consequence);
    } else if (consequence.feature_type === null) {
      consequenceGroups.intergenicConsequences.push(consequence);
    } else {
      // A new feature_type with no branch here fails to compile. Ungrouped, its
      // rows would silently never reach the table.
      consequence satisfies never;
    }
  }

  return consequenceGroups;
};

export type VepResultsTableRowData = {
  // Every row carries its alt allele's sequence, because only the allele's
  // first row holds the allele cell.
  consequence: (
    | PredictedIntergenicConsequence
    | PredictedRegulatoryConsequence
    | (PredictedTranscriptConsequence & {
        totalTranscriptsCount: number;
        isLastTranscript: boolean;
      })
  ) & { altAlleleSequence: string };
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
 * Each consequence gets its own row. Within an alt allele, rows run from most
 * to least interesting: transcripts, then regulatory features, then intergenic.
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

  for (const altAllele of reshapedVariant.alternative_alleles) {
    const altAlleleSequence = altAllele.allele_sequence;
    const alleleRows: VepResultsTableRowData[] = [];

    for (const gene of altAllele.genes) {
      for (let i = 0; i < gene.transcripts.length; i++) {
        const transcriptConsequence = gene.transcripts[i];
        alleleRows.push({
          consequence: {
            ...transcriptConsequence,
            totalTranscriptsCount: gene.transcriptsCount,
            isLastTranscript: i === gene.transcripts.length - 1,
            altAlleleSequence
          },
          gene:
            i === 0
              ? {
                  stableId: gene.stable_id,
                  symbol: gene.symbol,
                  strand: transcriptConsequence.strand,
                  transcriptsCount: gene.transcriptsCount,
                  rowspan: Math.max(gene.transcripts.length, 1)
                }
              : null,
          alternativeAllele: null,
          variant: null
        });
      }
    }

    for (const consequence of [
      ...altAllele.regulatoryConsequences,
      ...altAllele.intergenicConsequences
    ]) {
      alleleRows.push({
        consequence: { ...consequence, altAlleleSequence },
        gene: null,
        alternativeAllele: null,
        variant: null
      });
    }

    if (alleleRows.length) {
      alleleRows[0].alternativeAllele = {
        allele_sequence: altAlleleSequence,
        structural_variant_detail: altAllele.structural_variant_detail,
        rowspan: getTotalRowsForAltAllele(altAllele)
      };
    }
    result.push(...alleleRows);
  }

  // A variant cell on any later row collides with this rowspan and pushes
  // cells into phantom columns.
  if (result.length) {
    result[0].variant = {
      name: variant.name,
      allele_type: variant.allele_type,
      referenceAllele: variant.reference_allele.allele_sequence,
      location: variant.location,
      rowspan: getTotalRowsForVariant(reshapedVariant)
    };
  }

  return result;
};

/**
 * Gives each row a key that holds steady as a gene's transcripts expand or
 * collapse around it. The key joins allele, gene and feature id, and a counter
 * separates repeats of one feature within a group.
 */
export const getRowKeys = (rows: VepResultsTableRowData[]): string[] => {
  const seen = new Map<string, number>();

  return rows.map(({ consequence }) => {
    const featureId =
      consequence.feature_type === 'transcript'
        ? `${consequence.gene_stable_id}|${consequence.stable_id}`
        : consequence.feature_type === 'regulatory'
          ? consequence.stable_id
          : 'intergenic';
    const baseKey = `${consequence.altAlleleSequence}|${featureId}`;
    const repeats = seen.get(baseKey) ?? 0;
    seen.set(baseKey, repeats + 1);
    return repeats ? `${baseKey}|${repeats}` : baseKey;
  });
};

// Note: the number of transcripts in allele->gene
// will depend on whether the list of transcripts is collapsed or expanded
// (see how transcripts are filtered out in the reshapeVariant function)
const countAlleleRows = (allele: UpdatedAlternativeAllele) =>
  allele.genes.reduce((count, gene) => count + gene.transcripts.length, 0) +
  allele.regulatoryConsequences.length +
  allele.intergenicConsequences.length;

const getTotalRowsForVariant = (variant: ReshapedVariant) =>
  Math.max(
    variant.alternative_alleles.reduce(
      (count, allele) => count + countAlleleRows(allele),
      0
    ),
    1
  );

const getTotalRowsForAltAllele = (allele: UpdatedAlternativeAllele) =>
  Math.max(countAlleleRows(allele), 1);

export default useVepVariantTabularData;
