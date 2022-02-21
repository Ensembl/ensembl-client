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

//TODO: hardcoding species list in this file, Once we get it from the API (when we implement search or add more species), this file can be deleted
// Check if we need the sorting and which field we need to submit a job
const SpeciesList = [
  {
    assembly_name: 'GRCh38.p13',
    common_name: 'Human',
    genome_id: 'homo_sapiens_GCA_000001405_28',
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'IWGSC',
    common_name: null,
    genome_id: 'triticum_aestivum_GCA_900519105_1',
    scientific_name: 'Triticum aestivum'
  },
  {
    assembly_name: 'GRCh37.p13',
    common_name: 'Human',
    genome_id: 'homo_sapiens_GCA_000001405_14',
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'WBcel235',
    common_name: null,
    genome_id: 'caenorhabditis_elegans_GCA_000002985_3',
    scientific_name: 'Caenorhabditis elegans'
  },
  {
    assembly_name: 'R64-1-1',
    common_name: null,
    genome_id: 'saccharomyces_cerevisiae_GCA_000146045_2',
    scientific_name: 'Saccharomyces cerevisiae'
  },
  {
    assembly_name: 'ASM584v2',
    common_name: null,
    genome_id:
      'escherichia_coli_str_k_12_substr_mg1655_gca_000005845_GCA_000005845_2',
    scientific_name: 'Escherichia coli str. K-12 substr. MG1655'
  },
  {
    assembly_name: 'ASM276v2',
    common_name: null,
    genome_id: 'plasmodium_falciparum_GCA_000002765_2',
    scientific_name: 'Plasmodium falciparum 3D7'
  }
];
// species with common name first and sort alphabetically by common name
// If no common name, then sort by scientific name alphabetically
SpeciesList.sort((a, b) => {
  if (a.common_name) {
    if (a.common_name && b.common_name) {
      return a.common_name > b.common_name ? 1 : -1;
    }
    return -1;
  } else {
    if (!a.common_name && !b.common_name) {
      return a.scientific_name > b.scientific_name ? 1 : -1;
    }
    return 1;
  }
});

export default SpeciesList;
