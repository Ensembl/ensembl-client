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

import type {
  FocusGene,
  FocusObjectIdConstituents,
  UrlFocusIdConstituents
} from 'src/shared/types/focus-object/focusObjectTypes';

// NOTE: it's possible that we will prefer to omit type from the id
// if focus objects of different type are saved into different slots in the state
export const buildFocusObjectId = (params: FocusObjectIdConstituents) => {
  const { genomeId, type, objectId } = params;
  return `${genomeId}:${type}:${objectId}`;
};

export const parseFocusObjectId = (id: string): FocusObjectIdConstituents => {
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
    payload = parseFocusObjectId(payload);
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
    throw new Error(`Malformed focus id "${id}" in url`);
  }
};

// focus object id in the url on the Genome Browser page has a format of <type>:<id>
export const parseFocusObjectIdFromUrl = (
  id: string
): UrlFocusIdConstituents => {
  const [type, objectId] = id.split(':');
  return {
    type,
    objectId
  };
};

export const getDisplayStableId = (focusObject: Partial<FocusGene>) =>
  focusObject.versioned_stable_id || focusObject.stable_id || '';

export const buildFocusVariantId = (params: {
  regionName: string;
  start: number;
  variantName: string;
}) => {
  const { regionName, start, variantName } = params;
  return `variant:${regionName}:${start}:${variantName}`;
};
