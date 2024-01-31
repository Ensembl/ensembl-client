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

import type { VariantStudyPopulation } from 'src/shared/types/variation-api/variantStudyPopulation';

export const populations = [
  {
    name: '1000GENOMES:phase_3:ALL',
    description: 'All phase 3 individuals',
    type: 'regional',
    is_global: true,
    super_population: null,
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:AFR'
      },
      {
        name: '1000GENOMES:phase_3:AMR'
      },
      {
        name: '1000GENOMES:phase_3:EAS'
      },
      {
        name: '1000GENOMES:phase_3:EUR'
      },
      {
        name: '1000GENOMES:phase_3:SAS'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:AFR',
    description: 'African',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:ALL'
    },
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:ACB'
      },
      {
        name: '1000GENOMES:phase_3:ASW'
      },
      {
        name: '1000GENOMES:phase_3:ESN'
      },
      {
        name: '1000GENOMES:phase_3:GWD'
      },
      {
        name: '1000GENOMES:phase_3:LWK'
      },
      {
        name: '1000GENOMES:phase_3:MSL'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:AMR',
    description: 'American',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:ALL'
    },
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:CLM'
      },
      {
        name: '1000GENOMES:phase_3:MXL'
      },
      {
        name: '1000GENOMES:phase_3:PEL'
      },
      {
        name: '1000GENOMES:phase_3:PUR'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:EAS',
    description: 'East Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:ALL'
    },
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:CDX'
      },
      {
        name: '1000GENOMES:phase_3:CHB'
      },
      {
        name: '1000GENOMES:phase_3:CHS'
      },
      {
        name: '1000GENOMES:phase_3:JPT'
      },
      {
        name: '1000GENOMES:phase_3:KHV'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:EUR',
    description: 'European',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:ALL'
    },
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:CEU'
      },
      {
        name: '1000GENOMES:phase_3:FIN'
      },
      {
        name: '1000GENOMES:phase_3:GBR'
      },
      {
        name: '1000GENOMES:phase_3:IBS'
      },
      {
        name: '1000GENOMES:phase_3:TSI'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:SAS',
    description: 'South Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:ALL'
    },
    sub_populations: [
      {
        name: '1000GENOMES:phase_3:BEB'
      },
      {
        name: '1000GENOMES:phase_3:GIH'
      },
      {
        name: '1000GENOMES:phase_3:ITU'
      },
      {
        name: '1000GENOMES:phase_3:PJL'
      },
      {
        name: '1000GENOMES:phase_3:STU'
      }
    ]
  },
  {
    name: '1000GENOMES:phase_3:ACB',
    description: 'African Caribbean in Barbados',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:ASW',
    description: 'African Ancestry in Southwest US',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:ESN',
    description: 'Esan in Nigeria',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:GWD',
    description: 'Gambian in Western Division, The Gambia',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:LWK',
    description: 'Luhya in Webuye, Kenya',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:MSL',
    description: 'Mende in Sierra Leone',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AFR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:CLM',
    description: 'Colombian in Medellin, Colombia',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AMR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:MXL',
    description: 'Colombian in Medellin, Colombia',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AMR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:PEL',
    description: 'Peruvian in Lima, Peru',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AMR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:PUR',
    description: 'Puerto Rican in Puerto Rico',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:AMR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:CDX',
    description: 'Chinese Dai in Xishuangbanna, China',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:CHB',
    description: 'Han Chinese in Bejing, China',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:CHS',
    description: 'Southern Han Chinese, China',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:JPT',
    description: 'Japanese in Tokyo, Japan',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:KHV',
    description: 'Kinh in Ho Chi Minh City, Vietnam',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:CEU',
    description: ' Utah residents with Northern and Western European ancestry',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EUR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:FIN',
    description: 'Finnish in Finland',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EUR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:GBR',
    description: 'British in England and Scotland',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EUR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:IBS',
    description: 'Iberian populations in Spain',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EUR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:TSI',
    description: 'Toscani in Italy',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:EUR'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:BEB',
    description: 'Bengali in Bangladesh',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:SAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:GIH',
    description: 'Gujarati Indian in Houston, TX',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:SAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:ITU',
    description: 'Indian Telugu in the UK',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:SAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:PJL',
    description: 'Punjabi in Lahore, Pakistan',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:SAS'
    },
    sub_populations: []
  },
  {
    name: '1000GENOMES:phase_3:STU',
    description: 'Sri Lankan Tamil in the UK',
    type: 'regional',
    is_global: false,
    super_population: {
      name: '1000GENOMES:phase_3:SAS'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:ALL',
    description: 'All gnomAD genomes individuals v3.1.2',
    type: 'regional',
    is_global: true,
    super_population: {
      name: null
    },
    sub_populations: [
      {
        name: 'gnomADg:afr'
      },
      {
        name: 'gnomADg:ami'
      },
      {
        name: 'gnomADg:amr'
      },
      {
        name: 'gnomADg:asj'
      },
      {
        name: 'gnomADg:eas'
      },
      {
        name: 'gnomADg:fin'
      },
      {
        name: 'gnomADg:mid'
      },
      {
        name: 'gnomADg:nfe'
      },
      {
        name: 'gnomADg:oth'
      },
      {
        name: 'gnomADg:sas'
      }
    ]
  },
  {
    name: 'gnomADg:afr',
    description: 'African/African American',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:ami',
    description: 'Amish',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:amr',
    description: 'Latino',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:asj',
    description: 'Ashkenazi Jewish',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:eas',
    description: 'East Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:fin',
    description: 'Finnish',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:mid',
    description: 'Middle Eastern',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:nfe',
    description: 'Non-Finnish European',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:oth',
    description: 'Other',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADg:sas',
    description: 'South Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADg:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:ALL',
    description: 'All gnomAD exomes individuals r2.1.1',
    type: 'regional',
    is_global: true,
    super_population: {
      name: null
    },
    sub_populations: [
      {
        name: 'gnomADe:afr'
      },
      {
        name: 'gnomADe:amr'
      },
      {
        name: 'gnomADe:asj'
      },
      {
        name: 'gnomADe:eas'
      },
      {
        name: 'gnomADg:fin'
      },
      {
        name: 'gnomADe:nfe'
      },
      {
        name: 'gnomADe:oth'
      },
      {
        name: 'gnomADe:sas'
      }
    ]
  },
  {
    name: 'gnomADe:afr',
    description: 'African/African American',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:amr',
    description: 'Latino',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:asj',
    description: 'Ashkenazi Jewish',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:eas',
    description: 'East Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:fin',
    description: 'Finnish',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:nfe',
    description: 'Non-Finnish European',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:oth',
    description: 'Other',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  },
  {
    name: 'gnomADe:sas',
    description: 'South Asian',
    type: 'regional',
    is_global: false,
    super_population: {
      name: 'gnomADe:ALL'
    },
    sub_populations: []
  }
] as unknown as VariantStudyPopulation[];
