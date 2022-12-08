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

import { useEffect, useRef } from 'react';
import {
  IncomingActionType,
  type ReportVisibleTranscriptsAction
} from '@ensembl/ensembl-genome-browser';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import { updateFocusGeneTranscriptsVisibility } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import type {
  FocusGeneTrack,
  FocusGeneTrackSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import type { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * The purposes of this hook are:
 * - be responsible for telling genome browser how to display the focus object
 * - save the focus object to the previously viewed list when it changes
 *
 * Only one copy of this hook should be run.
 */

const useFocusTrack = () => {
  const genomeBrowserMethods = useGenomeBrowser(); // getting it here once to avoid unnecessarily calling this hook from inside child hooks
  const { focusObjectId = '', parsedFocusObjectId = null } =
    useGenomeBrowserIds();
  const focusObject = useAppSelector((state) =>
    getFocusObjectById(state, focusObjectId)
  );

  useFocusGene({
    genomeBrowserMethods,
    focusGene:
      parsedFocusObjectId?.type === 'gene' ? (focusObject as FocusGene) : null,
    focusObjectId
  });

  /**
   * TODO: move the code for saving previous focus object here
   */
};

type Params = {
  focusGene: FocusGene | null;
  focusObjectId: string;
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>;
};

const useFocusGene = (params: Params) => {
  const { focusGene, genomeBrowserMethods, focusObjectId } = params;
  const { genomeBrowser, updateFocusGeneTranscripts, setFocusGene } =
    genomeBrowserMethods;
  const geneStableId = focusGene?.stable_id;
  const focusObjectIdRef = useRef(focusObjectId);
  const geneIdRef = useRef(geneStableId);
  const visibleTranscriptIds = focusGene?.visibleTranscriptIds ?? null;
  const trackSettingsForGenome = useAppSelector(getAllTrackSettings)
    ?.settingsForIndividualTracks.focus as FocusGeneTrack | undefined;

  const stringifiedVisibleTranscriptIds = visibleTranscriptIds
    ? String([...visibleTranscriptIds].sort())
    : 'null';

  const dispatch = useAppDispatch();

  useEffect(() => {
    focusObjectIdRef.current = focusObjectId;
    geneIdRef.current = geneStableId;
  }, [focusObjectId, geneStableId]);

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.VISIBLE_TRANSCRIPTS,
      (action: ReportVisibleTranscriptsAction) => {
        const { gene_id, transcript_ids } = action.payload;
        if (gene_id === geneIdRef.current) {
          setVisibleTranscriptIds(transcript_ids);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [genomeBrowser]);

  useEffect(() => {
    if (!geneStableId) {
      return;
    }

    setFocusGene(focusObjectId);
  }, [
    genomeBrowser,
    focusObjectId,
    stringifiedVisibleTranscriptIds,
    geneStableId
  ]);

  useEffect(() => {
    if (!geneStableId) {
      return;
    }
    // Even if the user has disabled all gene's transcripts, re-focusing on this gene should show at least one transcript
    // (it's possible that this logic will change when no selected transcripts results in showing a ghosted transcript)
    const transcriptsParam = visibleTranscriptIds ? visibleTranscriptIds : null;
    updateFocusGeneTranscripts(transcriptsParam);
  }, [
    genomeBrowser, // updateFocusGeneTranscripts requires genomeBrowser to be defined
    geneStableId,
    stringifiedVisibleTranscriptIds
  ]);

  useEffect(() => {
    if (!geneStableId || !trackSettingsForGenome) {
      return;
    }
    sendFocusGeneTrackSettings(
      trackSettingsForGenome.settings,
      genomeBrowserMethods
    );
  }, [trackSettingsForGenome]);

  const setVisibleTranscriptIds = (transcriptIds: string[]) => {
    dispatch(
      updateFocusGeneTranscriptsVisibility({
        focusGeneId: focusObjectIdRef.current,
        visibleTranscriptIds: transcriptIds
      })
    );
  };
};

const sendFocusGeneTrackSettings = (
  trackSettings: FocusGeneTrackSettings,
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>
) => {
  const trackId = 'focus';

  // Notice that in contrast to genomic tracks, we aren't sending the "show five transcripts"
  // message to the genome browser here. We haven't found a good way of reconciling the state
  // of the "show five transcripts" toggle for the focus gene track, and the list of manually shown/hidden transcripts
  Object.entries(trackSettings).forEach((keyValuePair) => {
    const [settingName, settingValue] = keyValuePair as [string, boolean];
    switch (settingName) {
      case 'showTrackName':
        genomeBrowserMethods.toggleTrackName({
          trackId,
          shouldShowTrackName: settingValue
        });
        break;
      case 'showFeatureLabels':
        genomeBrowserMethods.toggleFeatureLabels({
          trackId,
          shouldShowFeatureLabels: settingValue
        });
        break;
      case 'showTranscriptIds':
        genomeBrowserMethods.toggleTranscriptIds({
          trackId,
          shouldShowTranscriptIds: settingValue
        });
        break;
    }
  });
};

export default useFocusTrack;
