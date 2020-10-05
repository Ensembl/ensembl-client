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

import { SpeciesStatsProps } from 'src/content/app/species/components/species-stats/SpeciesStats';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import { sampleData } from '../../sample-data';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { urlObj } from 'src/shared/components/view-in-app/ViewInApp';

export enum SpeciesStatsSections {
  CODING_STATS = 'coding_stats',
  NON_CODING_STATS = 'non_coding_stats',
  PSEUDOGENES = 'pseudogene_stats',
  ASSEMBLY_STATS = 'assembly_stats'
}

// SpeciesStatsSections -> Groups
enum Groups {
  CODING_GENES = 'Coding genes',
  NON_CODING_GENES = 'Non-coding genes',
  ANALYSIS = 'Analysis',
  PSEUDOGENES = 'Pseudogenes',
  ASSEMBLY_STATS = 'Assembly'
}

// SpeciesStatsSections -> Groups -> Stats
enum Stats {
  // Coding stats
  CODING_GENES = 'Coding genes',
  SHORTEST_GENE = 'Shortest gene',
  LONGEST_GENE = 'Longest gene',
  AVERAGE_GENOMIC_SPAN = 'Average genomic span',
  AVERAGE_SEQUENCE_LENGTH = 'Average sequence length',
  AVERAGE_CDS_LENGTH = 'Average CDS length',
  TOTAL_TRANSCRIPTS = 'Total transcripts',
  CODING_TRANSCRIPTS = 'Coding transcripts',
  TRANSCRIPTS_PER_GENE = 'Transcripts per gene',
  CODING_TRANSCRIPTS_PER_GENE = 'Coding transcripts per gene',
  TOTAL_EXONS = 'Total exons',
  TOTAL_CODING_EXONS = 'Total coding exons',
  AVERAGE_EXON_LENGTH = 'Average exon length',
  AVERAGE_CODING_EXON_LENGTH = 'Average coding exon length',
  AVERAGE_EXONS_PER_TRANSCRIPT = 'Average exons per transcript',
  AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT = 'Average coding exons per coding transcript',
  TOTAL_INTRONS = 'Total introns',
  AVERAGE_INTRON_LENGTH = 'Average intron length',

  // Assembly Stats
  CHROMOSOMES = 'Chromosomes',
  TOTAL_GENOME_LENGTH = 'Total genome length',
  TOTAL_CODING_SEQUENCE_LENGTH = 'Total coding sequence length',
  TOTAL_GAP_LENGTH = 'Total gap length',
  SPANNED_GAP = 'Spanned gaps',
  TOPLEVEL_SEQUENCES = 'Toplevel sequences',
  COMPONENT_SEQUENCES = 'Component sequences',
  AVERAGE_GC_CONTENT = '% GC',
  ASSEMBLY_NAME = 'Assembly name',
  ASSEMBLY_DATE = 'Assembly date',
  ASSEMBLY_ACCESSION = 'Assembly accession',
  CONTIG_N50 = 'Contig N50',
  TAXONOMY_ID = 'Taxonomy id',
  BREED_CULTIVAR_STRAIN = 'Breed/Cultivar/Strain',
  SEX = 'Sex',
  SCIENTIFIC_NAME = 'Scientific name',

  // Non coding stats
  NON_CODING_GENES = 'Non-coding genes',
  SMALL_NON_CODING_GENES = 'Small non-coding genes',
  LONG_NON_CODING_GENES = 'Long non-coding genes',
  MISC_NON_CODING_GENES = 'Misc non-coding genes',

  // Psuedogene stats
  PSEUDOGENES = 'Pseudogenes'
}

type SpeciesStatsSectionGroups = {
  [key in SpeciesStatsSections]: {
    title: Stats | string;
    groups: Groups[];
    primaryStatsKey?: Stats;
    secondaryStatsKey?: Stats;
    hasExampleLink?: boolean;
    exampleLinkText?: string;
  };
};

// Maps the groups to it's respective section
export const sectionGroupsMap: SpeciesStatsSectionGroups = {
  [SpeciesStatsSections.CODING_STATS]: {
    title: Stats.CODING_GENES,
    hasExampleLink: true,
    exampleLinkText: 'Example gene',
    groups: [Groups.CODING_GENES, Groups.ANALYSIS],
    primaryStatsKey: Stats.CODING_GENES
  },
  [SpeciesStatsSections.ASSEMBLY_STATS]: {
    title: 'Assembly',
    hasExampleLink: true,
    exampleLinkText: 'Example region',
    groups: [Groups.ASSEMBLY_STATS],
    primaryStatsKey: Stats.CHROMOSOMES
  },
  [SpeciesStatsSections.PSEUDOGENES]: {
    title: Stats.PSEUDOGENES,
    groups: [Groups.PSEUDOGENES],
    primaryStatsKey: Stats.PSEUDOGENES
  },
  [SpeciesStatsSections.NON_CODING_STATS]: {
    title: Stats.NON_CODING_GENES,
    groups: [Groups.NON_CODING_GENES],
    primaryStatsKey: Stats.NON_CODING_GENES
  }
};

// Maps the individual stats to it's respective groups
const groupsStatsMap = {
  [Groups.CODING_GENES]: [
    [Stats.CODING_GENES, Stats.SHORTEST_GENE, Stats.LONGEST_GENE]
  ],
  [Groups.ANALYSIS]: [
    [Stats.AVERAGE_GENOMIC_SPAN, Stats.AVERAGE_SEQUENCE_LENGTH],
    [
      Stats.AVERAGE_CDS_LENGTH,
      Stats.TOTAL_TRANSCRIPTS,
      Stats.CODING_TRANSCRIPTS,
      Stats.TRANSCRIPTS_PER_GENE,
      Stats.CODING_TRANSCRIPTS_PER_GENE,
      Stats.TOTAL_EXONS,
      Stats.TOTAL_CODING_EXONS,
      Stats.AVERAGE_EXON_LENGTH,
      Stats.AVERAGE_CODING_EXON_LENGTH,
      Stats.AVERAGE_EXONS_PER_TRANSCRIPT,
      Stats.AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT,
      Stats.TOTAL_INTRONS,
      Stats.AVERAGE_INTRON_LENGTH
    ]
  ],
  [Groups.ASSEMBLY_STATS]: [
    [
      Stats.CHROMOSOMES,
      Stats.TOTAL_GENOME_LENGTH,
      Stats.TOTAL_CODING_SEQUENCE_LENGTH,
      Stats.AVERAGE_GC_CONTENT,
      Stats.TOTAL_GAP_LENGTH,
      Stats.SPANNED_GAP,
      Stats.TOPLEVEL_SEQUENCES,
      Stats.COMPONENT_SEQUENCES,
      Stats.ASSEMBLY_NAME,
      Stats.ASSEMBLY_DATE,
      Stats.ASSEMBLY_ACCESSION,
      Stats.CONTIG_N50,
      Stats.TAXONOMY_ID,
      Stats.BREED_CULTIVAR_STRAIN,
      Stats.SEX,
      Stats.SCIENTIFIC_NAME
    ]
  ],
  [Groups.PSEUDOGENES]: [[Stats.PSEUDOGENES]],
  [Groups.NON_CODING_GENES]: [
    [
      Stats.NON_CODING_GENES,
      Stats.SMALL_NON_CODING_GENES,
      Stats.LONG_NON_CODING_GENES,
      Stats.MISC_NON_CODING_GENES
    ]
  ]
};

// Individual stat formatting options.
type StatsFormattingOptions = {
  [key in Stats]?: {
    label?: string;
    headerUnit?: string;
    primaryUnit?: string;
    secondaryUnit?: string;
    primaryValuePostfix?: string;
  };
};

const statsFormattingOptions: StatsFormattingOptions = {
  [Stats.CODING_GENES]: {
    label: 'Coding genes'
  },
  [Stats.SHORTEST_GENE]: {
    label: 'Shortest coding gene',
    primaryUnit: 'bp'
  },
  [Stats.LONGEST_GENE]: {
    label: 'Longest coding gene',
    primaryUnit: 'bp'
  },
  [Stats.CHROMOSOMES]: {
    label: 'Chromosomes or plasmids',
    headerUnit: 'chromosomes or plasmids'
  },
  [Stats.TOTAL_GENOME_LENGTH]: {
    primaryUnit: 'bp'
  },
  [Stats.TOTAL_CODING_SEQUENCE_LENGTH]: {
    primaryUnit: 'bp'
  },
  [Stats.AVERAGE_GC_CONTENT]: {
    primaryValuePostfix: '%'
  },
  [Stats.NON_CODING_GENES]: {
    primaryUnit: 'bp'
  },
  [Stats.SMALL_NON_CODING_GENES]: {
    primaryUnit: 'bp'
  },
  [Stats.LONG_NON_CODING_GENES]: {
    primaryUnit: 'bp'
  },
  [Stats.MISC_NON_CODING_GENES]: {
    primaryUnit: 'bp'
  }
};

type StatsGroup = {
  title: string;
  stats: [SpeciesStatsProps[]];
};

export type StatsSection = {
  section: SpeciesStatsSections;
  exampleLinks?: Partial<urlObj>;
  primaryStats?: SpeciesStatsProps;
  secondaryStats?: SpeciesStatsProps;
  groups: StatsGroup[];
};

type BuildStatProps = Partial<SpeciesStatsProps> & {
  primaryKey: Stats;
  secondaryKey?: Stats;
};

const buildIndividualStat = (
  props: BuildStatProps
): SpeciesStatsProps | undefined => {
  let primaryValue = props.primaryValue;

  if (!primaryValue) {
    return;
  }

  const formattingOptions = statsFormattingOptions[props.primaryKey];

  if (!isNaN(Number(primaryValue))) {
    primaryValue = getCommaSeparatedNumber(Number(primaryValue));
  }

  return {
    label: formattingOptions?.label || props.primaryKey,
    primaryValue,
    primaryUnit: formattingOptions?.primaryUnit,
    primaryValuePostfix: formattingOptions?.primaryValuePostfix
  };
};

const buildHeaderStat = (
  props: BuildStatProps
): SpeciesStatsProps | undefined => {
  let primaryValue = props.primaryValue;

  if (!primaryValue) {
    return;
  }

  const formattingOptions = statsFormattingOptions[props.primaryKey];

  if (!isNaN(Number(primaryValue))) {
    primaryValue = getCommaSeparatedNumber(Number(primaryValue));
  }

  return {
    label: props.primaryKey,
    primaryValue,
    primaryUnit: formattingOptions?.headerUnit
  };
};

const getExampleLinks = (props: {
  section: SpeciesStatsSections;
  genome_id: string;
  exampleFocusObjects: ExampleFocusObject[];
}) => {
  const { section, genome_id, exampleFocusObjects } = props;

  const exampleLinks: Partial<urlObj> = {};

  if (section === SpeciesStatsSections.CODING_STATS) {
    const geneExample = exampleFocusObjects.find(
      (object) => object.type === 'gene'
    );

    const focusId = geneExample?.id
      ? buildFocusIdForUrl({
          type: 'gene',
          objectId: geneExample?.id
        })
      : undefined;

    exampleLinks.genomeBrowser = focusId
      ? urlFor.browser({
          genomeId: genome_id,
          focus: focusId
        })
      : undefined;

    exampleLinks.entityViewer = focusId
      ? urlFor.entityViewer({
          genomeId: genome_id,
          entityId: focusId
        })
      : undefined;
  } else if (section === SpeciesStatsSections.ASSEMBLY_STATS) {
    const regionExample = exampleFocusObjects.find(
      (object) => object.type === 'region'
    );

    const focusId = regionExample?.id
      ? buildFocusIdForUrl({
          type: 'region',
          objectId: regionExample?.id
        })
      : undefined;

    exampleLinks.genomeBrowser = focusId
      ? urlFor.browser({
          genomeId: genome_id,
          focus: focusId
        })
      : undefined;
  }

  return exampleLinks;
};

export const getStatsForSection = (props: {
  genome_id: string;
  section: SpeciesStatsSections;
  exampleFocusObjects: ExampleFocusObject[];
}): StatsSection | undefined => {
  const { section, genome_id, exampleFocusObjects } = props;

  const data = sampleData[section][genome_id];

  const {
    groups,
    primaryStatsKey,
    secondaryStatsKey,
    hasExampleLink
  } = sectionGroupsMap[section];

  if (!data || !groups) {
    return;
  }
  const primaryStats = primaryStatsKey
    ? buildHeaderStat({
        primaryKey: primaryStatsKey,
        primaryValue: data[primaryStatsKey]
      })
    : undefined;
  const secondaryStats = secondaryStatsKey
    ? buildHeaderStat({
        primaryKey: secondaryStatsKey,
        primaryValue: data[secondaryStatsKey]
      })
    : undefined;

  const exampleLinks = hasExampleLink
    ? getExampleLinks({
        section,
        genome_id,
        exampleFocusObjects
      })
    : undefined;

  return {
    section,
    primaryStats,
    secondaryStats,
    exampleLinks,
    groups: groups.map((group) => {
      const groupStats = groupsStatsMap[group];
      return {
        title: group,
        stats: groupStats
          .map((subGroupStats) => {
            return subGroupStats.map((stat) =>
              buildIndividualStat({
                primaryKey: stat,
                primaryValue: data[stat]
              })
            );
          })

          .filter(Boolean)
      };
    })
  } as StatsSection;
};
