/*

Shape of a popular species data object

{
  "genome_id": string, // a unique identifier
  "reference_genome_id": string | null, // a unique identifier of reference genome; present if this is a strain
  "common_name": string | null, // common name (if present)
  "scientific_name": string, // should always be present
  "assembly_name": string, // notice on mockups that every popular species has an assembly
  image: string, // link to the svg or base64-encoded svg
  division_ids: str[] // ['model_organism', 'ensembl_plants',...]; a popular species can belong to several divisions
}

*/

// QUESTION: should filtering of popular species (by divisions) happen on the client side or on the server side?
// If on the client side, then there should also be something like a 'divisions' field

export default [
  {
    genome_id: 'homo_sapiens38',
    reference_genome_id: null,
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'GRCh38',
    image: require('./popular-species/human38_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'homo_sapiens37',
    reference_genome_id: null,
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'GRCh37',
    image: require('./popular-species/human37_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'homo_sapiens38',
    reference_genome_id: null,
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'GRCh38',
    image: require('./popular-species/human38_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'arabidopsis_thaliana',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Arabidopsis thaliana',
    assembly_name: 'TAIR10',
    image: require('./popular-species/arabidopsis_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'aspergillus_nidulans',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Aspergillus nidulans',
    assembly_name: 'ASM1142v1',
    image: require('./popular-species/aspergillus_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'hordeum_vulgare',
    reference_genome_id: null,
    common_name: 'Barley',
    scientific_name: 'Hordeum vulgare',
    assembly_name: 'IBSC_v2',
    image: require('./popular-species/barley_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'apis_mellifera',
    reference_genome_id: null,
    common_name: 'Honey bee',
    scientific_name: 'Apis mellifera',
    assembly_name: 'Amel_4.5',
    image: require('./popular-species/bee_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'botrytis_cinerea',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Botrytis cinerea',
    assembly_name: 'ASM83294v1',
    image: require('./popular-species/botrytis_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'saccharomyces_cerevisiae',
    reference_genome_id: null,
    common_name: 'Brewers’ yeast',
    scientific_name: 'Saccharomyces cerevisiae',
    assembly_name: 'R64-1-1',
    image: require('./popular-species/brewers_yeast_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'caenorhabditis_elegans',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Caenorhabditis elegans',
    assembly_name: 'WBcel235',
    image: require('./popular-species/c_elegans_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'gallus_gallus',
    reference_genome_id: null,
    common_name: 'Chicken',
    scientific_name: 'Gallus gallus',
    assembly_name: 'GRCg6a',
    image: require('./popular-species/chicken_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'bos_taurus',
    reference_genome_id: null,
    common_name: 'Cow',
    scientific_name: 'Bos taurus',
    assembly_name: 'ARS-UCD1.2',
    image: require('./popular-species/c_elegans_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'canis_lupus_familiaris',
    reference_genome_id: null,
    common_name: 'Dog',
    scientific_name: 'Canis lupus familiaris',
    assembly_name: 'CanFam3.1',
    image: require('./popular-species/dog_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'drosophila_melanogaster',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Drosophila melanogaster',
    assembly_name: 'BDGP6.22',
    image: require('./popular-species/fruitfly_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'fusarium_graminearum',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Fusarium graminearum str. PH-1',
    assembly_name: 'RR1',
    image: require('./popular-species/fusarium_graminearum_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'fusarium_oxysporum',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Fusarium oxysporum f.sp. lycopersici',
    assembly_name: 'FO2',
    image: require('./popular-species/fusarium_oxysporum_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'equus_caballus',
    reference_genome_id: null,
    common_name: 'Horse',
    scientific_name: 'Equus caballus',
    assembly_name: 'EquCab3.0',
    image: require('./popular-species/horse_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'macaca_mulatta',
    reference_genome_id: null,
    common_name: 'Macaque',
    scientific_name: 'Macaca mulatta',
    assembly_name: 'Mmul_8.0.1',
    image: require('./popular-species/macaque_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'magnaporthe_oryzae',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Magnaporthe oryzae',
    assembly_name: 'MG8',
    image: require('./popular-species/magnaporthe_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'zea_mays',
    reference_genome_id: null,
    common_name: 'Maize',
    scientific_name: 'Zea mays',
    assembly_name: 'B73_RefGen_v4',
    image: require('./popular-species/maize_k.svg'),
    division_ids: []
  },
  {
    genome_id: 'anopheles_gambiae',
    reference_genome_id: null,
    common_name: null,
    scientific_name: 'Anopheles gambiae',
    assembly_name: 'AgamP4',
    image: require('./popular-species/mosquito_k.svg'),
    division_ids: []
  }
];
