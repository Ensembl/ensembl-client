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

import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import set from 'lodash/fp/set';

import IndexedDB from 'src/services/indexeddb-service';

import {
  saveTrackSettings,
  saveTrackSettingsForGenome,
  getTrackSettingsForGenome,
  getTrackSettings,
  updateTrackSettings,
  updateTrackSettingsForGenome,
  deleteTrackSettings,
  deleteTrackSettingsForGenome
} from './trackSettingsStorageService';

import {
  buildDefaultGeneTrack,
  buildDefaultFocusGeneTrack,
  buildDefaultRegularTrack
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import { GB_TRACK_SETTINGS_STORE_NAME } from './trackSettingsStorageConstants';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      // FIXME use constants for object store names
      const trackSettingsObjectStore = db.createObjectStore(
        GB_TRACK_SETTINGS_STORE_NAME,
        { keyPath: ['genomeId', 'trackId'] }
      );
      trackSettingsObjectStore.createIndex('genomeId', 'genomeId', {
        unique: false
      });
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

describe('trackSettingsStorageService', () => {
  afterEach(async () => {
    await IndexedDB.clear(GB_TRACK_SETTINGS_STORE_NAME);
  });

  describe('saving track settings', () => {
    describe('saveTrackSettings', () => {
      it('saves settings for a single track', async () => {
        const genomeId = 'human';
        const trackId = 'gene-track';
        const geneTrack = buildDefaultGeneTrack(trackId);
        const database = await getDatabase();

        await saveTrackSettings(genomeId, geneTrack);
        const retrievedTrackSettings = await database.getAll(
          GB_TRACK_SETTINGS_STORE_NAME,
          [genomeId, geneTrack.id]
        );

        expect(retrievedTrackSettings.length).toBe(1);
        expect(retrievedTrackSettings[0].trackId).toBe(trackId);
        expect(retrievedTrackSettings[0].genomeId).toBe(genomeId);
        expect(retrievedTrackSettings[0].settings).toEqual(geneTrack.settings);
      });
    });

    describe('saveTrackSettingsForGenome', () => {
      it('saves settings for multiple tracks at once', async () => {
        const genomeId = 'human';
        const focusTrackId = 'focus';
        const track1Id = 'gene-track';
        const track2Id = 'plain-track';
        const focusTrack = buildDefaultFocusGeneTrack(focusTrackId);
        const geneTrack = buildDefaultGeneTrack(track1Id);
        const plainTrack = buildDefaultRegularTrack(track2Id);
        const database = await getDatabase();

        await saveTrackSettingsForGenome(genomeId, [
          focusTrack,
          geneTrack,
          plainTrack
        ]);

        const retrievedTrackSettings = await database.getAllFromIndex(
          GB_TRACK_SETTINGS_STORE_NAME,
          'genomeId',
          genomeId
        );

        expect(retrievedTrackSettings.length).toBe(3);
        expect(
          retrievedTrackSettings.find((track) => track.trackId === focusTrackId)
        ).toBeTruthy();
        expect(
          retrievedTrackSettings.find((track) => track.trackId === track1Id)
        ).toBeTruthy();
        expect(
          retrievedTrackSettings.find((track) => track.trackId === track2Id)
        ).toBeTruthy();
      });
    });
  });

  describe('retrieving track settings', () => {
    const genomeId = 'human';
    const anotherGenomeId = 'wheat';
    const focusTrackId = 'focus-gene';
    const geneTrackId = 'gene-track';
    const refSeqTrackId = 'reference-sequence-track';
    const oldGeneTrackId = 'old-gene-track';

    const outdatedSettings = {
      oldSetting: 'hello world'
    };

    let focusTrack: any;
    let geneTrack: any;
    let refSeqTrack: any;
    let oldGeneTrack: any;

    beforeEach(async () => {
      focusTrack = buildDefaultFocusGeneTrack(focusTrackId);
      geneTrack = buildDefaultGeneTrack(geneTrackId);
      refSeqTrack = buildDefaultRegularTrack(refSeqTrackId);
      oldGeneTrack = buildDefaultGeneTrack(oldGeneTrackId);
      oldGeneTrack.settings = {
        ...oldGeneTrack.settings,
        ...outdatedSettings
      };

      await saveTrackSettingsForGenome(genomeId, [
        focusTrack,
        geneTrack,
        refSeqTrack,
        oldGeneTrack
      ]);
      await saveTrackSettings(anotherGenomeId, oldGeneTrack);
    });

    describe('getTrackSettings', () => {
      it('retrieves settings for a single track', async () => {
        const retrievedGeneTrack = await getTrackSettings(
          genomeId,
          geneTrackId
        );
        expect(retrievedGeneTrack.trackId).toBe(geneTrackId);
      });

      it('removes outdated track settings', async () => {
        const retrievedGeneTrack = await getTrackSettings(
          genomeId,
          oldGeneTrackId
        );
        const allowedSettings = new Set(Object.keys(geneTrack.settings));

        const hasOnlyAllowedFields = Object.keys(
          retrievedGeneTrack.settings
        ).every((setting) => allowedSettings.has(setting));

        expect(hasOnlyAllowedFields).toBe(true);
      });
    });

    describe('getTrackSettingsForGenome', () => {
      it('retrieves settings for multiple tracks', async () => {
        const humanTracks = await getTrackSettingsForGenome(genomeId);
        expect(humanTracks.length).toBe(4);

        const retrievedTrackIds = humanTracks.map((track) => track.trackId);
        expect(retrievedTrackIds.sort()).toEqual(
          [focusTrackId, geneTrackId, refSeqTrackId, oldGeneTrackId].sort()
        );

        const wheatTracks = await getTrackSettingsForGenome(anotherGenomeId);
        expect(wheatTracks.length).toBe(1);
      });

      it('removes outdated track settings', async () => {
        const humanTracks = await getTrackSettingsForGenome(genomeId);
        const oldGeneTrack = humanTracks.find(
          (track) => track.trackId === oldGeneTrackId
        );

        const allowedSettings = new Set(Object.keys(geneTrack.settings));
        const hasOnlyAllowedFields = Object.keys(
          oldGeneTrack?.settings ?? {}
        ).every((setting) => allowedSettings.has(setting));

        expect(hasOnlyAllowedFields).toBe(true);
      });
    });
  });

  describe('updating track settings', () => {
    const genomeId = 'human';
    const geneTrackId = 'gene-track';
    const refSeqTrackId = 'reference-sequence-track';

    let geneTrack: any;
    let refSeqTrack: any;

    beforeEach(async () => {
      geneTrack = buildDefaultGeneTrack(geneTrackId);
      refSeqTrack = buildDefaultRegularTrack(refSeqTrackId);

      // making sure of the initial values
      Object.assign(geneTrack.settings, {
        showTrackName: false,
        showTranscriptIds: false
      });
      Object.assign(refSeqTrack.settings, {
        showTrackName: false
      });

      await saveTrackSettingsForGenome(genomeId, [geneTrack, refSeqTrack]);
    });

    describe('updateTrackSettings', () => {
      it('updates a single track', async () => {
        const trackBefore = await getTrackSettings(genomeId, geneTrackId);
        expect(trackBefore.settings.showTranscriptIds).toBe(false);

        const updatedTrackSettings = set(
          'settings.showTranscriptIds',
          true,
          geneTrack
        );
        await updateTrackSettings(genomeId, updatedTrackSettings);

        const trackAfter = await getTrackSettings(genomeId, geneTrackId);
        expect(trackAfter.settings.showTranscriptIds).toBe(true);
      });
    });

    describe('updateTrackSettingsForGenome', () => {
      it('updates multiple tracks', async () => {
        const tracksBefore = await getTrackSettingsForGenome(genomeId);
        const geneTrackBefore = tracksBefore.find(
          (track) => track.trackId === geneTrack.id
        );
        const refSeqTrackBefore = tracksBefore.find(
          (track) => track.trackId === refSeqTrack.id
        );
        expect(geneTrackBefore?.settings.showTranscriptIds).toBe(false);
        expect(geneTrackBefore?.settings.showTrackName).toBe(false);
        expect(refSeqTrackBefore?.settings.showTrackName).toBe(false);

        const updatedGeneTrackSettings = {
          ...geneTrack,
          settings: {
            ...geneTrack.settings,
            showTrackName: true,
            showTranscriptIds: true
          }
        };
        const updatedRefSeqTrackSettings = set(
          'settings.showTrackName',
          true,
          refSeqTrack
        );
        await updateTrackSettingsForGenome(genomeId, [
          updatedGeneTrackSettings,
          updatedRefSeqTrackSettings
        ]);

        const tracksAfter = await getTrackSettingsForGenome(genomeId);
        const geneTrackAfter = tracksAfter.find(
          (track) => track.trackId === geneTrack.id
        );
        const refSeqTrackAfter = tracksAfter.find(
          (track) => track.trackId === refSeqTrack.id
        );
        expect(geneTrackAfter?.settings.showTranscriptIds).toBe(true);
        expect(geneTrackAfter?.settings.showTrackName).toBe(true);
        expect(refSeqTrackAfter?.settings.showTrackName).toBe(true);
      });
    });
  });

  describe('deleting track settings', () => {
    const humanGenomeId = 'human';
    const wheatGenomeId = 'wheat';
    const geneTrackId = 'gene-track';
    const refSeqTrackId = 'reference-sequence-track';

    let geneTrack: any;
    let refSeqTrack: any;

    beforeEach(async () => {
      geneTrack = buildDefaultGeneTrack(geneTrackId);
      refSeqTrack = buildDefaultRegularTrack(refSeqTrackId);

      await saveTrackSettingsForGenome(humanGenomeId, [geneTrack, refSeqTrack]);
      await saveTrackSettings(wheatGenomeId, geneTrack);
    });

    describe('deleteTrackSettings', () => {
      it('deletes settings of one track', async () => {
        const humanTracksBefore = await getTrackSettingsForGenome(
          humanGenomeId
        );
        const wheatTracksBefore = await getTrackSettingsForGenome(
          wheatGenomeId
        );
        expect(humanTracksBefore.length).toBe(2);
        expect(wheatTracksBefore.length).toBe(1);

        await deleteTrackSettings(humanGenomeId, geneTrackId);

        const humanTracksAfter = await getTrackSettingsForGenome(humanGenomeId);
        const wheatTracksAfter = await getTrackSettingsForGenome(wheatGenomeId);
        expect(humanTracksAfter.length).toBe(1);
        expect(wheatTracksAfter.length).toBe(1); // nothihng should have happened to wheat

        expect(humanTracksAfter[0].trackId).toBe(refSeqTrackId); // the only remaining human track settings is refSeq track settings
      });
    });

    describe('deleteTrackSettingsForGenome', () => {
      it('deletes settings of all track of a genome', async () => {
        const humanTracksBefore = await getTrackSettingsForGenome(
          humanGenomeId
        );
        const wheatTracksBefore = await getTrackSettingsForGenome(
          wheatGenomeId
        );
        expect(humanTracksBefore.length).toBe(2);
        expect(wheatTracksBefore.length).toBe(1);

        await deleteTrackSettingsForGenome(humanGenomeId);

        const humanTracksAfter = await getTrackSettingsForGenome(humanGenomeId);
        const wheatTracksAfter = await getTrackSettingsForGenome(wheatGenomeId);
        expect(humanTracksAfter.length).toBe(0);
        expect(wheatTracksAfter.length).toBe(1); // nothihng should have happened to wheat
      });
    });
  });
});
