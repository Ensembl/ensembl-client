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
import {
  ZmenuContentFeature,
  Markup,
  ZmenuFeatureType
} from 'ensembl-genome-browser';

import {
  getChrLocationStr,
  RegionValidationMessages
} from 'src/content/app/genome-browser/helpers/browserHelper';
import {
  createGenomeCategories,
  createGenomeKaryotype
} from 'tests/fixtures/genomes';
import { createTrackStates } from 'tests/fixtures/track-panel';

import { ChrLocation } from 'src/content/app/genome-browser/state/browser-location/browserLocationSlice';
import { CogList } from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';
import { RegionValidationResponse } from 'src/content/app/genome-browser/helpers/browserHelper';
import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { Strand } from 'src/shared/types/thoas/strand';
import { LoadingState } from 'src/shared/types/loading-state';
import { BreakpointWidth } from 'src/global/globalConfig';

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

export const createZmenuContent = (): ZmenuContentFeature[] => [
  {
    data: [
      [
        {
          items: [
            { markup: [Markup.LIGHT], text: 'Transcript' },
            { markup: [], text: ' ' },
            { markup: [], text: 'transcript_id' }
          ],
          type: 'block'
        },
        {
          items: [{ markup: [Markup.LIGHT, Markup.FOCUS], text: 'foo' }],
          type: 'block'
        }
      ]
    ],
    metadata: {
      transcript_id: 'transcript_id',
      designation: 'designation',
      strand: 'forward',
      transcript_biotype: 'protein_coding',
      track: 'track',
      type: ZmenuFeatureType.TRANSCRIPT
    }
  },

  {
    data: [
      [
        {
          items: [
            { markup: [Markup.LIGHT], text: 'Gene' },
            { markup: [], text: ' ' },
            { markup: [], text: 'gene_id' }
          ],
          type: 'block'
        }
      ]
    ],
    metadata: {
      id: 'gene_id',
      symbol: 'symbol',
      track: 'track_id',
      type: ZmenuFeatureType.GENE
    }
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
      browserEntity: {
        activeGenomeId: 'fake_genome_id_1',
        activeEnsObjectIds: {
          fake_genome_id_1: 'fake_genome_id_1:gene:fake_gene_stable_id_1'
        },
        trackStates: createTrackStates()
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
          move_up: false,
          move_right: false,
          move_down: true,
          move_left: true,
          zoom_out: false,
          zoom_in: false
        }
      },
      trackConfig: {
        applyToAllConfig: {
          isSelected: false,
          allTrackNamesOn: false,
          allTrackLabelsOn: false
        },
        browserCogList: 0,
        browserCogTrackList: createCogTrackList(),
        selectedCog: 'track:gc',
        trackConfigLabel: createTrackConfigLabel(),
        trackConfigNames: createTrackConfigNames()
      },
      trackPanel: {
        fake_genome_id_1: {
          isTrackPanelModalOpened: false,
          bookmarks: [],
          previouslyViewedObjects: [
            {
              genome_id: 'fake_genome_id_1',
              object_id: 'fake_genome_id_1:gene:fake_gene_stable_id_2',
              type: 'gene',
              label: 'Fake Gene Stable ID 2'
            }
          ],
          selectedTrackPanelTab: TrackSet.GENOMIC,
          trackPanelModalView: 'search',
          highlightedTrackId: '',
          isTrackPanelOpened: true,
          collapsedTrackIds: []
        }
      },
      drawer: {
        isDrawerOpened: {
          fake_genome_id_1: false
        },
        drawerView: {},
        activeDrawerTrackIds: {}
      }
    },
    global: {
      breakpointWidth: BreakpointWidth.DESKTOP,
      scrollPosition: {}
    },
    ensObjects: {
      'fake_genome_id_1:gene:fake_gene_stable_id_1': {
        data: {
          type: 'gene',
          object_id: 'fake_genome_id_1:gene:fake_gene_stable_id_1',
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
          strand: Strand.FORWARD
        },
        loadingStatus: LoadingState.SUCCESS
      }
    },
    genome: {
      genomeKaryotype: {
        genomeKaryotypeData: {
          fake_genome_id_1: createGenomeKaryotype()
        }
      },
      genomeTrackCategories: {
        genomeTrackCategoriesData: {
          fake_genome_id_1: createGenomeCategories()
        }
      }
    }
  };
};
