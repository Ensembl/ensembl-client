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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { SpeciesStatsProps as IndividualStat } from 'src/content/app/species/components/species-stats/SpeciesStats';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import type { LinksConfig } from 'src/shared/components/view-in-app/ViewInApp';
import type { SpeciesStatistics } from 'src/content/app/species/state/api/speciesApiTypes';

export type SpeciesStatsSection = keyof SpeciesStatistics;

// get all the keys of statistics sections from SpeciesStatistics type
type KeysOfUnion<T> = T extends T ? keyof T : never;
type SingleStatistic =
  | KeysOfUnion<SpeciesStatistics[keyof SpeciesStatistics]>
  | 'homology'
  | 'variation'
  | 'regulation';

export const speciesStatsSectionNames: Array<SpeciesStatsSection> = [
  'coding_stats',
  'non_coding_stats',
  'pseudogene_stats',
  'assembly_stats',
  'homology_stats',
  'variation_stats',
  'regulation_stats'
];

const groupTitles = {
  coding_genes: 'Coding genes',
  analysis: 'Analysis',
  non_coding_genes: 'Non-coding genes',
  non_coding_analysis: 'Analysis',
  pseudogenes: 'Pseudogenes',
  pseudogenes_analysis: 'Analysis',
  assembly: 'Assembly',
  assembly_analysis: 'Analysis',
  transcripts: 'Transcripts',
  homology: 'Homology',
  variation: 'Variation',
  variation_evidence: 'Evidence',
  regulation: 'Regulation'
};

type SpeciesStatsSectionGroup = keyof typeof groupTitles;

type SpeciesStatsSectionGroupData = {
  title: string;
  groups: SpeciesStatsSectionGroup[];
  summaryStatsKeys?: SingleStatistic[];
  exampleLinkText?: string;
  helpText?: string;
};

// Maps the groups to their respective sections
export const sectionGroupsMap: Record<
  SpeciesStatsSection,
  SpeciesStatsSectionGroupData
> = {
  coding_stats: {
    title: 'Coding genes',
    exampleLinkText: 'Example gene',
    groups: ['coding_genes', 'analysis', 'transcripts'],
    summaryStatsKeys: ['coding_genes']
  },
  assembly_stats: {
    title: 'Assembly',
    exampleLinkText: 'Example location',
    groups: ['assembly', 'assembly_analysis'],
    summaryStatsKeys: ['chromosomes']
  },
  pseudogene_stats: {
    title: 'Pseudogenes',
    groups: ['pseudogenes', 'pseudogenes_analysis'],
    summaryStatsKeys: ['pseudogenes']
  },
  non_coding_stats: {
    title: 'Non-coding genes',
    groups: ['non_coding_genes', 'non_coding_analysis'],
    summaryStatsKeys: ['non_coding_genes']
  },
  homology_stats: {
    title: 'Homology',
    groups: ['homology'],
    summaryStatsKeys: ['coverage']
  },
  variation_stats: {
    title: 'Variation',
    exampleLinkText: 'Example variant',
    groups: ['variation', 'variation_evidence'],
    summaryStatsKeys: ['short_variants', 'structural_variants']
  },
  regulation_stats: {
    title: 'Regulation',
    groups: ['regulation'],
    summaryStatsKeys: ['enhancers', 'promoters']
  }
};

// Maps individual stats to their respective groups
const groupsStatsMap: Record<SpeciesStatsSectionGroup, SingleStatistic[][]> = {
  coding_genes: [
    ['coding_genes', 'shortest_gene_length', 'longest_gene_length'],
    ['total_transcripts', 'total_exons', 'total_introns']
  ],
  analysis: [
    ['average_genomic_span', 'average_sequence_length', 'average_cds_length'],
    ['transcripts_per_gene', 'average_exon_length', 'average_intron_length']
  ],
  transcripts: [
    [
      'coding_transcripts',
      'coding_transcripts_per_gene',
      'average_exons_per_transcript'
    ],
    [
      'total_coding_exons',
      'average_coding_exons_per_coding_transcript',
      'average_coding_exon_length'
    ]
  ],
  non_coding_genes: [
    ['non_coding_genes', 'shortest_gene_length', 'longest_gene_length'],
    [
      'small_non_coding_genes',
      'long_non_coding_genes',
      'misc_non_coding_genes'
    ],
    ['total_transcripts', 'total_exons', 'total_introns']
  ],
  non_coding_analysis: [
    ['average_genomic_span', 'average_sequence_length'],
    [
      'transcripts_per_gene',
      'average_exons_per_transcript',
      'average_exon_length',
      'average_intron_length'
    ]
  ],
  pseudogenes: [
    ['pseudogenes', 'shortest_gene_length', 'longest_gene_length'],
    ['total_transcripts', 'total_exons', 'total_introns']
  ],
  pseudogenes_analysis: [
    ['average_genomic_span', 'average_sequence_length'],
    [
      'transcripts_per_gene',
      'average_exons_per_transcript',
      'average_exon_length',
      'average_intron_length'
    ]
  ],
  assembly: [
    ['chromosomes', 'total_genome_length', 'total_coding_sequence_length'],
    ['toplevel_sequences', 'total_gap_length', 'spanned_gaps'],
    ['component_sequences', 'contig_n50']
  ],
  assembly_analysis: [['gc_percentage']],
  homology: [['coverage']],
  variation: [['short_variants', 'structural_variants']],
  variation_evidence: [
    [
      'short_variants_with_phenotype_assertions',
      'short_variants_with_publications',
      'short_variants_frequency_studies'
    ],
    ['structural_variants_with_phenotype_assertions']
  ],
  regulation: [['enhancers', 'promoters']]
};

// Individual stat formatting options.
type StatsFormattingOption = {
  preLabel?: string;
  label: string;
  headerUnit?: string;
  primaryUnit?: string;
  secondaryUnit?: string;
  primaryValuePostfix?: string;
  helpText?: string;
  getHelpText?: (allStats: SpeciesStatistics) => string;
};

const getComparaCoverageHelpText = (allStats: SpeciesStatistics) => {
  const referenceSpeciesName = allStats.homology_stats.reference_species_name;
  if (!referenceSpeciesName) {
    return '';
  }
  return `Proportion of genes with orthologs with ${referenceSpeciesName}`;
};

type StatsFormattingOptions = {
  [key in SpeciesStatsSection]: {
    [key in SingleStatistic]?: StatsFormattingOption;
  };
};

const statsFormattingOptions: StatsFormattingOptions = {
  coding_stats: {
    coding_genes: { label: 'Coding genes' },
    shortest_gene_length: {
      label: 'Shortest coding gene',
      primaryUnit: 'bp'
    },
    longest_gene_length: {
      label: 'Longest coding gene',
      primaryUnit: 'bp'
    },
    total_transcripts: { label: 'Transcripts in coding genes' },
    total_exons: { label: 'Exons in coding genes' },
    total_introns: { label: 'Introns in coding genes' },

    average_genomic_span: {
      label: 'Average coding genomic span',
      primaryUnit: 'bp'
    },
    average_sequence_length: {
      label: 'Average coding sequence length',
      primaryUnit: 'bp'
    },
    average_cds_length: {
      label: 'Average CDS length',
      primaryUnit: 'bp'
    },

    transcripts_per_gene: {
      label: 'Average transcripts per coding gene'
    },

    average_exon_length: {
      label: 'Average exon length per coding gene',
      primaryUnit: 'bp'
    },
    average_intron_length: {
      label: 'Average intron length per coding gene',
      primaryUnit: 'bp'
    },

    coding_transcripts: { label: 'Coding transcripts' },
    coding_transcripts_per_gene: {
      label: 'Average coding transcripts per gene'
    },
    average_exons_per_transcript: {
      label: 'Average exons per coding transcript'
    },

    total_coding_exons: { label: 'Coding exons' },
    average_coding_exons_per_coding_transcript: {
      label: 'Average coding exons per transcript'
    },
    average_coding_exon_length: {
      label: 'Average coding exon length',
      primaryUnit: 'bp'
    }
  },
  non_coding_stats: {
    non_coding_genes: { label: 'Non-coding genes' },
    shortest_gene_length: {
      label: 'Shortest non-coding gene',
      primaryUnit: 'bp'
    },
    longest_gene_length: {
      label: 'Longest non-coding gene',
      primaryUnit: 'bp'
    },

    small_non_coding_genes: {
      label: 'Small non-coding genes'
    },
    long_non_coding_genes: {
      label: 'Long non-coding genes'
    },
    misc_non_coding_genes: {
      label: 'Misc. non-coding genes'
    },

    total_transcripts: {
      label: 'Transcripts in non-coding genes'
    },
    total_exons: { label: 'Exons in non-coding genes' },
    total_introns: { label: 'Introns in non-coding genes' },

    average_genomic_span: {
      label: 'Average non-coding genomic span',
      primaryUnit: 'bp'
    },
    average_sequence_length: {
      label: 'Average non-coding sequence length',
      primaryUnit: 'bp'
    },

    transcripts_per_gene: {
      label: 'Average transcripts per non-coding gene'
    },
    average_exon_length: {
      label: 'Average exon length per non-coding transcript',
      primaryUnit: 'bp'
    },
    average_exons_per_transcript: {
      label: 'Average exons per non-coding transcript'
    },
    average_intron_length: {
      label: 'Average intron length per non-coding transcript',
      primaryUnit: 'bp'
    }
  },
  pseudogene_stats: {
    pseudogenes: { label: 'Pseudogenes' },
    shortest_gene_length: {
      label: 'Shortest pseudogene',
      primaryUnit: 'bp'
    },
    longest_gene_length: {
      label: 'Longest pseudogene',
      primaryUnit: 'bp'
    },

    total_transcripts: {
      label: 'Transcripts in pseudogenes'
    },
    total_exons: { label: 'Exons in pseudogenes' },
    total_introns: { label: 'Introns in pseudogenes' },

    average_genomic_span: {
      label: 'Average pseudogene genomic span',
      primaryUnit: 'bp'
    },
    average_sequence_length: {
      label: 'Average pseudogene sequence length',
      primaryUnit: 'bp'
    },

    transcripts_per_gene: {
      label: 'Average transcripts per pseudogene'
    },
    average_exon_length: {
      label: 'Average exon length per pseudogene',
      primaryUnit: 'bp'
    },
    average_exons_per_transcript: {
      label: 'Average exons per pseudogene transcript'
    },
    average_intron_length: {
      label: 'Average intron length per pseudogene',
      primaryUnit: 'bp'
    }
  },
  assembly_stats: {
    chromosomes: {
      label: 'Chromosomes or plasmids',
      headerUnit: 'chromosomes or plasmids'
    },
    total_genome_length: {
      primaryUnit: 'bp',
      label: 'Total genome length'
    },
    total_coding_sequence_length: {
      primaryUnit: 'bp',
      label: 'Total coding sequence length'
    },

    toplevel_sequences: { label: 'Top level sequences' },
    total_gap_length: { label: 'Total gap length', primaryUnit: 'bp' },
    spanned_gaps: { label: 'Spanned gaps' },

    component_sequences: { label: 'Component sequences' },
    contig_n50: { label: 'Contig N50', primaryUnit: 'bp' },

    gc_percentage: {
      primaryValuePostfix: '%',
      label: 'Average GC content'
    }
  },
  homology_stats: {
    homology: {
      label: 'Homology'
    },
    coverage: {
      label: 'Coverage',
      headerUnit: 'coverage',
      primaryValuePostfix: '%',
      getHelpText: getComparaCoverageHelpText
    }
  },
  variation_stats: {
    variation: {
      label: 'Variation'
    },
    short_variants: {
      label: 'Short variants',
      headerUnit: 'short variants'
    },
    structural_variants: {
      label: 'Structural variants',
      headerUnit: 'structural variants'
    },
    short_variants_with_phenotype_assertions: {
      preLabel: 'Short variants',
      label: 'With phenotype assertions'
    },
    short_variants_with_publications: {
      preLabel: 'Short variants',
      label: 'With publications'
    },
    short_variants_frequency_studies: {
      preLabel: 'Short variants',
      label: 'Frequency studies'
    },
    structural_variants_with_phenotype_assertions: {
      preLabel: 'Structural variants',
      label: 'With phenotype assertions'
    }
  },
  regulation_stats: {
    regulation: {
      label: 'Regulation'
    },
    enhancers: {
      headerUnit: 'enhancers',
      label: 'Enhancers'
    },
    promoters: {
      headerUnit: 'promoters',
      label: 'Promoters'
    }
  }
};

type StatsGroup = {
  title: string;
  stats: [IndividualStat[]];
};

export type StatsSection = {
  section: SpeciesStatsSection;
  exampleLinks?: LinksConfig;
  summaryStats?: IndividualStat[];
  groups: StatsGroup[];
};

type BuildStatProps = Partial<IndividualStat> & {
  primaryValue: string | number;
  primaryKey: SingleStatistic;
  secondaryKey?: SingleStatistic;
  section: SpeciesStatsSection;
  allStats: SpeciesStatistics;
};

const buildIndividualStat = (
  props: BuildStatProps
): IndividualStat | undefined => {
  let primaryValue = props.primaryValue;

  const { section, primaryKey, allStats } = props;

  if (!statsFormattingOptions[section][primaryKey]) {
    return;
  }
  const {
    primaryValuePostfix = '',
    label,
    primaryUnit,
    preLabel,
    helpText,
    getHelpText
  } = statsFormattingOptions[section][primaryKey] as StatsFormattingOption;

  if (typeof primaryValue === 'number') {
    primaryValue =
      formatNumber(primaryValue, { maximumFractionDigits: 2 }) +
      primaryValuePostfix;
  }

  const preparedHelpText = helpText ?? getHelpText?.(allStats);

  return {
    preLabel,
    label: label || primaryKey,
    primaryValue,
    primaryUnit,
    helpText: preparedHelpText
  };
};

type BuildHeaderStatProps = {
  primaryValue: string | number;
  primaryKey: SingleStatistic;
  section: SpeciesStatsSection;
  allStats: SpeciesStatistics;
};

const buildHeaderStat = (
  props: BuildHeaderStatProps
): IndividualStat | undefined => {
  let primaryValue = props.primaryValue;

  const { section, primaryKey, allStats } = props;

  const {
    primaryValuePostfix = '',
    headerUnit,
    helpText,
    getHelpText
  } = statsFormattingOptions[section][primaryKey] as StatsFormattingOption;

  const preparedHelpText = helpText ?? getHelpText?.(allStats);

  if (typeof primaryValue === 'number') {
    primaryValue =
      formatNumber(primaryValue, { maximumFractionDigits: 2 }) +
      primaryValuePostfix;
  }

  return {
    label: primaryKey,
    primaryValue: primaryValue,
    primaryUnit: headerUnit,
    helpText: preparedHelpText
  };
};

const getExampleLinks = (props: {
  section: SpeciesStatsSection;
  genomeIdForUrl: string;
  exampleFocusObjects: ExampleFocusObject[];
}) => {
  const { section, genomeIdForUrl, exampleFocusObjects } = props;

  let exampleLinks: LinksConfig = {};

  if (section === 'coding_stats') {
    const geneExample = exampleFocusObjects.find(
      (object) => object.type === 'gene'
    );

    if (!geneExample) {
      return;
    }

    const focusId = buildFocusIdForUrl({
      type: 'gene',
      objectId: geneExample.id
    });

    exampleLinks = {
      genomeBrowser: {
        url: urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: focusId
        })
      },
      entityViewer: {
        url: urlFor.entityViewer({
          genomeId: genomeIdForUrl,
          entityId: focusId
        })
      }
    };
  } else if (section === 'assembly_stats') {
    const locationExample = exampleFocusObjects.find(
      (object) => object.type === 'location'
    );
    if (!locationExample) {
      return;
    }

    const focusId = buildFocusIdForUrl({
      type: 'location',
      objectId: locationExample.id
    });

    exampleLinks = {
      genomeBrowser: {
        url: urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: focusId
        })
      }
    };
  } else if (section === 'variation_stats') {
    const exampleVariant = exampleFocusObjects.find(
      (object) => object.type === 'variant'
    );

    if (!exampleVariant) {
      return;
    }

    const focusId = buildFocusIdForUrl({
      type: 'variant',
      objectId: exampleVariant.id
    });

    exampleLinks = {
      genomeBrowser: {
        url: urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: focusId
        })
      },
      entityViewer: !isEnvironment([Environment.PRODUCTION])
        ? {
            url: urlFor.entityViewerVariant({
              genomeId: genomeIdForUrl,
              variantId: exampleVariant.id
            })
          }
        : undefined
    };
  }

  return exampleLinks;
};

export const getStatsForSection = (props: {
  allStats: SpeciesStatistics;
  genomeIdForUrl: string;
  section: SpeciesStatsSection;
  exampleFocusObjects: ExampleFocusObject[];
}): StatsSection | undefined => {
  const { section, allStats, genomeIdForUrl, exampleFocusObjects } = props;

  const data = allStats[section];

  if (!data) {
    return {
      section,
      groups: []
    };
  }

  const filteredData: {
    [key: string]: string | number;
  } = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      filteredData[key] = value;
    }
  });

  const { groups, summaryStatsKeys, exampleLinkText } =
    sectionGroupsMap[section];

  if (!filteredData || !groups) {
    return;
  }

  const availableSummaryStatsKeys = summaryStatsKeys?.filter(
    (key) => key && (filteredData[key] || filteredData[key] === 0)
  );

  const summaryStats = availableSummaryStatsKeys
    ?.map((key) => {
      return key && (filteredData[key] || filteredData[key] === 0)
        ? buildHeaderStat({
            primaryKey: key,
            primaryValue: filteredData[key],
            section,
            allStats
          })
        : undefined;
    })
    .filter(Boolean) as IndividualStat[] | undefined;

  const exampleLinks = exampleLinkText
    ? getExampleLinks({
        section,
        genomeIdForUrl,
        exampleFocusObjects
      })
    : undefined;

  const isExpandedContentSame =
    ['regulation_stats', 'homology_stats'].includes(section) ||
    Object.keys(filteredData).length === availableSummaryStatsKeys?.length;

  if (isExpandedContentSame) {
    return {
      section,
      summaryStats,
      exampleLinks,
      groups: []
    };
  }

  const processedGroups = groups.map((group) => {
    const groupStats = groupsStatsMap[group];

    const processedStats = groupStats
      .map((subGroupStats) => {
        const processedSubGroupStats: IndividualStat[] = [];
        subGroupStats.forEach((stat) => {
          if (filteredData[stat] || filteredData[stat] === 0) {
            const individualStat = buildIndividualStat({
              primaryKey: stat,
              primaryValue: filteredData[stat],
              section,
              allStats
            });
            individualStat && processedSubGroupStats.push(individualStat);
          }
        });

        return processedSubGroupStats.length
          ? processedSubGroupStats
          : undefined;
      })
      .filter(Boolean);

    return {
      title: groupTitles[group],
      stats: processedStats
    };
  });

  return {
    section,
    summaryStats,
    exampleLinks,
    groups: processedGroups
  } as StatsSection;
};
