import faker from 'faker';

import { CogList, ChrLocation } from 'src/content/app/browser/browserState';
import { Markup } from 'src/content/app/browser/zmenu/zmenu-types';
import { RegionValidationResponse } from 'src/content/app/browser/browserState';
import {
  getChrLocationStr,
  ValidationResult
} from 'src/content/app/browser/browserHelper';

export const createCogTrackList = (): CogList => ({
  'track:contig': faker.random.number(),
  'track:gc': faker.random.number(),
  'track:gene-feat': faker.random.number(),
  'track:gene-other-fwd': faker.random.number(),
  'track:gene-other-rev': faker.random.number(),
  'track:gene-pc-fwd': faker.random.number(),
  'track:gene-pc-rev': faker.random.number(),
  'track:variant': faker.random.number()
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
  const randomValue = faker.random.number();

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
    is_parseable: true,
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
      value: randomValue + faker.random.number()
    }
  };
};

export const createRegionValidationResult = (): ValidationResult => ({
  errorMessages: {
    genomeIdError: undefined,
    regionParamError: undefined,
    regionError: undefined,
    startError: undefined,
    endError: undefined
  },
  regionId: undefined
});

export const createChrLocationValues = () => {
  const tupleValue: ChrLocation = [
    faker.lorem.words(),
    faker.random.number(),
    faker.random.number()
  ];
  const stringValue = getChrLocationStr(tupleValue);

  return { stringValue, tupleValue };
};
