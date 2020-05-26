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

import { getChrLocationFromStr } from 'src/content/app/browser/browserHelper';
import {
  EnsObjectRegion,
  EnsObjectGene
} from 'src/shared/state/ens-object/ensObjectTypes';

export type EnsObjectIdConstituents = {
  genomeId: string;
  type: string;
  objectId: string;
};

export type UrlFocusIdConstituents = {
  type: string;
  objectId: string;
};

// NOTE: it's possible that we will prefer to omit type from the id
// if focus objects of different type are saved into different slots in the state
export const buildEnsObjectId = (params: EnsObjectIdConstituents) => {
  const { genomeId, type, objectId } = params;
  return `${genomeId}:${type}:${objectId}`;
};

export const parseEnsObjectId = (id: string): EnsObjectIdConstituents => {
  const regex = /(.+?):(.+?):(.+)/;
  const match = id.match(regex);

  if (match?.length === 4) {
    // whole id plus its three constituent parts
    const [, genomeId, type, objectId] = match;
    return {
      genomeId,
      type,
      objectId
    };
  } else {
    throw new Error('Malformed Ensembl object id');
  }
};

export const buildFocusIdForUrl = (
  payload: string | UrlFocusIdConstituents
) => {
  if (typeof payload === 'string') {
    payload = parseEnsObjectId(payload);
  }
  const { type, objectId } = payload;
  return `${type}:${objectId}`;
};

export const parseFocusIdFromUrl = (id: string) => {
  const regex = /(.+?):(.+)/;
  const match = id.match(regex);

  if (match?.length === 3) {
    // whole id plus its two constituent parts
    const [, type, objectId] = match;
    return {
      type,
      objectId
    };
  } else {
    throw new Error('Malformed focus id in url');
  }
};

// focus object id in the url on the Genome Browser page has a format of <type>:<id>
export const parseEnsObjectIdFromUrl = (id: string): UrlFocusIdConstituents => {
  const [type, objectId] = id.split(':');
  return {
    type,
    objectId
  };
};

export const buildRegionObject = (
  payload: EnsObjectIdConstituents
): EnsObjectRegion => {
  const { genomeId, objectId: regionId } = payload;
  const [chromosomeName, start, end] = getChrLocationFromStr(regionId);

  return {
    type: 'region',
    genome_id: genomeId,
    object_id: buildEnsObjectId(payload),
    label: regionId,
    location: {
      chromosome: chromosomeName,
      start,
      end
    }
  };
};

export const getDisplayStableId = (ensObject: EnsObjectGene) =>
  ensObject.versioned_stable_id || ensObject.stable_id || '';
