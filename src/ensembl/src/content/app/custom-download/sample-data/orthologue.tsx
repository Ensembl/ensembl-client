export const orthologueAttributes = {
  id: 'orthologues',
  type: 'checkbox_grid',
  label: '',
  options: [
    {
      id: 'symbol',
      label: 'Gene symbol',
      isChecked: false,
      order: 2
    },
    {
      id: 'id',
      label: 'Gene stable ID',
      isChecked: false,
      order: 3
    },
    {
      id: 'id_version',
      label: 'Gene stable ID version',
      isChecked: false,
      order: 4
    },
    {
      id: 'name',
      label: 'Gene name',
      isChecked: false,
      order: 1
    },
    {
      id: 'type',
      label: 'Gene type',
      isChecked: false,
      order: 5
    },
    {
      id: 'version_gene',
      label: 'Version (gene)',
      isChecked: false,
      order: 6
    },
    {
      id: 'start',
      label: 'Gene start(bp)',
      isChecked: false,
      order: 7
    },
    {
      id: 'end',
      label: 'Gene end (bp)',
      isChecked: false,
      order: 8
    },
    {
      id: 'gc_content',
      label: 'Gene % GC content',
      isChecked: false,
      order: 9
    },
    {
      id: 'source_gene',
      label: 'Source (gene)',
      isChecked: false,
      order: 10
    },
    {
      id: 'EntrezGene',
      label: 'EntrezGene',
      isChecked: false,
      order: 11
    },
    {
      id: 'source_of_name',
      label: 'Source of gene name',
      isChecked: false,
      order: 12
    }
  ]
};

export const orthologueSpecies = {
  species: [
    {
      name: 'homo_sapiens',
      assembly: 'GRCh38',
      display_name: 'Human'
    },

    {
      display_name: 'Tiger',
      assembly: 'PanTig1.0',
      name: 'panthera_tigris_altaica'
    },
    {
      name: 'microcebus_murinus',
      assembly: 'Mmur_3.0',
      display_name: 'Mouse Lemur'
    },
    {
      display_name: 'Panda',
      name: 'ailuropoda_melanoleuca',
      assembly: 'ailMel1'
    },
    {
      name: 'takifugu_rubripes',
      assembly: 'FUGU5',
      display_name: 'Fugu'
    },
    {
      name: 'mus_spicilegus',
      assembly: 'MUSP714',
      display_name: 'Steppe mouse'
    },
    {
      assembly: 'Felis_catus_9.0',
      name: 'felis_catus',
      display_name: 'Cat'
    },
    {
      name: 'maylandia_zebra',
      assembly: 'M_zebra_UMD2a',
      display_name: 'Zebra mbuna'
    },
    {
      display_name: 'Dolphin',
      assembly: 'turTru1',
      name: 'tursiops_truncatus'
    },
    {
      display_name: 'Mouse WSB/EiJ',
      name: 'mus_musculus_wsbeij',
      assembly: 'WSB_EiJ_v1'
    },
    {
      display_name: 'Mouse DBA/2J',
      name: 'mus_musculus_dba2j',
      assembly: 'DBA_2J_v1'
    },
    {
      assembly: 'notPer1',
      display_name: 'Chilean tinamou'
    },
    {
      display_name: 'Mouse',
      name: 'mus_musculus_fvbnj',
      assembly: 'FVB_NJ_v1'
    },
    {
      assembly: 'HetGla_1.0',
      name: 'heterocephalus_glaber_male',
      display_name: 'Rat'
    },
    {
      assembly: 'EquCab3.0',
      name: 'equus_caballus',
      display_name: 'Horse'
    }
  ]
};
