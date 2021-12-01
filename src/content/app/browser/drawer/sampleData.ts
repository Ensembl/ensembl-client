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

// FIXME: Not sure if we need to use source here. If yes, we need to move the type definition to the shared folder.
import { Source } from 'src/shared/types/thoas/source';

export type TrackDetails = {
  track_id: string;
  track_name: string;
  strand: 'forward' | 'reverse' | null;
  description?: string;
  source?: Source;
};

export type GenomeTrackDetails = {
  [genomeId: string]: {
    [trackId: string]: TrackDetails;
  };
};

export const trackDetailsSampleData: GenomeTrackDetails = {
  homo_sapiens_GCA_000001405_28: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    },
    'track:variant': {
      track_id: 'variant',
      track_name: '1000 Genomes all SNPs and indels',
      strand: null,
      description:
        'Shows the Variants genotyped by the 1000 Genomes project (phase 3)'
    }
  },
  homo_sapiens_GCA_000001405_14: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    },
    'track:variant': {
      track_id: 'variant',
      track_name: '1000 Genomes all SNPs and indels',
      strand: null,
      description:
        'Shows the Variants genotyped by the 1000 Genomes project (phase 3)'
    }
  },
  triticum_aestivum_GCA_900519105_1: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'IWGSC',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'GENCODE',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    },
    'track:variant': {
      track_id: 'variant',
      track_name: 'Sequence variants',
      strand: null,
      description: 'Sequence variants from all sources'
    }
  },
  escherichia_coli_str_k_12_substr_mg1655_gca_000005845_GCA_000005845_2: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    }
  },
  saccharomyces_cerevisiae_GCA_000146045_2: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'SGD',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'SGD',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'SGD',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'SGD',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    }
  },
  plasmodium_falciparum_GCA_000002765_2: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Other genes',
      strand: 'reverse',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'ENA',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    }
  },
  caenorhabditis_elegans_GCA_000002985_3: {
    'track:gene-pc-fwd': {
      track_id: 'track:gene-pc-fwd',
      track_name: 'Protein coding genes',
      strand: 'forward',
      description:
        'Shows all protein coding genes on the forward strand of this chromosome. Protein coding model imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Wormbase',
        id: ''
      }
    },
    'track:gene-other-fwd': {
      track_id: 'gene-other-fwd',
      track_name: 'Non coding RNA',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the forward strand of this chromosome. Non coding RNA imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Wormbase',
        id: ''
      }
    },
    'track:gene-pc-rev': {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes',
      strand: 'reverse',
      description:
        'Shows all protein coding genes on the reverse strand of this chromosome. Protein coding model imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Wormbase',
        id: ''
      }
    },
    'track:gene-other-rev': {
      track_id: 'gene-other-rev',
      track_name: 'Non coding RNA',
      strand: 'forward',
      description:
        'Shows all non-coding genes on the reverse strand of this chromosome. Non coding RNA imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Wormbase',
        id: ''
      }
    },
    'track:contig': {
      track_id: 'contig',
      track_name: 'Reference assembly',
      strand: null,
      description: 'Shows the contigs underlying the reference assembly.'
    },
    'track:gc': {
      track_id: 'gc',
      track_name: '%GC',
      strand: null,
      description: 'Shows the percentage of Gs and Cs in a region'
    }
  }
};
