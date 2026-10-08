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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';
import type { AnnotatedSequenceOptionsResponsePayload } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';

export type TranscriptSequenceLineNumbering =
  'region' | 'gene' | 'transcript' | 'cdna' | 'cds';

export type SequenceOptionValue = string | number | boolean;

export type LocationSequenceSettings = {
  type: 'location';
  locationId: string;
  options: Record<string, SequenceOptionValue | SequenceOptionValue[]>;
};

export type GeneSequenceSettings = {
  type: 'gene';
  geneId: string;
  options: Record<string, SequenceOptionValue | SequenceOptionValue[]>;
};

export type TranscriptSequenceSettings = {
  type: 'transcript';
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
  options: Record<string, SequenceOptionValue | SequenceOptionValue[]>;
};

export type SequenceSettings =
  LocationSequenceSettings | GeneSequenceSettings | TranscriptSequenceSettings;

// A map of genome id to sequence settings
type SequenceSettingsState = Record<string, SequenceSettings>;

export const createInitialGeneSettings = ({
  geneId,
  payload
}: {
  geneId: string;
  payload: AnnotatedSequenceOptionsResponsePayload;
}): GeneSequenceSettings => {
  const options: Record<string, SequenceOptionValue | SequenceOptionValue[]> =
    {};

  for (const section of payload.sections) {
    for (const child of section.children) {
      if (child.type === 'checkbox') {
        if (child.checked) {
          options[child.id] = child.value;
        }
      } else if (child.type === 'checkbox-group') {
        const values = [];
        for (const option of child.values) {
          if (option.checked) {
            values.push(option.value);
          }
        }
        if (values.length) {
          options[child.id] = values;
        }
      }
    }
  }

  return {
    type: 'gene',
    geneId,
    options
  };
};

// FIXME: move options-generating logic into its own function

export const createInitialTranscriptSettings = ({
  transcriptId,
  sequenceView = 'genomic',
  payload
}: {
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
  payload: AnnotatedSequenceOptionsResponsePayload;
}): TranscriptSequenceSettings => {
  const options: Record<string, SequenceOptionValue | SequenceOptionValue[]> =
    {};

  for (const section of payload.sections) {
    for (const child of section.children) {
      if (child.type === 'checkbox') {
        if (child.checked) {
          options[child.id] = child.value;
        }
      } else if (child.type === 'checkbox-group') {
        const values = [];
        for (const option of child.values) {
          if (option.checked) {
            values.push(option.value);
          }
        }
        if (values.length) {
          options[child.id] = values;
        }
      }
    }
  }

  return {
    type: 'transcript',
    transcriptId,
    sequenceView,
    options
  };
};

export const createInitialLocationSettings = ({
  locationId,
  options
}: {
  locationId: string;
  options: LocationSequenceSettings['options'];
}): LocationSequenceSettings => {
  return {
    type: 'location',
    locationId,
    options
  };
};

const initialState: SequenceSettingsState = {};

type LocationSequenceOptionsUpdatePayload = {
  type: 'location';
  genomeId: string;
  locationId: string;
  options: LocationSequenceSettings['options'];
};

type GeneSequenceOptionsUpdatePayload = {
  type: 'gene';
  genomeId: string;
  geneId: string;
  options: GeneSequenceSettings['options'];
};

type TranscriptSequenceOptionsUpdatePayload = {
  type: 'transcript';
  genomeId: string;
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
  options: TranscriptSequenceSettings['options'];
};

type SequenceOptionsUpdatePayload =
  | LocationSequenceOptionsUpdatePayload
  | GeneSequenceOptionsUpdatePayload
  | TranscriptSequenceOptionsUpdatePayload;

const settingsSlice = createSlice({
  name: 'sequence-viewer-settings',
  initialState,
  reducers: {
    setInitialSequenceSettings(
      state,
      action: PayloadAction<{
        genomeId: string;
        settings: SequenceSettings;
      }>
    ) {
      const { genomeId, settings } = action.payload;
      state[genomeId] = settings;
    },
    updateSequenceSettings(
      state,
      action: PayloadAction<SequenceOptionsUpdatePayload>
    ) {
      const { genomeId, ...rest } = action.payload;
      state[genomeId] = rest;
    }
  }
});

export const { setInitialSequenceSettings, updateSequenceSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
