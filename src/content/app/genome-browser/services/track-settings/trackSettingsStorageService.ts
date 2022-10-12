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

import IndexedDB from 'src/services/indexeddb-service';

import {
  getDefaultGeneTrackSettings,
  getDefaultRegularTrackSettings,
  TrackType,
  TrackSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import { GB_TRACK_SETTINGS_STORE_NAME } from './trackSettingsStorageConstants';

// the combination of genome id and track id will be used as a composite key
type StoredTrack = {
  genomeId: string;
  trackId: string;
  trackType: string;
  settings: Record<string, unknown>;
  createdAt: number; // timestamp, in milliseconds
  updatedAt: number; // timestamp, in milliseconds
};

// accepts an array of settings for multiple tracks of a single genome; saves all of them in one go
export const saveTrackSettingsForGenome = async (
  genomeId: string,
  trackSettings: TrackSettings[]
) => {
  const storageData = trackSettings.map((track) =>
    buildTrackForStorage(genomeId, track)
  );
  const database = await IndexedDB.getDB();

  const transaction = database.transaction(
    GB_TRACK_SETTINGS_STORE_NAME,
    'readwrite'
  );
  const databaseWritePromises = storageData.map((track) => {
    return transaction.store.add(track);
  });
  await Promise.all(databaseWritePromises);
  await transaction.done;
};

// accepts settings for a single track
export const saveTrackSettings = async (
  genomeId: string,
  trackSettings: TrackSettings
) => {
  const preparedTrackData = buildTrackForStorage(genomeId, trackSettings);
  const database = await IndexedDB.getDB();

  await database.put(GB_TRACK_SETTINGS_STORE_NAME, preparedTrackData);
};

export const getTrackSettingsForGenome = async (genomeId: string) => {
  const database = await IndexedDB.getDB();
  const retrievedTracks = await database.getAllFromIndex(
    GB_TRACK_SETTINGS_STORE_NAME,
    'genomeId',
    genomeId
  );
  return retrievedTracks.map(cleanUpStoredTrack);
};

// retrieve a single track whose genome id and track id is known
export const getTrackSettings = async (genomeId: string, trackId: string) => {
  const database = await IndexedDB.getDB();
  const retrievedTrack = await database.get(GB_TRACK_SETTINGS_STORE_NAME, [
    genomeId,
    trackId
  ]);
  return cleanUpStoredTrack(retrievedTrack);
};

// update settings for a single track
export const updateTrackSettings = async (
  genomeId: string,
  trackSettings: TrackSettings
) => {
  const { id: trackId } = trackSettings;
  const retrievedTrack = await getTrackSettings(genomeId, trackId);

  if (retrievedTrack) {
    retrievedTrack.settings = {
      ...retrievedTrack.settings,
      ...trackSettings.settings
    };
    retrievedTrack.updatedAt = Date.now();
    await saveStoredTracksSettingsForGenome(genomeId, [retrievedTrack]);
  } else {
    await saveTrackSettings(genomeId, trackSettings);
  }
};

// update settings for a multiple tracks of a single genome
export const updateTrackSettingsForGenome = async (
  genomeId: string,
  trackSettings: TrackSettings[]
) => {
  const retrievedTrackSettingsForGenome = await getTrackSettingsForGenome(
    genomeId
  );

  const updatedStoredTracks: StoredTrack[] = [];
  const newTrackSettings: TrackSettings[] = [];

  for (const track of trackSettings) {
    const storedTrack = retrievedTrackSettingsForGenome.find(
      ({ trackId }) => trackId === track.id
    );
    if (storedTrack) {
      storedTrack.settings = track.settings;
      storedTrack.updatedAt = Date.now();
      updatedStoredTracks.push(storedTrack);
    } else {
      newTrackSettings.push(track);
    }
  }

  if (updatedStoredTracks.length) {
    await saveStoredTracksSettingsForGenome(genomeId, updatedStoredTracks);
  }
  if (newTrackSettings.length) {
    await saveTrackSettingsForGenome(genomeId, newTrackSettings);
  }
};

// delete settings of a single track
export const deleteTrackSettings = async (
  genomeId: string,
  trackId: string
) => {
  const database = await IndexedDB.getDB();
  await database.delete(GB_TRACK_SETTINGS_STORE_NAME, [genomeId, trackId]);
};

// delete settings of all tracks of a genome (useful when a species gets deleted)
export const deleteTrackSettingsForGenome = async (genomeId: string) => {
  const storedTracks = await getTrackSettingsForGenome(genomeId);

  for (const track of storedTracks) {
    await deleteTrackSettings(genomeId, track.trackId);
  }
};

const saveStoredTracksSettingsForGenome = async (
  genomeId: string,
  storedTracks: StoredTrack[]
) => {
  const database = await IndexedDB.getDB();

  const transaction = database.transaction(
    GB_TRACK_SETTINGS_STORE_NAME,
    'readwrite'
  );
  const databaseWritePromises = storedTracks.map((track) => {
    return transaction.store.put(track);
  });
  await Promise.all(databaseWritePromises);
  await transaction.done;
};

const buildTrackForStorage = (
  genomeId: string,
  trackSettings: TrackSettings
): StoredTrack => ({
  genomeId,
  trackId: trackSettings.id,
  trackType: trackSettings.trackType,
  settings: trackSettings.settings,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// filter out from saved track settings whataver outdated rubbish may have accumulated there over time
const cleanUpStoredTrack = (track: StoredTrack) => {
  const { trackType } = track;
  const relevantSettings = trackSettingFieldsMap.get(trackType);
  if (!relevantSettings) {
    // ¯\_(ツ)_/¯ can't check
    return track;
  }
  const verifiedSettingsEntries = Object.entries(track.settings).filter(
    ([key]) => {
      return relevantSettings.has(key);
    }
  );
  track.settings = Object.fromEntries(verifiedSettingsEntries);
  return track;
};

// keep a list of which settings are allowed for which known types of tracks
const trackSettingFieldsMap = new Map<string, Set<string>>();
trackSettingFieldsMap.set(
  TrackType.GENE,
  new Set(Object.keys(getDefaultGeneTrackSettings()))
);
trackSettingFieldsMap.set(
  TrackType.FOCUS_GENE,
  new Set(Object.keys(getDefaultGeneTrackSettings()))
);
trackSettingFieldsMap.set(
  TrackType.REGULAR,
  new Set(Object.keys(getDefaultRegularTrackSettings()))
);
