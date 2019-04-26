import faker from 'faker';

export const sampleResults: any = {
  'location.genomic_coordinates': [
    `1:${faker.random.number()}-${faker.random.number()}`,
    `2:${faker.random.number()}-${faker.random.number()}`,
    `3:${faker.random.number()}-${faker.random.number()}`,
    `4:${faker.random.number()}-${faker.random.number()}`,
    `5:${faker.random.number()}-${faker.random.number()}`,
    `6:${faker.random.number()}-${faker.random.number()}`,
    `7:${faker.random.number()}-${faker.random.number()}`,
    `8:${faker.random.number()}-${faker.random.number()}`,
    `9:${faker.random.number()}-${faker.random.number()}`,
    `10:${faker.random.number()}-${faker.random.number()}`
  ],
  'transcripts.id': [
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word()
  ],
  'transcripts.symbol': [
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word()
  ],
  'transcripts.name': [
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word()
  ]
};

export const transcriptTypeFiltersGrid: any = {
  default: {
    protein_coding: {
      id: 'protein_coding',
      label: 'Protein coding',
      checkedStatus: false
    },
    type: {
      id: 'type',
      label: 'Type',
      checkedStatus: false
    }
  }
};

export const geneTypeFiltersGrid: any = {
  default: {
    source: {
      id: 'source',
      label: 'Gene source',
      checkedStatus: false
    },
    type: {
      id: 'type',
      label: 'Type',
      checkedStatus: false
    }
  }
};

export const geneFiltersGrid: any = {
  default: {
    source: {
      id: 'source',
      label: 'Gene source',
      checkedStatus: false
    },
    GENCODE_basic_annotation: {
      id: 'GENCODE_basic_annotation',
      label: 'GENCODE basic annotation',
      checkedStatus: false
    }
  }
};

export const attributes = {
  gene: {
    default: {
      symbol: {
        id: 'symbol',
        label: 'Gene symbol',
        checkedStatus: false
      },
      id: {
        id: 'id',
        label: 'Gene stable ID',
        checkedStatus: false
      },
      id_version: {
        id: 'id_version',
        label: 'Gene stable ID version',
        checkedStatus: false
      },
      name: {
        id: 'name',
        label: 'Gene name',
        checkedStatus: false
      },
      type: {
        id: 'type',
        label: 'Gene type',
        checkedStatus: false
      },
      version_gene: {
        id: 'version_gene',
        label: 'Version (gene)',
        checkedStatus: false
      },
      start: {
        id: 'start',
        label: 'Gene start(bp)',
        checkedStatus: false
      },
      end: {
        id: 'end',
        label: 'Gene end (bp)',
        checkedStatus: false
      },
      gc_content: {
        id: 'gc_content',
        label: 'Gene % GC content',
        checkedStatus: false
      },
      source_gene: {
        id: 'source_gene',
        label: 'Source (gene)',
        checkedStatus: false
      },
      EntrezGene: {
        id: 'EntrezGene',
        label: 'EntrezGene',
        checkedStatus: false
      },
      source_of_name: {
        id: 'source_of_name',
        label: 'Source of gene name',
        checkedStatus: false
      },
      very_long_label: {
        id: 'very_long_label',
        label:
          'Very veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryvery very very very very very very very very very very very very very very very long label',
        checkedStatus: false
      },
      xxxx: {
        id: 'xxxxxx',
        label: 'xxxxxx',
        checkedStatus: false
      }
    },
    External: {
      gencode_basic_annotation: {
        id: 'gencode_basic_annotation',
        label: 'GENCODE basic annotation',
        checkedStatus: false
      },
      uniparc_id: {
        id: 'uniparc_id',
        label: 'UniParc ID',
        checkedStatus: false
      },
      ncbi_id: {
        id: 'ncbi_id',
        label: 'NCBI gene ID',
        checkedStatus: false
      },
      HGNC: {
        id: 'HGNC',
        label: 'HGNC symbol',
        checkedStatus: false
      },
      go_domain: { id: 'go_domain', label: 'GO domain', checkedStatus: false }
    }
  },
  transcripts: {
    default: {
      symbol: {
        id: 'transcripts.symbol',
        label: 'Transcript symbol',
        checkedStatus: true
      },
      name: {
        id: 'transcripts.name',
        label: 'Transcript name',
        checkedStatus: true
      },
      id: {
        id: 'transcripts.id',
        label: 'Transcript stable ID',
        checkedStatus: true
      },
      id_version: {
        id: 'transcripts.id_version',
        label: 'Transcript stable ID version',
        checkedStatus: false
      },
      type: {
        id: 'transcripts.type',
        label: 'Transcript Type',
        checkedStatus: false
      },
      version_transcript: {
        id: 'transcripts.version_transcript',
        label: 'Version (Transcript)',
        checkedStatus: false
      },
      '5_utr_start': {
        id: 'transcripts.5_utr_start',
        label: "5'UTR start",
        checkedStatus: false
      },
      '3_utr_end': {
        id: 'transcripts.3_utr_end',
        label: "3'UTR end",
        checkedStatus: false
      }
    },
    'Microarray probes/probesets': {
      affy_hc_g110_probe: {
        id: 'transcripts.affy_hc_g110_probe',
        label: 'AFFY HC G110 probe',
        checkedStatus: false
      },
      agilent_sureprint_g3_ge_8x60k_probe: {
        id: 'transcripts.agilent_sureprint_g3_ge_8x60k_probe',
        label: 'AGILENT SurePrint G3 GE 8x60k probe',
        checkedStatus: false
      },
      illumina_humanref_8_v3_probe: {
        id: 'transcripts.illumina_humanref_8_v3_probe',
        label: 'ILLUMINA HumanRef 8 V3 probe',
        checkedStatus: false
      },
      affy_hta_2_0_probe: {
        id: 'transcripts.affy_hta_2_0_probe',
        label: 'AFFY HTA 2 0 probe',
        checkedStatus: false
      },
      codelink_codelink_probe: {
        id: 'transcripts.codelink_codelink_probe',
        label: 'CODELINK CODELINK probe',
        checkedStatus: false
      },
      go_domain: {
        id: 'transcripts.go_domain',
        label: 'GO domain',
        checkedStatus: false
      }
    }
  },
  location: {
    default: {
      genomic_coordinates: {
        id: 'location.genomic_coordinates',
        label: 'Genomic coordinates',
        checkedStatus: false
      },
      strand: {
        id: 'location.strand',
        label: 'Strand',
        checkedStatus: false
      },
      start: {
        id: 'location.start',
        label: 'Gene start',
        checkedStatus: false
      },
      end: {
        id: 'location.end',
        label: 'Gene end',
        checkedStatus: false
      }
    }
  },
  germline_variation: {
    default: {
      variant_name: {
        id: 'germline_variation.variant_name',
        label: 'Variant name',
        checkedStatus: false
      },
      variant_source: {
        id: 'germline_variation.variant_source',
        label: 'Variant source',
        checkedStatus: false
      },
      sift_code: {
        id: 'germline_variation.sift_code',
        label: 'SIFT code',
        checkedStatus: false
      },
      protein_allele: {
        id: 'germline_variation.protein_allele',
        label: 'Protein allele',
        checkedStatus: false
      },
      polyphen_score: {
        id: 'germline_variation.polyphen_score',
        label: 'PolyPhen score',
        checkedStatus: false
      }
    },
    location: {
      distance_to_transcript: {
        id: 'germline_variation.distance_to_transcript',
        label: 'Distance to transcript',
        checkedStatus: false
      },
      cds_end: {
        id: 'germline_variation.cds_end',
        label: 'CDS end',
        checkedStatus: false
      },
      chromosomescaffold_position_start_bp: {
        id: 'germline_variation.chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        checkedStatus: false
      },
      protein_location_aa: {
        id: 'germline_variation.protein_location_aa',
        label: 'Protein location (aa)',
        checkedStatus: false
      },
      cds_start: {
        id: 'germline_variation.cds_start',
        label: 'CDS start',
        checkedStatus: false
      }
    }
  },
  somatic_variation: {
    default: {
      variant_name: {
        id: 'somatic_variation.variant_name',
        label: 'Variant name',
        checkedStatus: false
      },
      variant_source: {
        id: 'somatic_variation.variant_source',
        label: 'Variant source',
        checkedStatus: false
      },
      sift_code: {
        id: 'somatic_variation.sift_code',
        label: 'SIFT code',
        checkedStatus: false
      },
      protein_allele: {
        id: 'somatic_variation.protein_allele',
        label: 'Protein allele',
        checkedStatus: false
      },
      polyphen_score: {
        id: 'somatic_variation.polyphen_score',
        label: 'PolyPhen score',
        checkedStatus: false
      }
    },
    location: {
      distance_to_transcript: {
        id: 'somatic_variation.distance_to_transcript',
        label: 'Distance to transcript',
        checkedStatus: false
      },
      cds_end: {
        id: 'somatic_variation.cds_end',
        label: 'CDS end',
        checkedStatus: false
      },
      chromosomescaffold_position_start_bp: {
        id: 'somatic_variation.chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        checkedStatus: false
      },
      protein_location_aa: {
        id: 'somatic_variation.protein_location_aa',
        label: 'Protein location (aa)',
        checkedStatus: false
      },
      cds_start: {
        id: 'somatic_variation.cds_start',
        label: 'CDS start',
        checkedStatus: false
      }
    }
  }
};

export const orthologueAttributes = {
  symbol: {
    id: 'symbol',
    label: 'Gene symbol',
    checkedStatus: false
  },
  id: {
    id: 'id',
    label: 'Gene stable ID',
    checkedStatus: false
  },
  id_version: {
    id: 'id_version',
    label: 'Gene stable ID version',
    checkedStatus: false
  },
  name: {
    id: 'name',
    label: 'Gene name',
    checkedStatus: false
  },
  type: {
    id: 'type',
    label: 'Gene type',
    checkedStatus: false
  },
  version_gene: {
    id: 'version_gene',
    label: 'Version (gene)',
    checkedStatus: false
  },
  start: {
    id: 'start',
    label: 'Gene start(bp)',
    checkedStatus: false
  },
  end: {
    id: 'end',
    label: 'Gene end (bp)',
    checkedStatus: false
  },
  gc_content: {
    id: 'gc_content',
    label: 'Gene % GC content',
    checkedStatus: false
  },
  source_gene: {
    id: 'source_gene',
    label: 'Source (gene)',
    checkedStatus: false
  },
  EntrezGene: {
    id: 'EntrezGene',
    label: 'EntrezGene',
    checkedStatus: false
  },
  source_of_name: {
    id: 'source_of_name',
    label: 'Source of gene name',
    checkedStatus: false
  },
  xxxx: {
    id: 'xxxxxx',
    label: 'xxxxxx',
    checkedStatus: false
  }
};
// Result string
/*
   "[["Transcript symbol","Transcript name","Transcript stable ID"],["voluptates","nostrum","molestiae"],["earum","quo","quasi"],["aut","eum","soluta"],["qui","omnis","accusantium"],["eum","consequatur","et"],["veritatis","nulla","pariatur"],["asperiores","est","facilis"],["rerum","eos","modi"],["aut","non","magni"],["eos","a","aliquam"]]"

  */
