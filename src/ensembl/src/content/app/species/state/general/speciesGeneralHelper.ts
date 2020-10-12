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

export enum SpeciesStatsSection {
  CODING_STATS = 'coding_stats',
  NON_CODING_STATS = 'non_coding_stats',
  PSEUDOGENES = 'pseudogene_stats',
  ASSEMBLY_STATS = 'assembly_stats'
}

// SpeciesStatsSection -> Groups
enum Groups {
  CODING_GENES = 'Coding genes',
  NON_CODING_GENES = 'Non-coding genes',
  ANALYSIS = 'Analysis',
  PSEUDOGENES = 'Pseudogenes',
  ASSEMBLY_STATS = 'Assembly'
}

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

  // assembly_Stats
  CHROMOSOMES = 'chromosomes',
  TOTAL_GENOME_LENGTH = 'total_genome_length',
  TOTAL_CODING_SEQUENCE_LENGTH = 'total_coding_sequence_length',
  TOTAL_GAP_LENGTH = 'total_gap_length',
  SPANNED_GAP = 'spanned_gaps',
  TOPLEVEL_SEQUENCES = 'toplevel_sequences',
  COMPONENT_SEQUENCES = 'component_sequences',
  AVERAGE_GC_CONTENT = 'gc_percentage',
  ASSEMBLY_NAME = 'assembly_name',
  ASSEMBLY_DATE = 'assembly_date',
  ASSEMBLY_ACCESSION = 'assembly_accession',
  CONTIG_N50 = 'contig_n50',
  TAXONOMY_ID = 'taxonomy_id',
  STRAIN = 'strain',
  SEX = 'sex',
  SCIENTIFIC_NAME = 'scientific_name',

  // Non coding stats
  NON_CODING_GENES = 'non_coding_genes',
  SMALL_NON_CODING_GENES = 'small_non_coding_genes',
  LONG_NON_CODING_GENES = 'long_non_coding_genes',
  MISC_NON_CODING_GENES = 'misc_non_coding_genes',

  // Psuedogene stats
  PSEUDOGENES = 'pseudogenes'
}

type SpeciesStatsSectionGroups = {
  [key in SpeciesStatsSection]: {
    title: Stats | string;
    groups: Groups[];
    primaryStatsKey?: Stats;
    secondaryStatsKey?: Stats;
    exampleLinkText?: string;
  };
};

// Maps the groups to it's respective section
export const sectionGroupsMap: SpeciesStatsSectionGroups = {
  [SpeciesStatsSection.CODING_STATS]: {
    title: 'Coding genes',
    exampleLinkText: 'Example gene',
    groups: [Groups.CODING_GENES, Groups.ANALYSIS],
    primaryStatsKey: Stats.CODING_GENES
  },
  [SpeciesStatsSection.ASSEMBLY_STATS]: {
    title: 'Assembly',
    exampleLinkText: 'Example region',
    groups: [Groups.ASSEMBLY_STATS],
    primaryStatsKey: Stats.CHROMOSOMES
  },
  [SpeciesStatsSection.PSEUDOGENES]: {
    title: 'Pseudogenes',
    groups: [Groups.PSEUDOGENES],
    primaryStatsKey: Stats.PSEUDOGENES
  },
  [SpeciesStatsSection.NON_CODING_STATS]: {
    title: 'Non-coding genes',
    groups: [Groups.NON_CODING_GENES],
    primaryStatsKey: Stats.NON_CODING_GENES
  }
};

// Maps the individual stats to it's respective groups
const groupsStatsMap = {
  [Groups.CODING_GENES]: [
    [Stats.CODING_GENES, Stats.SHORTEST_GENE_LENGTH, Stats.LONGEST_GENE_LENGTH]
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
      Stats.STRAIN,
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
  [key in Stats]: {
    label: string;
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
  [Stats.SHORTEST_GENE_LENGTH]: {
    label: 'Shortest coding gene',
    primaryUnit: 'bp'
  },
  [Stats.LONGEST_GENE_LENGTH]: {
    label: 'Longest coding gene',
    primaryUnit: 'bp'
  },
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
  [Stats.AVERAGE_GC_CONTENT]: {
    primaryValuePostfix: '%',
    label: '% GC'
  },
  [Stats.NON_CODING_GENES]: {
    primaryUnit: 'bp',
    label: 'Non-coding genes'
  },
  [Stats.SMALL_NON_CODING_GENES]: {
    primaryUnit: 'bp',
    label: 'Small non-coding genes'
  },
  [Stats.LONG_NON_CODING_GENES]: {
    primaryUnit: 'bp',
    label: 'Long non-coding genes'
  },
  [Stats.MISC_NON_CODING_GENES]: {
    primaryUnit: 'bp',
    label: 'Misc non-coding genes'
  },
  [Stats.AVERAGE_GENOMIC_SPAN]: { label: 'Average genomic span' },
  [Stats.AVERAGE_SEQUENCE_LENGTH]: { label: 'Average sequence length' },
  [Stats.AVERAGE_CDS_LENGTH]: { label: 'Average CDS length' },
  [Stats.TOTAL_TRANSCRIPTS]: { label: 'Total transcripts' },
  [Stats.CODING_TRANSCRIPTS]: { label: 'Coding transcripts' },
  [Stats.TRANSCRIPTS_PER_GENE]: { label: 'Transcripts per gene' },
  [Stats.CODING_TRANSCRIPTS_PER_GENE]: { label: 'Coding transcripts per gene' },
  [Stats.TOTAL_EXONS]: { label: 'Total exons' },
  [Stats.TOTAL_CODING_EXONS]: { label: 'Total coding exons' },
  [Stats.AVERAGE_EXON_LENGTH]: { label: 'Average exon length' },
  [Stats.AVERAGE_CODING_EXON_LENGTH]: { label: 'Average coding exon length' },
  [Stats.AVERAGE_EXONS_PER_TRANSCRIPT]: {
    label: 'Average exons per transcript'
  },
  [Stats.AVERAGE_CODING_EXONS_PER_CODING_TRANSCRIPT]: {
    label: 'Average coding exons per coding transcript'
  },
  [Stats.TOTAL_INTRONS]: { label: 'Total introns' },
  [Stats.AVERAGE_INTRON_LENGTH]: { label: 'Average intron length' },
  [Stats.CHROMOSOMES]: { label: 'Chromosomes' },
  [Stats.TOTAL_GAP_LENGTH]: { label: 'Total gap length' },
  [Stats.SPANNED_GAP]: { label: 'Spanned gaps' },
  [Stats.TOPLEVEL_SEQUENCES]: { label: 'Toplevel sequences' },
  [Stats.COMPONENT_SEQUENCES]: { label: 'Component sequences' },
  [Stats.ASSEMBLY_NAME]: { label: 'Assembly name' },
  [Stats.ASSEMBLY_DATE]: { label: 'Assembly date' },
  [Stats.ASSEMBLY_ACCESSION]: { label: 'Assembly accession' },
  [Stats.CONTIG_N50]: { label: 'Contig N50' },
  [Stats.TAXONOMY_ID]: { label: 'Taxonomy id' },
  [Stats.STRAIN]: { label: 'Breed/Cultivar/Strain' },
  [Stats.SEX]: { label: 'Sex' },
  [Stats.SCIENTIFIC_NAME]: { label: 'Scientific name' },
  [Stats.PSEUDOGENES]: { label: 'Pseudogenes' }
};

type IndividualStat = Omit<
  SpeciesStatsProps,
  'primaryValue' | 'secondaryValue'
> & {
  primaryValue: string | number | null;
  secondaryValue?: string | number | null;
};

type StatsGroup = {
  title: string;
  stats: [IndividualStat[]];
};

export type StatsSection = {
  section: SpeciesStatsSection;
  exampleLinks?: Partial<urlObj>;
  primaryStats?: IndividualStat;
  secondaryStats?: IndividualStat;
  groups: StatsGroup[];
};

type BuildStatProps = Partial<IndividualStat> & {
  primaryKey: Stats;
  secondaryKey?: Stats;
};

const buildIndividualStat = (
  props: BuildStatProps
): IndividualStat | undefined => {
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

const buildHeaderStat = (props: BuildStatProps): IndividualStat | undefined => {
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
  section: SpeciesStatsSection;
  genome_id: string;
  exampleFocusObjects: ExampleFocusObject[];
}) => {
  const { section, genome_id, exampleFocusObjects } = props;

  const exampleLinks: Partial<urlObj> = {};

  if (section === SpeciesStatsSection.CODING_STATS) {
    const geneExample = exampleFocusObjects.find(
      (object) => object.type === 'gene'
    );

    const focusId = geneExample?.id
      ? buildFocusIdForUrl({
          type: 'gene',
          objectId: geneExample?.id
        })
      : undefined;

    if (focusId) {
      exampleLinks.genomeBrowser = urlFor.browser({
        genomeId: genome_id,
        focus: focusId
      });

      exampleLinks.entityViewer = urlFor.entityViewer({
        genomeId: genome_id,
        entityId: focusId
      });
    }
  } else if (section === SpeciesStatsSection.ASSEMBLY_STATS) {
    const regionExample = exampleFocusObjects.find(
      (object) => object.type === 'region'
    );

    const focusId = regionExample?.id
      ? buildFocusIdForUrl({
          type: 'region',
          objectId: regionExample?.id
        })
      : undefined;

    if (focusId) {
      exampleLinks.genomeBrowser = urlFor.browser({
        genomeId: genome_id,
        focus: focusId
      });
    }
  }

  return exampleLinks;
};

export const getStatsForSection = (props: {
  genome_id: string;
  section: SpeciesStatsSection;
  exampleFocusObjects: ExampleFocusObject[];
}): StatsSection | undefined => {
  const { section, genome_id, exampleFocusObjects } = props;

  const data = sampleData[genome_id][section];

  const {
    groups,
    primaryStatsKey,
    secondaryStatsKey,
    exampleLinkText
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

  const exampleLinks = exampleLinkText
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
            return subGroupStats
              .map((stat) =>
                buildIndividualStat({
                  primaryKey: stat,
                  primaryValue: data[stat]
                })
              )
              .filter(Boolean);
          })
          .filter(Boolean)
      };
    })
  } as StatsSection;
};
