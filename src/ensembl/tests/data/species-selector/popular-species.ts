/*

Shape of a popular species data object

{
  "genome_id": string, // a unique identifier
  "reference_genome_id": string | null, // a unique identifier of reference genome; present if this is a strain
  "common_name": string | null, // common name (if present)
  "scientific_name": string, // should always be present
  "assembly_name": string, // notice on mockups that every popular species has an assembly
  image: string, // link to the svg or base64-encoded svg
  division_ids: str[], // ['model_organism', 'ensembl_plants',...]; a popular species can belong to several divisions
  isAvailable: boolean // indicates whether we have data for this species and, therefore, whether it can be selected
}

*/

export default [
  {
    genome_id: 'homo_sapiens38',
    reference_genome_id: null,
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'GRCh38',
    image: require('./popular-species/human38_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'mus_musculus',
    reference_genome_id: null,
    common_name: 'Mouse',
    scientific_name: 'Mus musculus',
    assembly_name: 'GRCm38.p6',
    image: require('./popular-species/mouse_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'triticum_aestivum',
    reference_genome_id: null,
    common_name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    assembly_name: 'IWGSC',
    image: require('./popular-species/wheat_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'homo_sapiens37',
    reference_genome_id: null,
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'GRCh37',
    image: require('./popular-species/human37_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'danio_rerio',
    reference_genome_id: null,
    common_name: 'Zebrafish',
    scientific_name: 'Danio rerio',
    assembly_name: 'GRCz11',
    image: require('./popular-species/fish_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'hordeum_vulgare',
    reference_genome_id: null,
    common_name: 'Barley',
    scientific_name: 'Hordeum vulgare',
    assembly_name: 'IBSC_v2',
    image: require('./popular-species/barley_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'arabidopsis_thaliana',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Arabidopsis thaliana',
    assembly_name: 'TAIR10',
    image: require('./popular-species/arabidopsis_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'zea_mays',
    reference_genome_id: null,
    common_name: 'Maize',
    scientific_name: 'Zea mays',
    assembly_name: 'B73_RefGen_v4',
    image: require('./popular-species/maize_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'oryza_sativa',
    reference_genome_id: null,
    common_name: 'Rice',
    scientific_name: 'Oryza sativa Japonica Group',
    assembly_name: 'IRGSP-1.0',
    image: require('./popular-species/rice_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'gallus_gallus',
    reference_genome_id: null,
    common_name: 'Chicken',
    scientific_name: 'Gallus gallus',
    assembly_name: 'GRCg6a',
    image: require('./popular-species/chicken_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'rattus_norvegicus',
    reference_genome_id: null,
    common_name: 'Rat',
    scientific_name: 'Rattus norvegicus',
    assembly_name: 'Rnor_6.0',
    image: require('./popular-species/rat_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'sus_scrofa',
    reference_genome_id: null,
    common_name: 'Pig',
    scientific_name: 'Sus scrofa',
    assembly_name: 'Sscrofa11.1',
    image: require('./popular-species/pig_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'bos_taurus',
    reference_genome_id: null,
    common_name: 'Cow',
    scientific_name: 'Bos taurus',
    assembly_name: 'ARS-UCD1.2',
    image: require('./popular-species/cow_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'magnaporthe_oryzae',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Magnaporthe oryzae',
    assembly_name: 'MG8',
    image: require('./popular-species/magnaporthe_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'botrytis_cinerea',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Botrytis cinerea',
    assembly_name: 'ASM83294v1',
    image: require('./popular-species/botrytis_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'canis_lupus_familiaris',
    reference_genome_id: null,
    common_name: 'Dog',
    scientific_name: 'Canis lupus familiaris',
    assembly_name: 'CanFam3.1',
    image: require('./popular-species/dog_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'schizosaccharomyces_pombe',
    reference_genome_id: null,
    common_name: 'Fission yeast',
    scientific_name: 'Schizosaccharomyces pombe',
    assembly_name: 'ASM294v2',
    image: require('./popular-species/fission_yeast_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'phaeodactylum_tricornutum ',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Phaeodactylum tricornutum',
    assembly_name: 'ASM15095v2',
    image: require('./popular-species/phaeodactylum_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'drosophila_melanogaster',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Drosophila melanogaster',
    assembly_name: 'BDGP6.22',
    image: require('./popular-species/fruitfly_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'escherichia_coli',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Escherichia coli str. K-12 substr. MG1655',
    assembly_name: 'ASM584v2',
    image: require('./popular-species/bacteria_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'fusarium_graminearum',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Fusarium graminearum str. PH-1',
    assembly_name: 'RR1',
    image: require('./popular-species/fusarium_graminearum_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'ovis_aries',
    reference_genome_id: null,
    common_name: 'Sheep',
    scientific_name: 'Ovis aries',
    assembly_name: 'Oar_v3.1',
    image: require('./popular-species/sheep_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'oryzias_latipes',
    reference_genome_id: null,
    common_name: 'Japanese medaka',
    scientific_name: 'Oryzias latipes',
    assembly_name: 'ASM223467v1',
    image: require('./popular-species/fish_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'lactobacillus_delbrueckii',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Lactobacillus delbrueckii subsp. bulgaricus 2038',
    assembly_name: 'ASM19116v1',
    image: require('./popular-species/bacteria_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'saccharomyces_cerevisiae',
    reference_genome_id: null,
    common_name: 'Brewers’ yeast',
    scientific_name: 'Saccharomyces cerevisiae',
    assembly_name: 'R64-1-1',
    image: require('./popular-species/brewers_yeast_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'caenorhabditis_elegans',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Caenorhabditis elegans',
    assembly_name: 'WBcel235',
    image: require('./popular-species/c_elegans_k.svg').default,
    division_ids: [],
    isAvailable: true
  },
  {
    genome_id: 'zymoseptoria_tritici',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Zymoseptoria tritici',
    assembly_name: 'IWGSC',
    image: require('./popular-species/zymoseptoria_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'equus_caballus',
    reference_genome_id: null,
    common_name: 'Horse',
    scientific_name: 'Equus caballus',
    assembly_name: 'EquCab3.0',
    image: require('./popular-species/horse_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'tribolium_castaneum',
    reference_genome_id: null,
    common_name: 'Red flour beetle',
    scientific_name: 'Tribolium castaneum',
    assembly_name: 'Tcas5.2',
    image: require('./popular-species/red_flour_beetle_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'bombyx_mori',
    reference_genome_id: null,
    common_name: 'Silkworm',
    scientific_name: 'Bombyx mori',
    assembly_name: 'ASM15162v1',
    image: require('./popular-species/silkworm_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'aspergillus_fumigatus',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Aspergillus fumigatus A1163',
    assembly_name: 'ASM15014v1',
    image: require('./popular-species/aspergillus_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'neurospora_crassa',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Neurospora crassa',
    assembly_name: 'NC12',
    image: require('./popular-species/neurospora_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'zootermopsis_nevadensis',
    reference_genome_id: null,
    common_name: 'Dampwood termite',
    scientific_name: 'Zootermopsis nevadensis',
    assembly_name: 'ZooNev1.0',
    image: require('./popular-species/termite_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'anopheles_gambiae',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Anopheles gambiae',
    assembly_name: 'AgamP4',
    image: require('./popular-species/mosquito_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'apis_mellifera',
    reference_genome_id: null,
    common_name: 'Honey bee',
    scientific_name: 'Apis mellifera',
    assembly_name: 'Amel_4.5',
    image: require('./popular-species/bee_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'schizosaccharomyces_japonicus',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Schizosaccharomyces japonicus',
    assembly_name: 'GCA_000149845.2',
    image: require('./popular-species/fission_yeast_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'macaca_mulatta',
    reference_genome_id: null,
    common_name: 'Macaque',
    scientific_name: 'Macaca mulatta',
    assembly_name: 'Mmul_8.0.1',
    image: require('./popular-species/macaque_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'phytophtora_infestans',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Phytophtora infestans',
    assembly_name: 'ASM14294v1',
    image: require('./popular-species/phytophthora_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'fusarium_oxysporum',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Fusarium oxysporum f.sp. lycopersici',
    assembly_name: 'FO2',
    image: require('./popular-species/fusarium_oxysporum_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'oreochromis_niloticus',
    reference_genome_id: null,
    common_name: 'Tilapia',
    scientific_name: 'Oreochromis niloticus',
    assembly_name: 'Orenil1.0',
    image: require('./popular-species/tilapia_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'salpingoeca_rosetta',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Salpingoeca rosetta',
    assembly_name: 'IRGSP-1.0',
    image: require('./popular-species/salpingoeca_k.svg').default,
    division_ids: [],
    isAvailable: false
  },
  {
    genome_id: 'plasmodium_falciparum',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Plasmodium falciparum 3D7',
    assembly_name: 'EPr1',
    image: require('./popular-species/plasmodium_k.svg').default,
    division_ids: [],
    isAvailable: false
  }
];
