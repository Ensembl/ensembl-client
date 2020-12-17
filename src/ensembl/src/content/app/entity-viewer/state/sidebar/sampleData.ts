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

import { EntityViewerSidebarPayload } from './entityViewerSidebarState';
import { DataSetType } from '../../types/dataSet';

export const entityViewerWheatSampleResponse: EntityViewerSidebarPayload = {
  gene: {
    symbol: 'TraesCS3D02G273600.1',
    id: 'ENSG00000139618.15',
    metadata: {
      name: {
        value: 'UniProtKB/TrEMBL;Acc:Q9SPH4',
        description: 'Heat shock protein 101',
        source_uri: 'https://www.uniprot.org/',
        source: {
          name: 'UniProt',
          url: 'https://www.genenames.org',
          id: 'UniProtKB/TrEMBL;Acc:Q9SPH4'
        }
      }
    },
    transcripts: [
      {
        id: 'TraesCS3D02G273600.1'
      },
      {
        id: 'TraesCS3D02G273600.2'
      }
    ],
    filters: {
      transcript: {
        sequence: [
          {
            id: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            id: 'cDNA',
            label: 'cDNA'
          },
          {
            id: 'CDS',
            label: 'CDS'
          },
          {
            id: 'Protein sequence',
            label: 'Protein sequence'
          }
        ],
        tark_url: 'http://betatark.ensembl.org/web/search/'
      }
    }
  },
  other_assemblies: [
    {
      species_name: 'Bread wheat ',
      assembly_name: 'ASM34745v1',
      stable_id: 'TRIUR3_14529'
    },
    {
      species_name: 'Durum wheat',
      assembly_name: 'Svevo.v1',
      stable_id: 'TRITD4Av1G160860'
    },
    {
      species_name: 'Emmer wheat',
      assembly_name: 'WEWSeq_v.1.0',
      stable_id: 'TRIDC4BG042680'
    }
  ],
  other_data_sets: [
    { type: DataSetType.CURRENT_ASSEMBLY, value: 'IWGSC' },
    { type: DataSetType.GENE, value: 'TraesCS3D02G273600.1' },
    { type: DataSetType.PROTEIN, value: 'TraesCS3D02G273600.1' }
  ],
  homeologues: [
    {
      type: 'Gene',
      stable_id: 'TraesCS3A02G274400'
    },
    {
      type: 'Gene',
      stable_id: 'TraesCS3B02G308100'
    }
  ]
};

export const entityViewerHomoSapiensSampleResponse: EntityViewerSidebarPayload = {
  gene: {
    symbol: 'BRCA2',
    id: 'ENSG00000139618.15',
    synonyms: ['BRCC2', 'FACD', 'FAD', 'FAD1', 'FANCD', 'FANCD1', 'XRCC11'],
    attributes: ['protein coding', 'another attribute'],
    function: {
      description: `Involved in double-strand break repair and/or homologous
                recombination. Binds RAD51 and potentiates recombinational DNA
                repair by promoting assembly of RAD51 onto singlestranded DNA
                (ssDNA). Acts by targeting RAD51 to ssDNA over double-stranded
                DNA, enabling RAD51 to displace replication protein-A (RPA) from
                ssDNA and stabilizing RAD51-ssDNA filaments by blocking ATP
                hydrolysis. May participate in S phase checkpoint activation.
                Binds selectively to ssDNA, and to ssDNA in tailed duplexes and
                replication fork structures. In concert with NPM1, regulates
                centrosome duplication`,
      source: {
        name: 'UniProt',
        id: 'P51587',
        url: 'https://www.uniprot.org/uniprot/P51587'
      }
    },
    metadata: {
      name: {
        value: 'HGNC:1101',
        description: 'BRCA2 DNA repair associated',
        source_uri:
          'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:1101',
        source: {
          name: 'Human Gene Naming Consortium',
          url: 'https://www.genenames.org',
          id: 'HGNC:1101'
        }
      }
    },
    transcripts: [
      {
        id: 'ENST00000380152.7',
        xrefs: [
          {
            name: 'Human Protein Atlas',
            id: 'HPA026815',
            url: ''
          },
          {
            name: 'UCSC Stable ID',
            id: 'ENST00000380152.7',
            url: ''
          },
          {
            name: 'UniParc',
            id: 'UPI00001FCBCC',
            url: ''
          }
        ]
      },
      {
        id: 'ENST00000544455.5'
      },
      {
        id: 'ENST00000530893.6'
      },
      {
        id: 'ENST00000670614.1'
      },
      {
        id: 'ENST00000671466.1'
      },
      {
        id: 'ENST00000665585.1',
        xrefs: [
          {
            name: 'UniParc',
            id: 'UPI00114938A5',
            url: ''
          }
        ]
      },
      {
        id: 'ENST00000470094.1'
      },
      {
        id: 'ENST00000666593.1'
      },
      {
        id: 'ENST00000528762.1'
      },
      {
        id: 'ENST00000533776.1',
        xrefs: [
          {
            name: 'RNAcentral',
            id: 'URS0000EACAD8',
            url: ''
          },
          {
            name: 'UCSC Stable ID',
            id: 'ENST00000533776.1',
            url: ''
          }
        ]
      },
      {
        id: 'ENST00000614259.1'
      }
    ],
    filters: {
      transcript: {
        sequence: [
          {
            id: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            id: 'cDNA',
            label: 'cDNA'
          },
          {
            id: 'CDS',
            label: 'CDS'
          },
          {
            id: 'Protein sequence',
            label: 'Protein sequence'
          }
        ],
        tark_url: 'http://betatark.ensembl.org/web/search/'
      }
    }
  },
  other_assemblies: [
    {
      species_name: 'Human',
      assembly_name: 'GRCh37',
      stable_id: 'ENSG00000139618'
    }
  ],
  other_data_sets: [
    { type: DataSetType.CURRENT_ASSEMBLY, value: 'GRCh38.p13' },
    { type: DataSetType.GENE, value: 'ENSG00000139618.15' }
  ],
  homeologues: [
    {
      type: 'Gene',
      stable_id: 'TraesCS3A02G274400'
    },
    {
      type: 'Gene',
      stable_id: 'TraesCS3B02G308100'
    }
  ]
};

export const entityViewerBacteriaSampleResponse: EntityViewerSidebarPayload = {
  gene: {
    symbol: 'grpE',
    id: 'b2614',
    synonyms: ['b2614', 'ECK2610', 'JW2594'],
    metadata: {
      name: {
        description: 'heat shock protein'
      }
    },
    function: {
      description:
        'Participates actively in the response to hyperosmotic and heat shock by preventing the aggregation of stress-denatured proteins, in association with DnaK and GrpE. It is the nucleotide exchange factor for DnaK and may function as a thermosensor. Unfolded proteins bind initially to DnaJ; upon interaction with the DnaJ-bound protein, DnaK hydrolyzes its bound ATP, resulting in the formation of a stable complex. GrpE releases ADP from DnaK; ATP binding to DnaK triggers the release of the substrate protein, thus completing the reaction cycle. Several rounds of ATP-dependent interactions between DnaJ, DnaK and GrpE are required for fully efficient folding',
      source: {
        name: 'UniProt',
        id: 'P09372',
        url: 'https://www.uniprot.org/uniprot/P51587'
      }
    },
    transcripts: [
      {
        id: 'CHEMBL1293284',
        xrefs: [
          {
            name: 'ChEMBL',
            id: 'CHEMBL1293284',
            url: ''
          }
        ]
      },
      {
        id: 'TraesCS3D02G273600.2'
      }
    ],
    filters: {
      transcript: {
        sequence: [
          {
            id: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            id: 'cDNA',
            label: 'cDNA'
          },
          {
            id: 'CDS',
            label: 'CDS'
          },
          {
            id: 'Protein sequence',
            label: 'Protein sequence'
          }
        ],
        tark_url: 'http://betatark.ensembl.org/web/search/'
      }
    }
  },

  other_data_sets: [
    { type: DataSetType.CURRENT_ASSEMBLY, value: 'ASM584v2' },
    { type: DataSetType.GENE, value: 'grpE b2614' },
    { type: DataSetType.PROTEIN, value: 'AAC75663' }
  ]
};

export const entityViewerYeastSampleResponse: EntityViewerSidebarPayload = {
  gene: {
    symbol: 'SFA1',
    id: 'YDL168W',
    metadata: {
      name: {
        value: 'SGD;Acc:S000002327',
        description: 'Sensitive to FormAldehyde',
        source: {
          name: '',
          id: 'SGD;Acc:S000002327',
          url: ''
        }
      }
    },
    synonyms: ['ADH5'],
    function: {
      description:
        'Oxidizes long-chain alcohols and, in the presence of glutathione, is able to oxidize formaldehyde. Is responsible for yeast resistance to formaldehyde',
      source: {
        name: 'UniProt',
        id: 'P32771',
        url: 'https://www.uniprot.org/uniprot/P32771'
      }
    },
    transcripts: [
      {
        id: 'RefSeq DNA',
        xrefs: [
          {
            name: 'RefSeq DNA',
            id: 'NM_001180228.1',
            url: ''
          }
        ]
      },
      {
        id: 'STRING',
        xrefs: [
          {
            name: 'STRING',
            id: '4932.YDL168W',
            url: ''
          }
        ]
      }
    ],
    filters: {
      transcript: {
        sequence: [
          {
            id: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            id: 'cDNA',
            label: 'cDNA'
          },
          {
            id: 'CDS',
            label: 'CDS'
          },
          {
            id: 'Protein sequence',
            label: 'Protein sequence'
          }
        ],
        tark_url: 'http://betatark.ensembl.org/web/search/'
      }
    }
  },

  other_data_sets: [
    { type: DataSetType.CURRENT_ASSEMBLY, value: 'R64-1-1' },
    { type: DataSetType.GENE, value: 'SFA1 YDL168W' },
    { type: DataSetType.PROTEIN, value: 'YDL168W' }
  ]
};

export const entityViewerSidebarSampleData: {
  [genomeId: string]: {
    entities: { [entityId: string]: EntityViewerSidebarPayload };
  };
} = {
  homo_sapiens_GCA_000001405_14: {
    entities: {
      'homo_sapiens_GCA_000001405_14:gene:ENSG00000139618': entityViewerHomoSapiensSampleResponse
    }
  },
  homo_sapiens_GCA_000001405_28: {
    entities: {
      'homo_sapiens_GCA_000001405_28:gene:ENSG00000139618': entityViewerHomoSapiensSampleResponse
    }
  },

  triticum_aestivum_GCA_900519105_1: {
    entities: {
      'triticum_aestivum_GCA_900519105_1:gene:TraesCS3D02G273600': entityViewerWheatSampleResponse
    }
  },
  escherichia_coli_str_k_12_substr_mg1655_GCA_000005845_2: {
    entities: {
      'escherichia_coli_str_k_12_substr_mg1655_GCA_000005845_2:gene:b2614': entityViewerBacteriaSampleResponse
    }
  },
  saccharomyces_cerevisiae_GCA_000146045_2: {
    entities: {
      'saccharomyces_cerevisiae_GCA_000146045_2:gene:YDL168W': entityViewerYeastSampleResponse
    }
  }
};
