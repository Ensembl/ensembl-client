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
import { ReactElement } from 'react';
import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';

import { getActiveGenomeId } from './speciesGeneralSelectors';

import { SpeciesStatsProps } from 'src/content/app/species/components/species-stats/SpeciesStats';
import { RootState } from 'src/store';

import { sampleData } from '../../sample-data';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

enum Sections {
  CODING_STATS = 'coding_stats',
  NON_CODING_STATS = 'non_coding_stats',
  PSEUDOGENES = 'pseudogene_stats',
  ASSEMBLY_STATS = 'assembly_stats'
}

enum Groups {
  CODING_GENES = 'Coding genes',
  NON_CODING_GENES = 'Non-coding genes',
  ANALYSIS = 'Analysis',
  PSEUDOGENES = 'Pseudogenes',
  ASSEMBLY_STATS = 'Assembly'
}

enum Stats {
  // coding_stats
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
  [key in Sections]: {
    title: Stats | string;
    groups: Groups[];
    primaryStatsKey?: Stats;
    secondaryStatsKey?: Stats;
    exampleLink?: ReactElement;
  };
};

export const sectionGroupsMap: SpeciesStatsSectionGroups = {
  [Sections.CODING_STATS]: {
    title: Stats.CODING_GENES,
    groups: [Groups.CODING_GENES, Groups.ANALYSIS],
    primaryStatsKey: Stats.CODING_GENES
  },
  [Sections.ASSEMBLY_STATS]: {
    title: 'Assembly',
    groups: [Groups.ASSEMBLY_STATS],
    primaryStatsKey: Stats.CHROMOSOMES
  },
  [Sections.PSEUDOGENES]: {
    title: Stats.PSEUDOGENES,
    groups: [Groups.PSEUDOGENES],
    primaryStatsKey: Stats.PSEUDOGENES
  },
  [Sections.NON_CODING_STATS]: {
    title: Stats.NON_CODING_GENES,
    groups: [Groups.NON_CODING_GENES],
    primaryStatsKey: Stats.NON_CODING_GENES
  }
};

const groupsStatsMap = {
  [Groups.CODING_GENES]: [
    Stats.CODING_GENES,
    Stats.SHORTEST_GENE,
    Stats.LONGEST_GENE
  ],
  [Groups.ANALYSIS]: [
    Stats.AVERAGE_GENOMIC_SPAN,
    Stats.AVERAGE_SEQUENCE_LENGTH,
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
  ],
  [Groups.ASSEMBLY_STATS]: [
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
  ],
  [Groups.PSEUDOGENES]: [Stats.PSEUDOGENES],
  [Groups.NON_CODING_GENES]: [
    Stats.NON_CODING_GENES,
    Stats.SMALL_NON_CODING_GENES,
    Stats.LONG_NON_CODING_GENES,
    Stats.MISC_NON_CODING_GENES
  ]
};

const statsFormattingOptions: any = {
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
  stats: SpeciesStatsProps[];
};

export type StatsSection = {
  section: Sections;
  primaryStats?: SpeciesStatsProps;
  secondaryStats?: SpeciesStatsProps;
  groups: StatsGroup[];
};

export type GenomeStats = StatsSection[];

type SpeciesGeneralState = {
  activeGenomeId: string | null;
  stats: {
    [genomeId: string]: GenomeStats | undefined;
  };
};

const initialState: SpeciesGeneralState = {
  activeGenomeId: null,
  stats: {}
};

type BuildStatsProps = Partial<SpeciesStatsProps> & {
  primaryKey: string;
  secondaryKey?: string;
};

const buildStat = (props: BuildStatsProps): SpeciesStatsProps | undefined => {
  let primaryValue = props.primaryValue;

  if (!primaryValue) {
    return;
  }

  const formattingOptions = statsFormattingOptions[props.primaryKey];

  if (!isNaN(Number(primaryValue))) {
    primaryValue = getCommaSeparatedNumber(Number(primaryValue));
  }

  if (formattingOptions?.primaryValuePostfix) {
    primaryValue += formattingOptions?.primaryValuePostfix;
  }

  return {
    label: formattingOptions?.label || props.primaryKey,
    primaryValue,
    primaryUnit: formattingOptions?.primaryUnit
  };
};

const buildHeaderStat = (
  props: BuildStatsProps
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

const getSectionStats = (
  genome_id: string,
  section: Sections
): StatsSection | undefined => {
  const data = sampleData[section][genome_id];

  const { groups, primaryStatsKey, secondaryStatsKey } = sectionGroupsMap[
    section
  ];

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

  return {
    section,
    primaryStats,
    secondaryStats,
    groups: groups.map((group) => {
      const stats = groupsStatsMap[group];
      return {
        title: group,
        stats: stats
          .map((stat) =>
            buildStat({ primaryKey: stat, primaryValue: data[stat] })
          )
          .filter(Boolean)
      };
    })
  } as StatsSection;
};

export const fetchStatsForActiveGenome = (): ThunkAction<
  void,
  any,
  null,
  Action<string>
> => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getActiveGenomeId(state);
  if (!activeGenomeId) {
    return;
  }

  const speciesStats = [
    ...Object.values(Sections).map((section) =>
      getSectionStats(activeGenomeId, section)
    )
  ].filter(Boolean) as GenomeStats;

  dispatch(
    speciesGeneralSlice.actions.setStatsForGenomeId({
      genomeId: activeGenomeId,
      stats: speciesStats
    })
  );
};

const speciesGeneralSlice = createSlice({
  name: 'species-page-general',
  initialState,
  reducers: {
    setActiveGenomeId(state, action: PayloadAction<string>) {
      state.activeGenomeId = action.payload;
    },

    setStatsForGenomeId(
      state,
      action: PayloadAction<{ genomeId: string; stats: GenomeStats }>
    ) {
      state.stats[action.payload.genomeId] = action.payload.stats;
    }
  }
});

export const {
  setActiveGenomeId,
  setStatsForGenomeId
} = speciesGeneralSlice.actions;

export default speciesGeneralSlice.reducer;
