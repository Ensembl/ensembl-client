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
  GeneTrackSettings,
  FocusGeneTrackSettings,
  VariantTrackSettings,
  FocusVariantTrackSettings,
  RegularTrackSettings,
  GeneTrack,
  VariantTrack,
  FocusVariantTrack,
  FocusGeneTrack,
  RegularTrack,
  TrackSettings
} from './trackSettingsSlice';

export enum TrackType {
  GENE = 'gene',
  VARIANT = 'variant',
  FOCUS_GENE = 'focus-gene',
  FOCUS_VARIANT = 'focus-variant',
  REGULAR = 'regular'
}

export const getDefaultGeneTrackSettings = (): GeneTrackSettings => ({
  several: false,
  'transcript-label': false,
  name: false,
  label: true,
  isVisible: true
});

export const getDefaultVariantTrackSettings = (): VariantTrackSettings => ({
  'label-snv-id': false,
  'label-snv-alleles': false,
  'label-other-id': false,
  'label-other-alleles': false,
  'show-extents': false,
  name: false,
  isVisible: true
});

export const getDefaultFocusGeneTrackSettings = (): FocusGeneTrackSettings => {
  const geneTrackSettings =
    getDefaultGeneTrackSettings() as Partial<GeneTrackSettings>;
  delete geneTrackSettings.isVisible;
  return geneTrackSettings as FocusGeneTrackSettings;
};

export const getDefaultFocusVariantTrackSettings =
  (): FocusVariantTrackSettings => {
    const variantTrackSettings =
      getDefaultVariantTrackSettings() as Partial<VariantTrackSettings>;
    delete variantTrackSettings.isVisible;
    return variantTrackSettings as FocusVariantTrackSettings;
  };

export const getDefaultRegularTrackSettings = (): RegularTrackSettings => ({
  name: false,
  isVisible: true
});

export const buildDefaultGeneTrack = (trackId: string): GeneTrack => ({
  id: trackId,
  trackType: TrackType.GENE,
  settings: getDefaultGeneTrackSettings()
});

export const buildDefaultVariantTrack = (trackId: string): VariantTrack => ({
  id: trackId,
  trackType: TrackType.VARIANT,
  settings: getDefaultVariantTrackSettings()
});

export const buildDefaultFocusGeneTrack = (
  trackId: string
): FocusGeneTrack => ({
  id: trackId,
  trackType: TrackType.FOCUS_GENE,
  settings: getDefaultGeneTrackSettings()
});

export const buildDefaultFocusVariantTrack = (): FocusVariantTrack => {
  return {
    id: 'focus-variant',
    trackType: TrackType.FOCUS_VARIANT,
    settings: getDefaultFocusVariantTrackSettings()
  };
};

export const buildDefaultRegularTrack = (trackId: string): RegularTrack => ({
  id: trackId,
  trackType: TrackType.REGULAR,
  settings: getDefaultRegularTrackSettings()
});

export const isGeneTrack = (
  trackSettings: TrackSettings
): trackSettings is GeneTrack | FocusGeneTrack => {
  return [TrackType.GENE, TrackType.FOCUS_GENE].includes(
    trackSettings.trackType
  );
};
