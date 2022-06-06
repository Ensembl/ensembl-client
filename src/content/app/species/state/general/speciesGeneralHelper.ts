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
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { SpeciesStatsProps as IndividualStat } from 'src/content/app/species/components/species-stats/SpeciesStats';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import { sampleData } from '../../sample-data';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { UrlObj } from 'src/shared/components/view-in-app/ViewInApp';

export enum SpeciesStatsSection {
  CODING_STATS = 'coding_stats',
  NON_CODING_STATS = 'non_coding_stats',
  PSEUDOGENES = 'pseudogene_stats',
  ASSEMBLY = 'assembly_stats',
  HOMOLOGY = 'homology_stats',
  VARIATION = 'variation_stats',
  REGULATION = 'regulation_stats'
}

// SpeciesStatsSection -> Groups
enum Groups {
  CODING_GENES = 'coding_genes',
  ANALYSIS = 'analysis',
  NON_CODING_GENES = 'non_coding_genes',
  NON_CODING_ANALYSIS = 'non_coding_analysis',
  PSEUDOGENES = 'pseudogenes',
  PSEUDOGENES_ANALYSIS = 'pseudogenes_analysis',
  ASSEMBLY = 'assembly',
  ASSEMBLY_ANALYSIS = 'assembly_analysis',
  TRANSCRIPTS = 'transcripts',
  HOMOLOGY = 'homology',
  VARIATION = 'variation',
  VARIATION_EVIDENCE = 'variation_evidence',
  REGULATION = 'regulation'
}

const groupTitles = {
  [Groups.CODING_GENES]: 'Coding genes',
  [Groups.ANALYSIS]: 'Analysis',
  [Groups.NON_CODING_GENES]: 'Non-coding genes',
  [Groups.NON_CODING_ANALYSIS]: 'Analysis',
  [Groups.PSEUDOGENES]: 'Pseudogenes',
  [Groups.PSEUDOGENES_ANALYSIS]: 'Analysis',
  [Groups.ASSEMBLY]: 'Assembly',
  [Groups.ASSEMBLY_ANALYSIS]: 'Analysis',
  [Groups.TRANSCRIPTS]: 'Transcripts',
  [Groups.HOMOLOGY]: 'Homology',
  [Groups.VARIATION]: 'Variation',
  [Groups.VARIATION_EVIDENCE]: 'Evidence',
  [Groups.REGULATION]: 'Regulation'
};

// SpeciesStatsSection -> Groups -> Stats
enum Stats {
  // Coding stats
  CODING_GENES = 'coding_genes',
  SHORTEST_GENE_LENGTH = 'shortest_gene_length',
  LONGEST_GENE_LENGTH = 'longest_gene_length',
  AVERAGE_GENOMIC_SPAN = 'average_genomic_span',
  AVERAGE_SEQUENCE_LENGTH = 'average_sequence_length',
  AVERAGE_CDS_LENGTH = 'average_cds_length',
  TOTAL_TRANSCRIPTS = 'total_transcripts',
  CODING_TRANSCRIPTS = 'coding_transcripts',
  TRANSCRIPTS_PER_GENE = 'transcripts_per_gene',
  CODING_TRANSCRIPTS_PER_GENE = 'coding_transcripts_per_gene',
  TOTAL_EXONS = 'total_exons',
  TOTAL_CODING_EXONS = 'total_coding_exons',
  AVERAGE_EXON_LENGTH = 'average_exon_length',
  AVERAGE_CODING_EXON_LENGTH = 'average_coding_exon_length',
  AVERAGE_EXONS_PER_TRANSCRIPT = 'average_exons_per_transcript',
  AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT = 'average_coding_exons_per_coding_transcript',
  TOTAL_INTRONS = 'total_introns',
  AVERAGE_INTRON_LENGTH = 'average_intron_length',

  // assembly
  CHROMOSOMES = 'chromosomes',
  TOTAL_GENOME_LENGTH = 'total_genome_length',
  TOTAL_CODING_SEQUENCE_LENGTH = 'total_coding_sequence_length',
  TOTAL_GAP_LENGTH = 'total_gap_length',
  SPANNED_GAP = 'spanned_gaps',
  TOPLEVEL_SEQUENCES = 'toplevel_sequences',
  COMPONENT_SEQUENCES = 'component_sequences',
  AVERAGE_GC_CONTENT = 'gc_percentage',
  CONTIG_N50 = 'contig_n50',

  // Non coding stats
  NON_CODING_GENES = 'non_coding_genes',
  NON_CODING_SMALL_GENES = 'small_non_coding_genes',
  NON_CODING_LONG_GENES = 'long_non_coding_genes',
  NON_CODING_MISC_GENES = 'misc_non_coding_genes',
  NON_CODING_AVERAGE_GENOMIC_SPAN = 'average_genomic_span',
  NON_CODING_AVERAGE_SEQUENCE_LENGTH = 'average_sequence_length',
  NON_CODING_SHORTEST_GENE_LENGTH = 'shortest_gene_length',
  NON_CODING_LONGEST_GENE_LENGTH = 'longest_gene_length',
  NON_CODING_TOTAL_TRANSCRIPTS = 'total_transcripts',
  NON_CODING_TRANSCRIPTS_PER_GENE = 'transcripts_per_gene',
  NON_CODING_TOTAL_EXONS = 'total_exons',
  NON_CODING_AVERAGE_EXON_LENGTH = 'average_exon_length',
  NON_CODING_AVERAGE_EXONS_PER_TRANSCRIPT = 'average_exons_per_transcript',
  NON_CODING_TOTAL_INTRONS = 'total_introns',
  NON_CODING_AVERAGE_INTRON_LENGTH = 'average_intron_length',

  // Psuedogene stats
  PSEUDOGENES = 'pseudogenes',
  PSEUDOGENES_AVERAGE_GENOMIC_SPAN = 'average_genomic_span',
  PSEUDOGENES_AVERAGE_SEQUENCE_LENGTH = 'average_sequence_length',
  PSEUDOGENES_SHORTEST_GENE_LENGTH = 'shortest_gene_length',
  PSEUDOGENES_LONGEST_GENE_LENGTH = 'longest_gene_length',
  PSEUDOGENES_TOTAL_TRANSCRIPTS = 'total_transcripts',
  PSEUDOGENES_TRANSCRIPTS_PER_GENE = 'transcripts_per_gene',
  PSEUDOGENES_TOTAL_EXONS = 'total_exons',
  PSEUDOGENES_AVERAGE_EXON_LENGTH = 'average_exon_length',
  PSEUDOGENES_AVERAGE_EXONS_PER_TRANSCRIPT = 'average_exons_per_transcript',
  PSEUDOGENES_TOTAL_INTRONS = 'total_introns',
  PSEUDOGENES_AVERAGE_INTRON_LENGTH = 'average_intron_length',

  // Homology stats
  HOMOLOGY = 'homology',
  HOMOLOGY_COVERAGE = 'coverage',

  // Variation stats
  VARIATION = 'variation',
  SHORT_VARIANTS = 'short_variants',
  STRUCTURAL_VARIANTS = 'structural_variants',
  SHORT_VARIANTS_WITH_PHENOTYPE_ASSERTIONS = 'short_variants_with_phenotype_assertions',
  SHORT_VARIANTS_WITH_PUBLICATIONS = 'short_variants_with_publications',
  SHORT_VARIANTS_FREQUENCY_STUDIES = 'short_variants_frequency_studies',
  STRUCTURAL_VARIANTS_WITH_PHENOTYPE_ASSERTIONS = 'structural_variants_with_phenotype_assertions',

  // Regulation stats
  REGULATION = 'regulation',
  REGULATION_ENHANCERS = 'enhancers',
  REGULATION_PROMOTERS = 'promoters'
}

const helpText = {
  HOMOLOGY_COVERAGE:
    'Coding genes with orthologues and/or paralogues with other species in Ensembl'
};

type SpeciesStatsSectionGroups = {
  [key in SpeciesStatsSection]: {
    title: Stats | string;
    groups: Groups[];
    summaryStatsKeys?: [Stats?, Stats?];
    exampleLinkText?: string;
    helpText?: string;
  };
};

// Maps the groups to it's respective section
export const sectionGroupsMap: SpeciesStatsSectionGroups = {
  [SpeciesStatsSection.CODING_STATS]: {
    title: 'Coding genes',
    exampleLinkText: 'Example gene',
    groups: [Groups.CODING_GENES, Groups.ANALYSIS, Groups.TRANSCRIPTS],
    summaryStatsKeys: [Stats.CODING_GENES]
  },
  [SpeciesStatsSection.ASSEMBLY]: {
    title: 'Assembly',
    // TODO: Uncomment me when we need to re-enable example region links
    // exampleLinkText: 'Example region',
    groups: [Groups.ASSEMBLY, Groups.ASSEMBLY_ANALYSIS],
    summaryStatsKeys: [Stats.CHROMOSOMES]
  },
  [SpeciesStatsSection.PSEUDOGENES]: {
    title: 'Pseudogenes',
    groups: [Groups.PSEUDOGENES, Groups.PSEUDOGENES_ANALYSIS],
    summaryStatsKeys: [Stats.PSEUDOGENES]
  },
  [SpeciesStatsSection.NON_CODING_STATS]: {
    title: 'Non-coding genes',
    groups: [Groups.NON_CODING_GENES, Groups.NON_CODING_ANALYSIS],
    summaryStatsKeys: [Stats.NON_CODING_GENES]
  },
  [SpeciesStatsSection.HOMOLOGY]: {
    title: 'Homology',
    groups: [Groups.HOMOLOGY],
    summaryStatsKeys: [Stats.HOMOLOGY_COVERAGE],
    helpText: helpText.HOMOLOGY_COVERAGE
  },
  [SpeciesStatsSection.VARIATION]: {
    title: 'Variation',
    groups: [Groups.VARIATION, Groups.VARIATION_EVIDENCE],
    summaryStatsKeys: [Stats.SHORT_VARIANTS, Stats.STRUCTURAL_VARIANTS]
  },
  [SpeciesStatsSection.REGULATION]: {
    title: 'Regulation',
    groups: [Groups.REGULATION],
    summaryStatsKeys: [Stats.REGULATION_ENHANCERS, Stats.REGULATION_PROMOTERS]
  }
};

// Maps the individual stats to it's respective groups
const groupsStatsMap = {
  [Groups.CODING_GENES]: [
    [Stats.CODING_GENES, Stats.SHORTEST_GENE_LENGTH, Stats.LONGEST_GENE_LENGTH],
    [Stats.TOTAL_TRANSCRIPTS, Stats.TOTAL_EXONS, Stats.TOTAL_INTRONS]
  ],
  [Groups.ANALYSIS]: [
    [
      Stats.AVERAGE_GENOMIC_SPAN,
      Stats.AVERAGE_SEQUENCE_LENGTH,
      Stats.AVERAGE_CDS_LENGTH
    ],
    [
      Stats.TRANSCRIPTS_PER_GENE,
      Stats.AVERAGE_EXON_LENGTH,
      Stats.AVERAGE_INTRON_LENGTH
    ]
  ],
  [Groups.TRANSCRIPTS]: [
    [
      Stats.CODING_TRANSCRIPTS,
      Stats.CODING_TRANSCRIPTS_PER_GENE,
      Stats.AVERAGE_EXONS_PER_TRANSCRIPT
    ],
    [
      Stats.TOTAL_CODING_EXONS,
      Stats.AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT,
      Stats.AVERAGE_CODING_EXON_LENGTH
    ]
  ],
  [Groups.NON_CODING_GENES]: [
    [
      Stats.NON_CODING_GENES,
      Stats.SHORTEST_GENE_LENGTH,
      Stats.LONGEST_GENE_LENGTH
    ],
    [
      Stats.NON_CODING_SMALL_GENES,
      Stats.NON_CODING_LONG_GENES,
      Stats.NON_CODING_MISC_GENES
    ],
    [
      Stats.NON_CODING_TOTAL_TRANSCRIPTS,
      Stats.NON_CODING_TOTAL_EXONS,
      Stats.NON_CODING_TOTAL_INTRONS
    ]
  ],
  [Groups.NON_CODING_ANALYSIS]: [
    [
      Stats.NON_CODING_AVERAGE_GENOMIC_SPAN,
      Stats.NON_CODING_AVERAGE_SEQUENCE_LENGTH
    ],
    [
      Stats.NON_CODING_TRANSCRIPTS_PER_GENE,
      Stats.NON_CODING_AVERAGE_EXONS_PER_TRANSCRIPT,
      Stats.NON_CODING_AVERAGE_EXON_LENGTH,
      Stats.NON_CODING_AVERAGE_INTRON_LENGTH
    ]
  ],
  [Groups.PSEUDOGENES]: [
    [
      Stats.PSEUDOGENES,
      Stats.PSEUDOGENES_SHORTEST_GENE_LENGTH,
      Stats.PSEUDOGENES_LONGEST_GENE_LENGTH
    ],
    [
      Stats.PSEUDOGENES_TOTAL_TRANSCRIPTS,
      Stats.PSEUDOGENES_TOTAL_EXONS,
      Stats.PSEUDOGENES_TOTAL_INTRONS
    ]
  ],
  [Groups.PSEUDOGENES_ANALYSIS]: [
    [
      Stats.PSEUDOGENES_AVERAGE_GENOMIC_SPAN,
      Stats.PSEUDOGENES_AVERAGE_SEQUENCE_LENGTH
    ],
    [
      Stats.PSEUDOGENES_TRANSCRIPTS_PER_GENE,
      Stats.PSEUDOGENES_AVERAGE_EXONS_PER_TRANSCRIPT,
      Stats.PSEUDOGENES_AVERAGE_EXON_LENGTH,
      Stats.PSEUDOGENES_AVERAGE_INTRON_LENGTH
    ]
  ],
  [Groups.ASSEMBLY]: [
    [
      Stats.CHROMOSOMES,
      Stats.TOTAL_GENOME_LENGTH,
      Stats.TOTAL_CODING_SEQUENCE_LENGTH
    ],
    [Stats.TOPLEVEL_SEQUENCES, Stats.TOTAL_GAP_LENGTH, Stats.SPANNED_GAP],
    [Stats.COMPONENT_SEQUENCES, Stats.CONTIG_N50]
  ],
  [Groups.ASSEMBLY_ANALYSIS]: [[Stats.AVERAGE_GC_CONTENT]],
  [Groups.HOMOLOGY]: [[Stats.HOMOLOGY_COVERAGE]],
  [Groups.VARIATION]: [[Stats.SHORT_VARIANTS, Stats.STRUCTURAL_VARIANTS]],
  [Groups.VARIATION_EVIDENCE]: [
    [
      Stats.SHORT_VARIANTS_WITH_PHENOTYPE_ASSERTIONS,
      Stats.SHORT_VARIANTS_WITH_PUBLICATIONS,
      Stats.SHORT_VARIANTS_FREQUENCY_STUDIES
    ],
    [Stats.STRUCTURAL_VARIANTS_WITH_PHENOTYPE_ASSERTIONS]
  ],
  [Groups.REGULATION]: [
    [Stats.REGULATION_ENHANCERS, Stats.REGULATION_PROMOTERS]
  ]
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
};

type StatsFormattingOptions = {
  [key in string]: {
    [key in Stats]?: StatsFormattingOption;
  };
};

const statsFormattingOptions: StatsFormattingOptions = {
  [SpeciesStatsSection.CODING_STATS]: {
    [Stats.CODING_GENES]: { label: 'Coding genes' },
    [Stats.SHORTEST_GENE_LENGTH]: {
      label: 'Shortest coding gene',
      primaryUnit: 'bp'
    },
    [Stats.LONGEST_GENE_LENGTH]: {
      label: 'Longest coding gene',
      primaryUnit: 'bp'
    },
    [Stats.TOTAL_TRANSCRIPTS]: { label: 'Transcripts in coding genes' },
    [Stats.TOTAL_EXONS]: { label: 'Exons in coding genes' },
    [Stats.TOTAL_INTRONS]: { label: 'Introns in coding genes' },

    [Stats.AVERAGE_GENOMIC_SPAN]: {
      label: 'Average coding genomic span',
      primaryUnit: 'bp'
    },
    [Stats.AVERAGE_SEQUENCE_LENGTH]: {
      label: 'Average coding sequence length',
      primaryUnit: 'bp'
    },
    [Stats.AVERAGE_CDS_LENGTH]: {
      label: 'Average CDS length',
      primaryUnit: 'bp'
    },

    [Stats.TRANSCRIPTS_PER_GENE]: {
      label: 'Average transcripts per coding gene'
    },

    [Stats.AVERAGE_EXON_LENGTH]: {
      label: 'Average exon length per coding gene',
      primaryUnit: 'bp'
    },
    [Stats.AVERAGE_INTRON_LENGTH]: {
      label: 'Average intron length per coding gene',
      primaryUnit: 'bp'
    },

    [Stats.CODING_TRANSCRIPTS]: { label: 'Coding transcripts' },
    [Stats.CODING_TRANSCRIPTS_PER_GENE]: {
      label: 'Average coding transcripts per gene'
    },
    [Stats.AVERAGE_EXONS_PER_TRANSCRIPT]: {
      label: 'Average exons per coding transcript'
    },

    [Stats.TOTAL_CODING_EXONS]: { label: 'Coding exons' },
    [Stats.AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT]: {
      label: 'Average coding exons per transcript'
    },
    [Stats.AVERAGE_CODING_EXON_LENGTH]: {
      label: 'Average coding exon length',
      primaryUnit: 'bp'
    }
  },
  [SpeciesStatsSection.NON_CODING_STATS]: {
    [Stats.NON_CODING_GENES]: { label: 'Non-coding genes' },
    [Stats.NON_CODING_SHORTEST_GENE_LENGTH]: {
      label: 'Shortest non-coding gene',
      primaryUnit: 'bp'
    },
    [Stats.NON_CODING_LONGEST_GENE_LENGTH]: {
      label: 'Longest non-coding gene',
      primaryUnit: 'bp'
    },

    [Stats.NON_CODING_SMALL_GENES]: {
      label: 'Small non-coding genes'
    },
    [Stats.NON_CODING_LONG_GENES]: {
      label: 'Long non-coding genes'
    },
    [Stats.NON_CODING_MISC_GENES]: {
      label: 'Misc. non-coding genes'
    },

    [Stats.NON_CODING_TOTAL_TRANSCRIPTS]: {
      label: 'Transcripts in non-coding genes'
    },
    [Stats.NON_CODING_TOTAL_EXONS]: { label: 'Exons in non-coding genes' },
    [Stats.NON_CODING_TOTAL_INTRONS]: { label: 'Introns in non-coding genes' },

    [Stats.NON_CODING_AVERAGE_GENOMIC_SPAN]: {
      label: 'Average non-coding genomic span',
      primaryUnit: 'bp'
    },
    [Stats.NON_CODING_AVERAGE_SEQUENCE_LENGTH]: {
      label: 'Average non-coding sequence length',
      primaryUnit: 'bp'
    },

    [Stats.NON_CODING_TRANSCRIPTS_PER_GENE]: {
      label: 'Average transcripts per non-coding gene'
    },
    [Stats.NON_CODING_AVERAGE_EXON_LENGTH]: {
      label: 'Average exon length per non-coding transcript',
      primaryUnit: 'bp'
    },
    [Stats.NON_CODING_AVERAGE_EXONS_PER_TRANSCRIPT]: {
      label: 'Average exons per non-coding transcript'
    },
    [Stats.NON_CODING_AVERAGE_INTRON_LENGTH]: {
      label: 'Average intron length per non-coding transcript',
      primaryUnit: 'bp'
    }
  },
  [SpeciesStatsSection.PSEUDOGENES]: {
    [Stats.PSEUDOGENES]: { label: 'Pseudogenes' },
    [Stats.PSEUDOGENES_SHORTEST_GENE_LENGTH]: {
      label: 'Shortest pseudogene',
      primaryUnit: 'bp'
    },
    [Stats.PSEUDOGENES_LONGEST_GENE_LENGTH]: {
      label: 'Longest pseudogene',
      primaryUnit: 'bp'
    },

    [Stats.PSEUDOGENES_TOTAL_TRANSCRIPTS]: {
      label: 'Transcripts in pseudogenes'
    },
    [Stats.PSEUDOGENES_TOTAL_EXONS]: { label: 'Exons in pseudogenes' },
    [Stats.PSEUDOGENES_TOTAL_INTRONS]: { label: 'Introns in pseudogenes' },

    [Stats.PSEUDOGENES_AVERAGE_GENOMIC_SPAN]: {
      label: 'Average pseudogene genomic span',
      primaryUnit: 'bp'
    },
    [Stats.PSEUDOGENES_AVERAGE_SEQUENCE_LENGTH]: {
      label: 'Average pseudogene sequence length',
      primaryUnit: 'bp'
    },

    [Stats.PSEUDOGENES_TRANSCRIPTS_PER_GENE]: {
      label: 'Average transcripts per pseudogene'
    },
    [Stats.PSEUDOGENES_AVERAGE_EXON_LENGTH]: {
      label: 'Average exon length per pseudogene',
      primaryUnit: 'bp'
    },
    [Stats.PSEUDOGENES_AVERAGE_EXONS_PER_TRANSCRIPT]: {
      label: 'Average exons per pseudogene transcript'
    },
    [Stats.PSEUDOGENES_AVERAGE_INTRON_LENGTH]: {
      label: 'Average intron length per pseudogene',
      primaryUnit: 'bp'
    }
  },
  [SpeciesStatsSection.ASSEMBLY]: {
    [Stats.CHROMOSOMES]: {
      label: 'Chromosomes or plasmids',
      headerUnit: 'chromosomes or plasmids'
    },
    [Stats.TOTAL_GENOME_LENGTH]: {
      primaryUnit: 'bp',
      label: 'Total genome length'
    },
    [Stats.TOTAL_CODING_SEQUENCE_LENGTH]: {
      primaryUnit: 'bp',
      label: 'Total coding sequence length'
    },

    [Stats.TOPLEVEL_SEQUENCES]: { label: 'Top level sequences' },
    [Stats.TOTAL_GAP_LENGTH]: { label: 'Total gap length', primaryUnit: 'bp' },
    [Stats.SPANNED_GAP]: { label: 'Spanned gaps' },

    [Stats.COMPONENT_SEQUENCES]: { label: 'Component sequences' },
    [Stats.CONTIG_N50]: { label: 'Contig N50', primaryUnit: 'bp' },

    [Stats.AVERAGE_GC_CONTENT]: {
      primaryValuePostfix: '%',
      label: 'Average GC content'
    }
  },
  [SpeciesStatsSection.HOMOLOGY]: {
    [Stats.HOMOLOGY]: {
      label: 'Homology'
    },
    [Stats.HOMOLOGY_COVERAGE]: {
      label: 'Coverage',
      headerUnit: 'coverage',
      primaryValuePostfix: '%'
    }
  },
  [SpeciesStatsSection.VARIATION]: {
    [Stats.VARIATION]: {
      label: 'Variation'
    },
    [Stats.SHORT_VARIANTS]: {
      label: 'Short variants',
      headerUnit: 'short variants'
    },
    [Stats.STRUCTURAL_VARIANTS]: {
      label: 'Structural variants',
      headerUnit: 'structural variants'
    },
    [Stats.SHORT_VARIANTS_WITH_PHENOTYPE_ASSERTIONS]: {
      preLabel: 'Short variants',
      label: 'With phenotype assertions'
    },
    [Stats.SHORT_VARIANTS_WITH_PUBLICATIONS]: {
      preLabel: 'Short variants',
      label: 'With publications'
    },
    [Stats.SHORT_VARIANTS_FREQUENCY_STUDIES]: {
      preLabel: 'Short variants',
      label: 'Frequency studies'
    },
    [Stats.STRUCTURAL_VARIANTS_WITH_PHENOTYPE_ASSERTIONS]: {
      preLabel: 'Structural variants',
      label: 'With phenotype assertions'
    }
  },
  [SpeciesStatsSection.REGULATION]: {
    [Stats.REGULATION]: {
      label: 'Regulation'
    },
    [Stats.REGULATION_ENHANCERS]: {
      headerUnit: 'enhancers',
      label: 'Enhancers'
    },
    [Stats.REGULATION_PROMOTERS]: {
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
  exampleLinks?: UrlObj;
  summaryStats?: IndividualStat[];
  groups: StatsGroup[];
};

type BuildStatProps = Partial<IndividualStat> & {
  primaryValue: string | number;
  primaryKey: Stats;
  secondaryKey?: Stats;
  section: SpeciesStatsSection;
};

const buildIndividualStat = (
  props: BuildStatProps
): IndividualStat | undefined => {
  let primaryValue = props.primaryValue;

  const { section, primaryKey } = props;

  if (!statsFormattingOptions[section][primaryKey]) {
    return;
  }
  const {
    primaryValuePostfix = '',
    label,
    primaryUnit,
    preLabel,
    helpText
  } = statsFormattingOptions[section][primaryKey] as StatsFormattingOption;

  if (typeof primaryValue === 'number') {
    primaryValue = getCommaSeparatedNumber(primaryValue) + primaryValuePostfix;
  }

  return {
    preLabel,
    label: label || primaryKey,
    primaryValue,
    primaryUnit,
    helpText
  };
};

type BuildHeaderStatProps = {
  primaryValue: string | number;
  primaryKey: Stats;
  section: SpeciesStatsSection;
};

const buildHeaderStat = (
  props: BuildHeaderStatProps
): IndividualStat | undefined => {
  let primaryValue = props.primaryValue;

  const { section, primaryKey } = props;

  const { primaryValuePostfix = '', headerUnit } = statsFormattingOptions[
    section
  ][primaryKey] as StatsFormattingOption;

  if (typeof primaryValue === 'number') {
    primaryValue = getCommaSeparatedNumber(primaryValue) + primaryValuePostfix;
  }

  return {
    label: primaryKey,
    primaryValue: primaryValue,
    primaryUnit: headerUnit
  };
};

const getExampleLinks = (props: {
  section: SpeciesStatsSection;
  genomeIdForUrl: string;
  exampleFocusObjects: ExampleFocusObject[];
}) => {
  const { section, genomeIdForUrl, exampleFocusObjects } = props;

  let exampleLinks: UrlObj = {};

  if (section === SpeciesStatsSection.CODING_STATS) {
    const geneExample = exampleFocusObjects.find(
      (object) => object.type === 'gene'
    );

    const focusId = geneExample?.id
      ? buildFocusIdForUrl({
          type: 'gene',
          objectId: geneExample.id
        })
      : undefined;

    if (focusId) {
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
    }
  }
  // TODO: Uncomment me when we need to re-enable example region links
  // else if (section === SpeciesStatsSection.ASSEMBLY) {
  //   const regionExample = exampleFocusObjects.find(
  //     (object) => object.type === 'region'
  //   );

  //   const focusId = regionExample?.id
  //     ? buildFocusIdForUrl({
  //         type: 'region',
  //         objectId: regionExample.id
  //       })
  //     : undefined;

  //   if (focusId) {
  //     exampleLinks = {
  //       genomeBrowser: {
  //         url: urlFor.browser({
  //           genomeId: genome_id,
  //           focus: focusId
  //         })
  //       }
  //     };
  //   }
  // }

  return exampleLinks;
};

export const getStatsForSection = (props: {
  genome_id: string;
  genomeIdForUrl: string;
  section: SpeciesStatsSection;
  exampleFocusObjects: ExampleFocusObject[];
}): StatsSection | undefined => {
  const { section, genome_id, genomeIdForUrl, exampleFocusObjects } = props;

  const data = sampleData[genome_id][section];

  if (!data) {
    return {
      section
    } as StatsSection;
  }

  const filteredData: {
    [key: string]: string | number;
  } = {};

  Object.keys(data).forEach((key) => {
    if (data[key] || data[key] === 0) {
      filteredData[key] = data[key] as string | number;
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
            section
          })
        : undefined;
    })
    .filter(Boolean);

  const exampleLinks = exampleLinkText
    ? getExampleLinks({
        section,
        genomeIdForUrl,
        exampleFocusObjects
      })
    : undefined;

  const isExpandedContentSame =
    Object.keys(filteredData).length === availableSummaryStatsKeys?.length;

  if (isExpandedContentSame) {
    return {
      section,
      summaryStats,
      exampleLinks
    } as StatsSection;
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
              section
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
