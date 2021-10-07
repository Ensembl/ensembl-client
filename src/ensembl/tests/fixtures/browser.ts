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

import faker from 'faker';

import { CogList, ChrLocation } from 'src/content/app/browser/browserState';
import { Markup } from 'src/content/app/browser/zmenu/zmenu-types';
import { RegionValidationResponse } from 'src/content/app/browser/browserHelper';
import {
  getChrLocationStr,
  RegionValidationMessages
} from 'src/content/app/browser/browserHelper';

export const createCogTrackList = (): CogList => ({
  'track:contig': faker.datatype.number(),
  'track:gc': faker.datatype.number(),
  'track:gene-feat': faker.datatype.number(),
  'track:gene-other-fwd': faker.datatype.number(),
  'track:gene-other-rev': faker.datatype.number(),
  'track:gene-pc-fwd': faker.datatype.number(),
  'track:gene-pc-rev': faker.datatype.number(),
  'track:variant': faker.datatype.number()
});

export const createTrackConfigLabel = () => ({
  'track:contig': true,
  'track:gc': true,
  'track:gene-feat': true,
  'track:gene-other-fwd': true,
  'track:gene-other-rev': true,
  'track:gene-pc-fwd': true,
  'track:gene-pc-rev': true,
  'track:variant': true
});

export const createTrackConfigNames = () => ({
  'track:contig': true,
  'track:gc': true,
  'track:gene-feat': true,
  'track:gene-other-fwd': true,
  'track:gene-other-rev': true,
  'track:gene-pc-fwd': true,
  'track:gene-pc-rev': true,
  'track:variant': true
});

export const createZmenuContent = () => [
  {
    id: faker.lorem.words(),
    lines: [
      [
        [
          { markup: [Markup.LIGHT], text: faker.lorem.words() },
          { markup: [], text: ' ' },
          { markup: [], text: faker.lorem.words() }
        ],
        [{ markup: [Markup.LIGHT, Markup.FOCUS], text: faker.lorem.words() }]
      ]
    ],
    track_id: faker.lorem.words()
  }
];

export const createRegionValidationInfo = (): RegionValidationResponse => {
  const randomValue = faker.datatype.number();

  return {
    end: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: randomValue
    },
    genome_id: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: faker.lorem.words()
    },
    region: {
      error_code: null,
      error_message: null,
      is_valid: true,
      region_code: faker.lorem.words(),
      region_name: faker.lorem.words()
    },
    region_id: faker.lorem.words(),
    start: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: randomValue + faker.datatype.number()
    }
  };
};

export const createRegionValidationMessages = (): RegionValidationMessages => ({
  errorMessages: {
    genomeIdError: null,
    regionParamError: null,
    parseError: null,
    regionError: null,
    startError: null,
    endError: null
  },
  successMessages: {
    regionId: null
  }
});

export const createChrLocationValues = () => {
  const tupleValue: ChrLocation = [
    faker.lorem.words(),
    faker.datatype.number(),
    faker.datatype.number()
  ];
  const stringValue = getChrLocationStr(tupleValue);

  return { stringValue, tupleValue };
};

export const createMockBrowserState = () => {
  return {
    browser: {
      browserInfo: {
        browserActivated: false
      },
      browserEntity: {
        activeGenomeId: 'fake_genome_id_1',
        activeEnsObjectIds: {
          fake_genome_id_1: 'fake_genome_id_1:gene:fake_gene_stable_id'
        },
        trackStates: {}
      },
      browserLocation: {
        chrLocations: {
          fake_genome_id_1: ['13', 32304804, 32384454]
        },
        actualChrLocations: {},
        regionEditorActive: false,
        regionFieldActive: false,
        isObjectInDefaultPosition: false
      },
      browserNav: {
        browserNavOpenState: {},
        browserNavIconStates: {
          'navigate-up': false,
          'navigate-right': false,
          'navigate-down': false,
          'navigate-left': false,
          'zoom-out': false,
          'zoom-in': false
        }
      },
      trackConfig: {
        applyToAll: false,
        browserCogList: 0,
        browserCogTrackList: { 'track:gc': faker.datatype.number() },
        selectedCog: null,
        trackConfigLabel: {},
        trackConfigNames: {}
      },
      trackPanel: {
        fake_genome_id_2: {
          isTrackPanelModalOpened: false,
          bookmarks: [],
          previouslyViewedObjects: [
            {
              genome_id: 'fake_genome_id_2',
              object_id: 'fake_genome_id_2:gene:TraesCS3D02G273600',
              type: 'gene',
              label: 'TraesCS3D02G273600'
            }
          ],
          selectedTrackPanelTab: 'Genomic',
          trackPanelModalView: '',
          highlightedTrackId: '',
          isTrackPanelOpened: true,
          collapsedTrackIds: []
        }
      }
    },
    drawer: {
      isDrawerOpened: {},
      drawerView: {},
      activeDrawerTrackIds: {}
    },
    router: {
      location: {
        pathname: '/species/fake_genome_id_1',
        search: '',
        hash: '',
        key: '9vnz4q',
        query: {}
      },
      action: 'PUSH'
    },
    global: {
      breakpointWidth: 1200
    },
    ensObjects: {
      'fake_genome_id_1:gene:fake_gene_stable_id': {
        data: {
          type: 'gene',
          object_id: 'fake_genome_id_1:gene:fake_gene_stable_id',
          genome_id: 'fake_genome_id_1',
          label: 'BRCA2',
          location: {
            chromosome: '13',
            start: 32315086,
            end: 32400268
          },
          stable_id: 'fake_gene_stable_id',
          versioned_stable_id: 'fake_gene_stable_id.17',
          bio_type: 'Protein coding',
          strand: 'forward'
        },
        loadingStatus: 'success'
      }
    }
  };
};
