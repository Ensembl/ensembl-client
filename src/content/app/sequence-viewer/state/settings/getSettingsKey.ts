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

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';
import type {
  GeneSequenceSettings,
  TranscriptSequenceSettings,
  LocationSequenceSettings
} from './settingsSlice'; // this is a circular dependency on settingsSlice; but it's ok as long as it's just for a type

type GeneSequenceSettingsKeyParams = Omit<GeneSequenceSettings, 'options'>;
type TranscriptSequenceSettingsKeyParams = Omit<
  TranscriptSequenceSettings,
  'options'
>;
type LocationSequenceSettingsKeyParams = Omit<
  LocationSequenceSettings,
  'options'
>;

type SequenceSettingsKeyParams =
  | GeneSequenceSettingsKeyParams
  | TranscriptSequenceSettingsKeyParams
  | LocationSequenceSettingsKeyParams;

export const getSequenceSettingsKey = (
  payload: {
    genomeId: string;
  } & SequenceSettingsKeyParams
) => {
  if (payload.type === 'gene') {
    return getGeneSettingsKey(payload);
  } else if (payload.type === 'transcript') {
    return getTranscriptSettingsKey(payload);
  } else {
    return getLocationSettingsKey(payload);
  }
};

const getGeneSettingsKey = ({
  genomeId,
  geneId
}: {
  genomeId: string;
  geneId: string;
}) => {
  return `gene-${genomeId}-${geneId}`;
};

const getTranscriptSettingsKey = ({
  genomeId,
  transcriptId,
  sequenceView
}: {
  genomeId: string;
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
}) => {
  return `transcript-${genomeId}-${transcriptId}-${sequenceView}`;
};

const getLocationSettingsKey = ({
  genomeId,
  location
}: {
  genomeId: string;
  location: string;
}) => {
  return `location-${genomeId}-${location}`;
};
