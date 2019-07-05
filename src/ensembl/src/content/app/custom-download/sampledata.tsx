export const transcriptTypeFiltersGrid: any = {
  default: {
    protein_coding: {
      id: 'protein_coding',
      label: 'Protein coding',
      isChecked: false
    },
    type: {
      id: 'type',
      label: 'Type',
      isChecked: false
    }
  }
};

export const geneTypeFiltersGrid: any = {
  default: {
    source: {
      id: 'source',
      label: 'Gene source',
      isChecked: false
    },
    type: {
      id: 'type',
      label: 'Type',
      isChecked: false
    }
  }
};

export const attributes = {
  gene: {
    default: {
      name: {
        id: 'name',
        label: 'Gene symbol',
        isChecked: false
      },
      id: {
        id: 'id',
        label: 'Gene stable ID',
        isChecked: false
      },
      id_version: {
        id: 'id_version',
        label: 'Gene stable ID version',
        isChecked: false
      },
      Superfamily: {
        id: 'Superfamily',
        label: 'Superfamily',
        isChecked: false
      },
      strand: {
        id: 'strand',
        label: 'Strand',
        isChecked: false
      },
      start: {
        id: 'start',
        label: 'Gene start(bp)',
        isChecked: false
      },
      end: {
        id: 'end',
        label: 'Gene end (bp)',
        isChecked: false
      },
      UniParc: {
        id: 'UniParc',
        label: 'UniParc',
        isChecked: false
      },
      source: {
        id: 'source',
        label: 'Source (gene)',
        isChecked: false
      },
      BioGRID: {
        id: 'BioGRID',
        label: 'BioGRID',
        isChecked: false
      },
      Smart: {
        id: 'Smart',
        label: 'Smart',
        isChecked: false
      }
    },
    External: {
      gencode_basic_annotation: {
        id: 'gencode_basic_annotation',
        label: 'GENCODE basic annotation',
        isChecked: false
      },
      uniparc_id: {
        id: 'uniparc_id',
        label: 'UniParc ID',
        isChecked: false
      },
      ncbi_id: {
        id: 'ncbi_id',
        label: 'NCBI gene ID',
        isChecked: false
      },
      HGNC: {
        id: 'HGNC',
        label: 'HGNC symbol',
        isChecked: false
      },
      go_domain: { id: 'go_domain', label: 'GO domain', isChecked: false }
    }
  },
  transcripts: {
    default: {
      'transcripts.biotype': {
        id: 'transcripts.biotype',
        label: 'Biotype',
        isChecked: true
      },
      'transcripts.name': {
        id: 'transcripts.name',
        label: 'Transcript name',
        isChecked: true
      },
      'transcripts.id': {
        id: 'transcripts.id',
        label: 'Transcript stable ID',
        isChecked: true
      },
      'transcripts.AGD_TRANSCRIPT': {
        id: 'transcripts.AGD_TRANSCRIPT',
        label: 'Ashbya Genome Database',
        isChecked: false
      },
      'transcripts.type': {
        id: 'transcripts.type',
        label: 'Transcript Type',
        isChecked: false
      },
      'transcripts.UniGene': {
        id: 'transcripts.UniGene',
        label: 'UniGene',
        isChecked: false
      },
      'transcripts.Pfam': {
        id: 'transcripts.Pfam',
        label: 'Pfam',
        isChecked: false
      },
      'transcripts.HGNC_trans_name': {
        id: 'transcripts.HGNC_trans_name',
        label: 'HGNC_trans_name',
        isChecked: false
      },
      'transcripts.start': {
        id: 'transcripts.start',
        label: 'Start',
        isChecked: false
      },
      'transcripts.end': {
        id: 'transcripts.end',
        label: 'End',
        isChecked: false
      },
      'transcripts.Interpro': {
        id: 'transcripts.Interpro',
        label: 'Interpro',
        isChecked: false
      },
      'transcripts.Smart': {
        id: 'transcripts.Smart',
        label: 'Smart',
        isChecked: false
      },
      'transcripts.analysis': {
        id: 'transcripts.analysis',
        label: 'Analysis',
        isChecked: false
      }
    },
    'Microarray probes/probesets': {
      'transcripts.affy_hc_g110_probe': {
        id: 'transcripts.affy_hc_g110_probe',
        label: 'AFFY HC G110 probe',
        isChecked: false
      },
      'transcripts.agilent_sureprint_g3_ge_8x60k_probe': {
        id: 'transcripts.agilent_sureprint_g3_ge_8x60k_probe',
        label: 'AGILENT SurePrint G3 GE 8x60k probe',
        isChecked: false
      },
      'transcripts.illumina_humanref_8_v3_probe': {
        id: 'transcripts.illumina_humanref_8_v3_probe',
        label: 'ILLUMINA HumanRef 8 V3 probe',
        isChecked: false
      },
      'transcripts.affy_hta_2_0_probe': {
        id: 'transcripts.affy_hta_2_0_probe',
        label: 'AFFY HTA 2 0 probe',
        isChecked: false
      },
      'transcripts.codelink_codelink_probe': {
        id: 'transcripts.codelink_codelink_probe',
        label: 'CODELINK CODELINK probe',
        isChecked: false
      },
      'transcripts.go_domain': {
        id: 'transcripts.go_domain',
        label: 'GO domain',
        isChecked: false
      }
    }
  },
  location: {
    default: {
      'location.genomic_coordinates': {
        id: 'location.genomic_coordinates',
        label: 'Genomic coordinates',
        isChecked: false
      },
      'location.strand': {
        id: 'location.strand',
        label: 'Strand',
        isChecked: false
      },
      'location.start': {
        id: 'location.start',
        label: 'Gene start',
        isChecked: false
      },
      'location.end': {
        id: 'location.end',
        label: 'Gene end',
        isChecked: false
      }
    }
  },
  germline_variation: {
    default: {
      'germline_variation.variant_name': {
        id: 'germline_variation.variant_name',
        label: 'Variant name',
        isChecked: false
      },
      'germline_variation.variant_source': {
        id: 'germline_variation.variant_source',
        label: 'Variant source',
        isChecked: false
      },
      'germline_variation.sift_code': {
        id: 'germline_variation.sift_code',
        label: 'SIFT code',
        isChecked: false
      },
      'germline_variation.protein_allele': {
        id: 'germline_variation.protein_allele',
        label: 'Protein allele',
        isChecked: false
      },
      'germline_variation.polyphen_score': {
        id: 'germline_variation.polyphen_score',
        label: 'PolyPhen score',
        isChecked: false
      }
    },
    location: {
      'germline_variation.distance_to_transcript': {
        id: 'germline_variation.distance_to_transcript',
        label: 'Distance to transcript',
        isChecked: false
      },
      'germline_variation.cds_end': {
        id: 'germline_variation.cds_end',
        label: 'CDS end',
        isChecked: false
      },
      'germline_variation.chromosomescaffold_position_start_bp': {
        id: 'germline_variation.chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        isChecked: false
      },
      'germline_variation.protein_location_aa': {
        id: 'germline_variation.protein_location_aa',
        label: 'Protein location (aa)',
        isChecked: false
      },
      'germline_variation.cds_start': {
        id: 'germline_variation.cds_start',
        label: 'CDS start',
        isChecked: false
      }
    }
  },
  somatic_variation: {
    default: {
      'somatic_variation.variant_name': {
        id: 'somatic_variation.variant_name',
        label: 'Variant name',
        isChecked: false
      },
      'somatic_variation.variant_source': {
        id: 'somatic_variation.variant_source',
        label: 'Variant source',
        isChecked: false
      },
      'somatic_variation.sift_code': {
        id: 'somatic_variation.sift_code',
        label: 'SIFT code',
        isChecked: false
      },
      'somatic_variation.protein_allele': {
        id: 'somatic_variation.protein_allele',
        label: 'Protein allele',
        isChecked: false
      },
      'somatic_variation.polyphen_score': {
        id: 'somatic_variation.polyphen_score',
        label: 'PolyPhen score',
        isChecked: false
      }
    },
    location: {
      'somatic_variation.distance_to_transcript': {
        id: 'somatic_variation.distance_to_transcript',
        label: 'Distance to transcript',
        isChecked: false
      },
      'somatic_variation.cds_end': {
        id: 'somatic_variation.cds_end',
        label: 'CDS end',
        isChecked: false
      },
      'somatic_variation.chromosomescaffold_position_start_bp': {
        id: 'somatic_variation.chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        isChecked: false
      },
      'somatic_variation.protein_location_aa': {
        id: 'somatic_variation.protein_location_aa',
        label: 'Protein location (aa)',
        isChecked: false
      },
      'somatic_variation.cds_start': {
        id: 'somatic_variation.cds_start',
        label: 'CDS start',
        isChecked: false
      }
    }
  }
};

export const orthologueAttributes = {
  symbol: {
    id: 'symbol',
    label: 'Gene symbol',
    isChecked: false
  },
  id: {
    id: 'id',
    label: 'Gene stable ID',
    isChecked: false
  },
  id_version: {
    id: 'id_version',
    label: 'Gene stable ID version',
    isChecked: false
  },
  name: {
    id: 'name',
    label: 'Gene name',
    isChecked: false
  },
  type: {
    id: 'type',
    label: 'Gene type',
    isChecked: false
  },
  version_gene: {
    id: 'version_gene',
    label: 'Version (gene)',
    isChecked: false
  },
  start: {
    id: 'start',
    label: 'Gene start(bp)',
    isChecked: false
  },
  end: {
    id: 'end',
    label: 'Gene end (bp)',
    isChecked: false
  },
  gc_content: {
    id: 'gc_content',
    label: 'Gene % GC content',
    isChecked: false
  },
  source_gene: {
    id: 'source_gene',
    label: 'Source (gene)',
    isChecked: false
  },
  EntrezGene: {
    id: 'EntrezGene',
    label: 'EntrezGene',
    isChecked: false
  },
  source_of_name: {
    id: 'source_of_name',
    label: 'Source of gene name',
    isChecked: false
  },
  xxxx: {
    id: 'xxxxxx',
    label: 'xxxxxx',
    isChecked: false
  }
};
// Result string
/*
   "[["Transcript symbol","Transcript name","Transcript stable ID"],["voluptates","nostrum","molestiae"],["earum","quo","quasi"],["aut","eum","soluta"],["qui","omnis","accusantium"],["eum","consequatur","et"],["veritatis","nulla","pariatur"],["asperiores","est","facilis"],["rerum","eos","modi"],["aut","non","magni"],["eos","a","aliquam"]]"

  */

export const orthologueSpecies = {
  species: [
    {
      groups: [
        'rnaseq',
        'funcgen',
        'otherfeatures',
        'core',
        'cdna',
        'variation'
      ],
      name: 'homo_sapiens',
      assembly: 'GRCh38',
      strain: null,
      display_name: 'Human',
      release: 96,
      division: 'EnsemblVertebrates',
      accession: 'GCA_000001405.27',
      strain_collection: null,
      aliases: [
        'hsapiens',
        'human',
        'hsap',
        'homo sapiens',
        'enshs',
        'homsap',
        'homo',
        'h_sapiens',
        '9606'
      ],
      taxon_id: '9606',
      common_name: 'human'
    },

    {
      common_name: 'Tiger',
      taxon_id: '74533',
      strain_collection: null,
      aliases: ['tiger'],
      accession: 'GCA_000464555.1',
      division: 'EnsemblVertebrates',
      release: 96,
      display_name: 'Tiger',
      strain: null,
      assembly: 'PanTig1.0',
      name: 'panthera_tigris_altaica',
      groups: ['core', 'otherfeatures', 'rnaseq']
    },
    {
      groups: ['rnaseq', 'funcgen', 'otherfeatures', 'core'],
      name: 'microcebus_murinus',
      assembly: 'Mmur_3.0',
      strain: null,
      display_name: 'Mouse Lemur',
      release: 96,
      division: 'EnsemblVertebrates',
      accession: 'GCA_000165445.3',
      aliases: [
        'micmur',
        'gray mouse lemur',
        'mouse_lemur',
        'mmurinus',
        'grey mouse lemur',
        'mmur',
        '30608',
        'mouse lemur',
        'microcebus murinus'
      ],
      strain_collection: null,
      common_name: 'gray mouse lemur',
      taxon_id: '30608'
    },
    {
      common_name: 'giant panda',
      taxon_id: '9646',
      aliases: [
        'amel',
        'amelanoleuca',
        'ailuropoda melanoleuca',
        'giant panda',
        'ailmel1',
        'ailmel',
        'panda',
        '9646'
      ],
      strain_collection: null,
      accession: 'GCA_000004335.1',
      division: 'EnsemblVertebrates',
      strain: null,
      display_name: 'Panda',
      release: 96,
      name: 'ailuropoda_melanoleuca',
      assembly: 'ailMel1',
      groups: ['otherfeatures', 'core']
    },
    {
      groups: ['rnaseq', 'core', 'otherfeatures'],
      name: 'takifugu_rubripes',
      assembly: 'FUGU5',
      strain: null,
      release: 96,
      display_name: 'Fugu',
      division: 'EnsemblVertebrates',
      accession: 'GCA_000180615.2',
      aliases: [
        'takifugu',
        'takrub',
        't_rubripes',
        'takifugu rubripes',
        'torafugu',
        'fugu',
        'trubripes',
        'trub',
        '31033'
      ],
      strain_collection: null,
      taxon_id: '31033',
      common_name: 'torafugu'
    },
    {
      strain_collection: null,
      aliases: [],
      accession: 'GCA_003336285.1',
      common_name: 'steppe mouse',
      taxon_id: '10103',
      name: 'mus_spicilegus',
      assembly: 'MUSP714',
      groups: ['core', 'rnaseq'],
      division: 'EnsemblVertebrates',
      strain: null,
      display_name: 'Steppe mouse',
      release: 96
    },
    {
      accession: 'GCA_000181335.4',
      aliases: [
        'fcatus',
        'domestic cat',
        'felis catus',
        '9685',
        'cat',
        'felcat',
        'fcat'
      ],
      strain_collection: null,
      common_name: 'domestic cat',
      taxon_id: '9685',
      groups: ['variation', 'otherfeatures', 'core', 'rnaseq', 'funcgen'],
      assembly: 'Felis_catus_9.0',
      name: 'felis_catus',
      release: 96,
      display_name: 'Cat',
      strain: null,
      division: 'EnsemblVertebrates'
    },
    {
      name: 'maylandia_zebra',
      assembly: 'M_zebra_UMD2a',
      groups: ['rnaseq', 'core', 'otherfeatures'],
      division: 'EnsemblVertebrates',
      strain: null,
      release: 96,
      display_name: 'Zebra mbuna',
      strain_collection: null,
      aliases: [],
      accession: 'GCA_000238955.5',
      common_name: 'zebra mbuna',
      taxon_id: '106582'
    },
    {
      common_name: 'bottlenosed dolphin',
      taxon_id: '9739',
      aliases: [
        'tursiops truncatus',
        '9739',
        'ttru',
        'dolphin',
        'turtru',
        'ttruncatus',
        'bottlenose dolphin',
        'tursiopstruncatus',
        'bottlenosed dolphin'
      ],
      strain_collection: null,
      accession: null,
      division: 'EnsemblVertebrates',
      release: 96,
      display_name: 'Dolphin',
      strain: null,
      assembly: 'turTru1',
      name: 'tursiops_truncatus',
      groups: ['core']
    },
    {
      common_name: 'western european house mouse',
      taxon_id: '10092',
      accession: 'GCA_001624835.1',
      strain_collection: 'mouse',
      aliases: [
        'mmusculus_domesticus_wsbeij',
        '10092',
        'mouse wsbeij',
        'mus musculus domesticus wsbeij',
        'mus_musculus_domesticus_wsbeij',
        'western european house mouse'
      ],
      strain: 'WSB/EiJ',
      release: 96,
      display_name: 'Mouse WSB/EiJ',
      division: 'EnsemblVertebrates',
      groups: ['funcgen', 'core'],
      name: 'mus_musculus_wsbeij',
      assembly: 'WSB_EiJ_v1'
    },
    {
      division: 'EnsemblVertebrates',
      strain: 'DBA/2J',
      display_name: 'Mouse DBA/2J',
      release: 96,
      name: 'mus_musculus_dba2j',
      assembly: 'DBA_2J_v1',
      groups: ['funcgen', 'core'],
      taxon_id: '10090',
      common_name: 'house mouse',
      strain_collection: 'mouse',
      aliases: [],
      accession: 'GCA_001624505.1'
    },
    {
      groups: ['otherfeatures', 'core'],
      name: 'nothoprocta_perdicaria',
      assembly: 'notPer1',
      strain: null,
      release: 96,
      display_name: 'Chilean tinamou',
      division: 'EnsemblVertebrates',
      accession: 'GCA_003342845.1',
      strain_collection: null,
      aliases: [],
      common_name: 'birds',
      taxon_id: '30464'
    },
    {
      division: 'EnsemblVertebrates',
      strain: 'FVB/NJ',
      display_name: 'Mouse FVB/NJ',
      release: 96,
      name: 'mus_musculus_fvbnj',
      assembly: 'FVB_NJ_v1',
      groups: ['core', 'funcgen'],
      taxon_id: '10090',
      common_name: 'house mouse',
      strain_collection: 'mouse',
      aliases: [],
      accession: 'GCA_001624535.1'
    },
    {
      strain_collection: null,
      aliases: [
        '10181',
        'hglaber_male',
        'hetgla',
        'naked mole-rat',
        'heterocephalus glaber male',
        'hgla',
        'naked mole-rat male'
      ],
      accession: 'GCA_000230445.1',
      taxon_id: '10181',
      common_name: 'naked mole-rat',
      assembly: 'HetGla_1.0',
      name: 'heterocephalus_glaber_male',
      groups: ['rnaseq', 'core', 'otherfeatures'],
      division: 'EnsemblVertebrates',
      release: 96,
      display_name: 'Naked mole-rat male',
      strain: null
    },
    {
      groups: ['variation', 'otherfeatures', 'core', 'rnaseq', 'funcgen'],
      assembly: 'EquCab3.0',
      name: 'equus_caballus',
      display_name: 'Horse',
      release: 96,
      strain: null,
      division: 'EnsemblVertebrates',
      accession: 'GCA_002863925.1',
      aliases: [
        'equus caballus',
        'horse',
        'ecab',
        '9796',
        'equcab',
        'ecaballus',
        'equuscaballus'
      ],
      strain_collection: null,
      common_name: 'horse',
      taxon_id: '9796'
    }
  ]
};
