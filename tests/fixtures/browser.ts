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

import { faker } from '@faker-js/faker';
import {
  Markup,
  ZmenuFeatureType,
  ZmenuPayloadVarietyType,
  type ZmenuContentTranscript,
  type ZmenuContentGene,
  type ZmenuCreatePayload
} from '@ensembl/ensembl-genome-browser';

import {
  getChrLocationStr,
  type RegionValidationMessages
} from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  getDefaultGeneTrackSettings,
  getDefaultRegularTrackSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import { initialState as initialBrowserUrlValidationState } from 'src/content/app/genome-browser/state/browser-url-validation/browserUrlValidationSlice';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type { RegionValidationResponse } from 'src/content/app/genome-browser/helpers/browserHelper';
import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { Strand } from 'src/shared/types/thoas/strand';
import { LoadingState } from 'src/shared/types/loading-state';
import { BreakpointWidth } from 'src/global/globalConfig';

export const createTrackSettings = () => ({
  'gene-focus': getDefaultGeneTrackSettings(),
  contig: getDefaultRegularTrackSettings(),
  gc: getDefaultRegularTrackSettings()
});

export const createZmenuContentPayload = (): {
  features: (ZmenuContentTranscript | ZmenuContentGene)[];
  featureId: string;
} => {
  return {
    features: [
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
          versioned_id: 'transcript_id.1',
          unversioned_id: 'transcript_id',
          designation: 'designation',
          strand: 'forward',
          transcript_biotype: 'protein_coding',
          track: 'track',
          type: ZmenuFeatureType.TRANSCRIPT,
          gene_id: 'gene_id.1'
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
          versioned_id: 'gene_id.1',
          unversioned_id: 'gene_id',
          symbol: 'symbol',
          name: 'gene name',
          track: 'track_id',
          type: ZmenuFeatureType.GENE
        }
      }
    ],
    featureId: 'transcript_id'
  };
};

export const createZmenuPayload = (): ZmenuCreatePayload => {
  return {
    x: 100,
    y: 100,
    content: [...createZmenuContentPayload().features],
    variety: [
      {
        type: ZmenuPayloadVarietyType.GENE_AND_ONE_TRANSCRIPT
      }
    ]
  };
};

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
  const fakeGenomeId = 'fake_genome_id_1';

  return {
    browser: {
      browserGeneral: {
        activeGenomeId: fakeGenomeId,
        activeFocusObjectIds: {
          [fakeGenomeId]: `${fakeGenomeId}:gene:fake_gene_stable_id_1`
        },
        chrLocations: {
          [fakeGenomeId]: ['13', 32304804, 32384454] as [string, number, number]
        },
        actualChrLocations: {},
        regionEditorActive: false,
        regionFieldActive: false
      },
      browserUrlValidation: initialBrowserUrlValidationState,
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
      trackPanel: {
        [fakeGenomeId]: {
          selectedTrackPanelTab: TrackSet.GENOMIC,
          isTrackPanelOpened: true,
          highlightedTrackId: '',
          collapsedTrackIds: []
        }
      },
      browserSidebarModal: {
        [fakeGenomeId]: {
          browserSidebarModalView: null
        }
      },
      browserBookmarks: {
        fake_genome_id_1: {
          bookmarks: [],
          previouslyViewedObjects: [
            {
              genome_id: fakeGenomeId,
              object_id: `${fakeGenomeId}:gene:fake_gene_stable_id_2`,
              type: 'gene',
              label: 'Fake Gene Stable ID 2'
            }
          ]
        }
      },
      drawer: {
        general: {
          drawerView: {}
        }
      },
      focusObjects: {
        [`${fakeGenomeId}:gene:fake_gene_stable_id_1`]: {
          data: {
            type: 'gene' as const,
            object_id: `${fakeGenomeId}:gene:fake_gene_stable_id_1`,
            genome_id: fakeGenomeId,
            label: 'BRCA2',
            location: {
              chromosome: '13',
              start: 32315086,
              end: 32400268
            },
            stable_id: 'fake_gene_stable_id_1',
            versioned_stable_id: 'fake_gene_stable_id.17',
            bio_type: 'Protein coding',
            strand: Strand.FORWARD
          },
          loadingStatus: LoadingState.SUCCESS
        }
      }
    },
    genome: {
      genomes: {}
    },
    global: {
      breakpointWidth: BreakpointWidth.DESKTOP,
      scrollPosition: {}
    },
    speciesSelector: {
      committedItems: [
        {
          genome_id: 'human',
          common_name: 'human',
          assembly_name: 'grch38'
        }
      ]
    }
  };
};
