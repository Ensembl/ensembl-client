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
import { Source } from 'src/content/app/entity-viewer/types/source';

export type TrackDetails = {
  track_id: string;
  track_name: string;
  shared_description: string;
  specific_description: string;
  source: Source;
};

export type GenomeTrackDetails = {
  [genomeId: string]: TrackDetails;
};

export const trascDetailsSampleData = {
  homo_sapiens_GCA_000001405_28: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    },
    {
      track_id: 'variant',
      track_name: '1000 Genomes all SNPs and indels',
      specific_description:
        'Shows the Variants genotyped by the 1000 Genomes project (phase 3)'
    }
  ],
  homo_sapiens_GCA_000001405_14: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Part of the GENCODE Comprehensive gene set',
      source: {
        url: 'www.gencodegenes.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    },
    {
      track_id: 'variant',
      track_name: '1000 Genomes all SNPs and indels',
      specific_description:
        'Shows the Variants genotyped by the 1000 Genomes project (phase 3)'
    }
  ],
  triticum_aestivum_GCA_900519105_1: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Genes annotated with high confidence by IWGSC',
      source: {
        url: 'www.wheatgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    },
    {
      track_id: 'variant',
      track_name: 'Sequence variants',
      specific_description: 'Sequence variants from all sources'
    }
  ],
  escherichia_coli_str_k_12_substr_mg1655_GCA_000005845_2: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    }
  ],
  saccharomyces_cerevisiae_GCA_000146045_2: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Annotation imported from SGD',
      source: {
        url: 'www.yeastgenome.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    }
  ],
  plasmodium_falciparum_GCA_000002765_2: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Other genes Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Other genes Reverse strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Protein genes annotated in ENA',
      source: {
        url: 'www.ebi.ac.uk/ena',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    }
  ],
  caenorhabditis_elegans_GCA_000002985_3: [
    {
      track_id: 'gene-pc-fwd',
      track_name: 'Protein coding genes Forward strand',
      shared_description:
        'Shows all protein coding genes on the forward strand of this chromosome',
      specific_description: 'Protein coding model imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-fwd',
      track_name: 'Non coding RNA Forward strand',
      shared_description:
        'Shows all non-coding genes on the forward strand of this chromosome',
      specific_description: 'Non coding RNA imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-pc-rev',
      track_name: 'Protein coding genes Reverse strand',
      shared_description:
        'Shows all protein coding genes on the reverse strand of this chromosome',
      specific_description: 'Protein coding model imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'gene-other-rev',
      track_name: 'Non coding RNA Forward strand',
      shared_description:
        'Shows all non-coding genes on the reverse strand of this chromosome',
      specific_description: 'Non coding RNA imported from Wormbase',
      source: {
        url: 'www.wormbase.org',
        name: 'Gencode',
        id: ''
      }
    },
    {
      track_id: 'contig',
      track_name: 'Reference assembly',
      shared_description: 'Shows the contigs underlying the reference assembly.'
    },
    {
      track_id: 'gc',
      track_name: '%GC',
      shared_description: 'Shows the percentage of Gs and Cs in a region'
    }
  ]
};
