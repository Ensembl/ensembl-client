export const previewResult = [];

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
        checkedStatus: true
      },
      id_version: {
        id: 'id_version',
        label: 'Gene stable ID version',
        checkedStatus: false
      },
      name: {
        id: 'name',
        label: 'Gene name',
        checkedStatus: true
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
        id: 'symbol',
        label: 'Transcript symbol',
        checkedStatus: false
      },
      name: {
        id: 'name',
        label: 'Transcript name',
        checkedStatus: false
      },
      id: {
        id: 'id',
        label: 'Transcript stable ID',
        checkedStatus: false
      },
      id_version: {
        id: 'id_version',
        label: 'Transcript stable ID version',
        checkedStatus: false
      },
      type: {
        id: 'type',
        label: 'Transcript Type',
        checkedStatus: false
      },
      version_transcript: {
        id: 'version_transcript',
        label: 'Version (Transcript)',
        checkedStatus: false
      },
      '5_utr_start': {
        id: '5_utr_start',
        label: "5'UTR start",
        checkedStatus: false
      },
      '3_utr_end': {
        id: '3_utr_end',
        label: "3'UTR end",
        checkedStatus: false
      }
    },
    'Microarray probes/probesets': {
      affy_hc_g110_probe: {
        id: 'affy_hc_g110_probe',
        label: 'AFFY HC G110 probe',
        checkedStatus: false
      },
      agilent_sureprint_g3_ge_8x60k_probe: {
        id: 'agilent_sureprint_g3_ge_8x60k_probe',
        label: 'AGILENT SurePrint G3 GE 8x60k probe',
        checkedStatus: false
      },
      illumina_humanref_8_v3_probe: {
        id: 'illumina_humanref_8_v3_probe',
        label: 'ILLUMINA HumanRef 8 V3 probe',
        checkedStatus: false
      },
      affy_hta_2_0_probe: {
        id: 'affy_hta_2_0_probe',
        label: 'AFFY HTA 2 0 probe',
        checkedStatus: false
      },
      codelink_codelink_probe: {
        id: 'codelink_codelink_probe',
        label: 'CODELINK CODELINK probe',
        checkedStatus: false
      },
      go_domain: { id: 'go_domain', label: 'GO domain', checkedStatus: false }
    }
  },
  germline_variation: {
    default: {
      variant_name: {
        id: 'variant_name',
        label: 'Variant name',
        checkedStatus: false
      },
      variant_source: {
        id: 'variant_source',
        label: 'Variant source',
        checkedStatus: false
      },
      sift_code: {
        id: 'sift_code',
        label: 'SIFT code',
        checkedStatus: false
      },
      protein_allele: {
        id: 'protein_allele',
        label: 'Protein allele',
        checkedStatus: false
      },
      polyphen_score: {
        id: 'polyphen_score',
        label: 'PolyPhen score',
        checkedStatus: false
      }
    },
    location: {
      distance_to_transcript: {
        id: 'distance_to_transcript',
        label: 'Distance to transcript',
        checkedStatus: false
      },
      cds_end: {
        id: 'cds_end',
        label: 'CDS end',
        checkedStatus: false
      },
      chromosomescaffold_position_start_bp: {
        id: 'chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        checkedStatus: false
      },
      protein_location_aa: {
        id: 'protein_location_aa',
        label: 'Protein location (aa)',
        checkedStatus: false
      },
      cds_start: {
        id: 'cds_start',
        label: 'CDS start',
        checkedStatus: false
      }
    }
  },

  somatic_variation: {
    default: {
      variant_name: {
        id: 'variant_name',
        label: 'Variant name',
        checkedStatus: false
      },
      variant_source: {
        id: 'variant_source',
        label: 'Variant source',
        checkedStatus: false
      },
      sift_code: {
        id: 'sift_code',
        label: 'SIFT code',
        checkedStatus: false
      },
      protein_allele: {
        id: 'protein_allele',
        label: 'Protein allele',
        checkedStatus: false
      },
      polyphen_score: {
        id: 'polyphen_score',
        label: 'PolyPhen score',
        checkedStatus: false
      }
    },
    location: {
      distance_to_transcript: {
        id: 'distance_to_transcript',
        label: 'Distance to transcript',
        checkedStatus: false
      },
      cds_end: {
        id: 'cds_end',
        label: 'CDS end',
        checkedStatus: false
      },
      chromosomescaffold_position_start_bp: {
        id: 'chromosomescaffold_position_start_bp',
        label: 'Chromosome/scaffold position start (bp)',
        checkedStatus: false
      },
      protein_location_aa: {
        id: 'protein_location_aa',
        label: 'Protein location (aa)',
        checkedStatus: false
      },
      cds_start: {
        id: 'cds_start',
        label: 'CDS start',
        checkedStatus: false
      }
    }
  }
};
