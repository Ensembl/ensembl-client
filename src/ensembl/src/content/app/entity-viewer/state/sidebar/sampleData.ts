import { EntityViewerSidebarPayload } from './entityViewerSidebarState';
import { DataSetType } from '../../types/dataSet';

export const entityViewerHomoSapiensSampleResponse: EntityViewerSidebarPayload = {
  gene: {
    symbol: 'BRCA2',
    name: 'BRCA2, DNA repair associated',
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
        value: 'P51587',
        url: 'https://www.uniprot.org/uniprot/P51587'
      }
    },
    xrefs: [
      {
        source_name: 'Expression Atlas',
        links: [
          {
            name: 'Expression Atlas',
            value: 'ENSG00000139618',
            url: ''
          }
        ]
      },
      {
        source_name: 'GENCODE comprehensive gene set',
        links: [
          {
            name: 'GENCODE comprehensive gene set',
            value: 'GENCODE',
            url: ''
          }
        ]
      },
      {
        source_name: 'Human CCDS',
        links: [
          {
            name: 'Human CCDS',
            value: 'PCCDS9344.1',
            url: ''
          }
        ]
      },
      {
        source_name: 'LRG',
        links: [
          {
            name: 'LRG',
            value: 'LRG_293',
            url: ''
          }
        ]
      },
      {
        source_name: 'NCBI Gene ID',
        links: [
          {
            name: 'NCBI Gene ID',
            value: '675',
            url: ''
          }
        ]
      },
      {
        source_name: 'OMIM',
        links: [
          {
            name: 'OMIM',
            value: '600185',
            url: ''
          }
        ]
      },

      {
        source_name: 'Reactome',
        links: [
          {
            name: 'Cell Cycle',
            value: 'R-HSA-1640170',
            url: ''
          },
          {
            name: 'DNA Double-Strand Break Repair',
            value: 'R-HSA-5693532',
            url: ''
          },
          {
            name: 'DNA Repair',
            value: 'R-HSA-73894',
            url: ''
          },
          {
            name: 'HDR through Homologous Recombination (HRR)',
            value: 'R-HSA-5685942',
            url: ''
          },
          {
            name:
              'HDR through Homologous Recombination (HRR) or Single Strand Annealing (SSA)',
            value: 'R-HSA-5693567',
            url: ''
          }
        ]
      },

      {
        source_name: 'UniProt',
        links: [
          {
            name: 'UniProt',
            value: 'P51587',
            url: ''
          }
        ]
      },

      {
        source_name: 'WikiGene',
        links: [
          {
            name: 'WikiGene',
            value: 'BRCA2',
            url: ''
          }
        ]
      }
    ],
    transcripts: [
      {
        id: 'ENST00000380152.7',
        xrefs: [
          {
            name: 'Human Protein Atlas',
            value: 'HPA026815',
            url: ''
          },
          {
            name: 'UCSC Stable ID',
            value: 'ENST00000380152.7',
            url: ''
          },
          {
            name: 'UniParc',
            value: 'UPI00001FCBCC',
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
            value: 'UPI00114938A5',
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
            value: 'URS0000EACAD8',
            url: ''
          },
          {
            name: 'UCSC Stable ID',
            value: 'ENST00000533776.1',
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
            value: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            value: 'cDNA',
            label: 'cDNA'
          },
          {
            value: 'CDS',
            label: 'CDS'
          },
          {
            value: 'Protein sequence',
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
  ],
  publications: [
    {
      title: 'Identification of the breast cancer susceptibility gene BRCA2.',
      description:
        'Wooster R, Bignell G, Lancaster J, Swift S, Seal S, Mangion J, Collins N, Gregory S, Gumbs C, Micklem G, Barfoot R, Hamoudi R, Patel S, Rice C, Biggs P, Hashim Y, Smith A, Connor F, Stratton MR',
      source: {
        url: '',
        value: 'Europe PMC',
        name: ''
      }
    },
    {
      title:
        'The complete BRCA2 gene and mutations in chromosome 13q-linked kindreds',
      description:
        'Tavtigian SV, Simard J, Rommens J, Couch F, Shattuck-Eidens D, Neuhausen S, Merajver S, Thorlacius S, Offit K, Stoppa-Lyonnet D, Belanger C, Bell R, Berry S, Bogden R, Chen Q, Davis T, Dumont M, Frye C, Goldar DE',
      source: {
        url: '',
        value: 'Europe PMC',
        name: ''
      }
    },
    {
      title: '',
      description: '',
      source: {
        url: '',
        value: 'NIEHS SNPs program',
        name: 'Submitted (OCT-2003) to the EMBL/GenBank/DDBJ databases'
      }
    },
    {
      title: 'The DNA sequence and analysis of human chromosome 13.',
      description:
        'Dunham A, Matthews LH, Burton J, Ashurst JL, Howe KL, Ashcroft KJ, Beare DM, Burford DC, Hunt SE, Griffiths-Jones S, Jones MC, Keenan SJ, Oliver K, Scott CE, Ainscough R, Almeida JP, Ambrose KD, Andrews DT, Ross MT',
      source: {
        url: '',
        value: 'Europe PMC',
        name: ''
      }
    },
    {
      title:
        'Germline BRCA2 6174delT mutations in Ashkenazi Jewish pancreatic cancer patients.',
      description:
        'Ozcelik H, Schmocker B, Di Nicola N, Shi X H, Langer B, Moore M, Taylor BR, Narod SA, Darlington G, Andrulis IL, Gallinger S, Redston M',
      source: {
        url: '',
        value: 'Europe PMC',
        name: ''
      }
    }
  ]
};

export const entityViewerSidebarSampleData: {
  [genomeId: string]: {
    objects: { [entityId: string]: EntityViewerSidebarPayload };
  };
} = {
  homo_sapiens_GCA_000001405_27: {
    objects: {
      'homo_sapiens_GCA_000001405_27:gene:ENSG00000139618': entityViewerHomoSapiensSampleResponse
    }
  }
};
