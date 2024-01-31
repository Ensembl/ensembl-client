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

const altAllelePopulationFrequencies = [
  {
    population_name: '1000GENOMES:phase_3:ALL',
    allele_frequency: 0.0002,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: '1000GENOMES:phase_3:AFR',
    allele_frequency: 0,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: '1000GENOMES:phase_3:AMR',
    allele_frequency: 0,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: '1000GENOMES:phase_3:EAS',
    allele_frequency: 0.001,
    allele_number: null,
    allele_count: null,
    is_hpmaf: true,
    is_minor_allele: true
  },
  {
    population_name: '1000GENOMES:phase_3:EUR',
    allele_frequency: 0,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: '1000GENOMES:phase_3:SAS',
    allele_frequency: 0,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:ALL',
    allele_frequency: 0.0000401777,
    allele_number: 248894,
    allele_count: 10,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:afr',
    allele_frequency: 0,
    allele_number: 16104,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:amr',
    allele_frequency: 0,
    allele_number: 34402,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:asj',
    allele_frequency: 0,
    allele_number: 10010,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:eas',
    allele_frequency: 0.000549995,
    allele_number: 18182,
    allele_count: 10,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:fin',
    allele_frequency: 0,
    allele_number: 21578,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:nfe',
    allele_frequency: 0,
    allele_number: 112036,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:oth',
    allele_frequency: 0,
    allele_number: 6066,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADe:sas',
    allele_frequency: 0,
    allele_number: 30516,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:ALL',
    allele_frequency: 0.0000131387,
    allele_number: 152222,
    allele_count: 2,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:afr',
    allele_frequency: 0,
    allele_number: 41446,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:amr',
    allele_frequency: 0,
    allele_number: 15288,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:asj',
    allele_frequency: 0,
    allele_number: 3472,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:eas',
    allele_frequency: 0.00038432,
    allele_number: 5204,
    allele_count: 2,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:fin',
    allele_frequency: 0,
    allele_number: 10618,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:nfe',
    allele_frequency: 0,
    allele_number: 68038,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:oth',
    allele_frequency: 0,
    allele_number: 2092,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  },
  {
    population_name: 'gnomADg:sas',
    allele_frequency: 0,
    allele_number: 4836,
    allele_count: 0,
    is_hpmaf: false,
    is_minor_allele: true
  }
];

const referenceAllelePopulationFrequencies = [
  {
    population_name: '1000GENOMES:phase_3:ALL',
    allele_frequency: 0.9998,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: '1000GENOMES:phase_3:AFR',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: '1000GENOMES:phase_3:AMR',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: '1000GENOMES:phase_3:EAS',
    allele_frequency: 0.999,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: '1000GENOMES:phase_3:EUR',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: '1000GENOMES:phase_3:SAS',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:ALL',
    allele_frequency: 0.9999598223,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:afr',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:amr',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:asj',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:eas',
    allele_frequency: 0.999450005,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:fin',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:nfe',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:oth',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADe:sas',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:ALL',
    allele_frequency: 0.9999868613,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:afr',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:amr',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:asj',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:eas',
    allele_frequency: 0.99961568,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:fin',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:nfe',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:oth',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  },
  {
    population_name: 'gnomADg:sas',
    allele_frequency: 1,
    allele_number: null,
    allele_count: null,
    is_hpmaf: false,
    is_minor_allele: false
  }
];

// too lazy to declare types
export const injectMockAlleleFrequencyDataIntoVariant = (variant: any) => {
  let hasInjectedAltAlleleFreq = false;

  for (const allele of variant.alleles) {
    if (allele.allele_type.value === 'biological_region') {
      allele.population_frequencies = referenceAllelePopulationFrequencies;
    } else if (!hasInjectedAltAlleleFreq) {
      allele.population_frequencies = altAllelePopulationFrequencies;
      hasInjectedAltAlleleFreq = true;
    } else {
      allele.population_frequencies = [];
    }
  }
};
