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
  EnsObjectGene,
  EnsObject
} from 'src/shared/state/ens-object/ensObjectTypes';
import { FullGene } from 'src/shared/types/thoas/gene';
import { Slice } from 'src/shared/types/thoas/slice';
import {
  TrackId,
  TrackItemColour
} from 'src/content/app/browser/track-panel/trackPanelConfig';

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
  const [chromosome, start, end] = getChrLocationFromStr(regionId);

  return {
    type: 'region',
    genome_id: genomeId,
    object_id: buildEnsObjectId(payload),
    label: regionId,
    location: {
      chromosome,
      start,
      end
    }
  };
};

export const buildEnsObject = (
  gene: Partial<FullGene>,
  genomeId: string
): EnsObject => {
  const slice = gene.slice as Slice;

  return {
    type: 'gene',
    genome_id: genomeId,
    object_id: gene.stable_id as string,
    stable_id: gene.unversioned_stable_id as string,
    versioned_stable_id: gene.stable_id as string,
    bio_type: gene.so_term as string,
    location: {
      chromosome: slice.region.name,
      start: slice.location.start,
      end: slice.location.end
    },
    strand: slice.strand.code,
    label: gene.symbol as string,
    description: gene.name || null,
    track: buildTrackList(gene)
  };
};

// FIXME: this is a temporary solution, until the backend
// fixes the api/object/track_list endpoint
const buildTrackList = (gene: Partial<FullGene>) => {
  const canonicalTranscript = gene.transcripts?.filter(
    (transcript) => !!transcript.metadata.canonical
  )[0];

  const childTracks = canonicalTranscript
    ? [
        {
          additional_info: (canonicalTranscript.so_term as string) || undefined,
          colour: TrackItemColour.BLUE,
          description: canonicalTranscript.name || null,
          label: canonicalTranscript.stable_id as string,
          support_level: canonicalTranscript.metadata.canonical?.label,
          track_id: TrackId.CANONICAL_TRANSCRIPT,
          stable_id: canonicalTranscript.stable_id as string
        }
      ]
    : [];

  return {
    additional_info: gene.so_term || undefined,
    description: gene.name || null,
    label: gene.symbol as string,
    track_id: TrackId.GENE,
    stable_id: gene.stable_id as string,
    child_tracks: childTracks
  };
};

export const getDisplayStableId = (ensObject: Partial<EnsObjectGene>) =>
  ensObject.versioned_stable_id || ensObject.stable_id || '';
