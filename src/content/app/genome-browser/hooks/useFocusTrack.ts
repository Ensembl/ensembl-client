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

import { getFocusObjectTrackState } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { updateObjectTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import { Status } from 'src/shared/types/status';
import type { FocusGeneTrack } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { FocusObjectIdConstituents } from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * The purposes of this hook are:
 * - be responsible for telling genome browser how to display the focus object
 * - save the focus object to the previously viewed list when it changes
 *
 * Only one copy of this hook should be run.
 */

const useFocusTrack = () => {
  const genomeBrowserMethods = useGenomeBrowser(); // getting it here once to avoid unnecessarily calling this hook from inside child hooks
  const {
    genomeId = '',
    focusObjectId = '',
    parsedFocusObjectId = null
  } = useGenomeBrowserIds();
  const focusObject = useAppSelector((state) =>
    getFocusObjectTrackState(state, {
      genomeId,
      focusObjectId
    })
  );

  useFocusGene({
    genomeBrowserMethods,
    focusGene: parsedFocusObjectId?.type === 'gene' ? focusObject : null,
    focusObjectId,
    parsedFocusObjectId
  });

  /**
   * TODO: move the code for saving previous focus object here
   */
};

type Params = {
  focusGene: FocusGeneTrack | null;
  parsedFocusObjectId: FocusObjectIdConstituents | null;
  focusObjectId: string;
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>;
};

const useFocusGene = (params: Params) => {
  const {
    focusGene,
    genomeBrowserMethods,
    parsedFocusObjectId,
    focusObjectId
  } = params;
  const {
    genomeBrowser,
    updateFocusGeneTranscripts,
    setFocusGene,
    toggleTrack
  } = genomeBrowserMethods;
  const geneStableId = parsedFocusObjectId?.objectId;
  const geneIdRef = useRef(geneStableId);
  const visibleTranscriptIds = focusGene?.transcripts ?? null;

  const stringifiedVisibleTranscriptIds = visibleTranscriptIds
    ? String([...visibleTranscriptIds].sort())
    : 'null';

  const dispatch = useAppDispatch();

  useEffect(() => {
    geneIdRef.current = parsedFocusObjectId?.objectId;
  }, [parsedFocusObjectId?.objectId]);

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
    if (!focusObjectId) {
      return;
    }

    const trackStatus =
      Array.isArray(visibleTranscriptIds) && !visibleTranscriptIds.length
        ? Status.UNSELECTED
        : Status.SELECTED;

    if (trackStatus === Status.SELECTED) {
      setFocusGene(focusObjectId);
    } else {
      toggleTrack({ trackId: 'focus', status: Status.UNSELECTED });
    }
  }, [genomeBrowser, focusObjectId, stringifiedVisibleTranscriptIds]);

  useEffect(() => {
    // updateFocusGeneTranscripts requires genomeBrowser to be defined
    updateFocusGeneTranscripts(visibleTranscriptIds);
  }, [genomeBrowser, geneStableId, stringifiedVisibleTranscriptIds]);

  const setVisibleTranscriptIds = (transcriptIds: string[]) => {
    dispatch(
      updateObjectTrackStates({
        status: transcriptIds.length ? Status.SELECTED : Status.UNSELECTED,
        transcriptIds
      })
    );
  };
};

export default useFocusTrack;
