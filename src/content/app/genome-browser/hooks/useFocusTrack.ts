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

import { useEffect, useRef, useCallback } from 'react';
import xor from 'lodash/xor';

import { getTrackSettings as getTrackSettingsFromStorage } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import usePrevious from 'src/shared/hooks/usePrevious';

import { buildDefaultFocusVariantTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import { updateFocusGeneTranscriptsVisibility } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';
import {
  addSettingsForTrack,
  type TrackSettings,
  type FocusGeneTrack,
  type FocusGeneTrackSettings,
  type FocusVariantTrackSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import type {
  TrackSummaryMessage,
  HotspotMessage
} from 'src/content/app/genome-browser/services/genome-browser-service/types/genomeBrowserMessages';
import type {
  TrackSummary,
  FocusGeneTrackSummary
} from 'src/content/app/genome-browser/services/genome-browser-service/types/trackSummary';
import type { TranscriptsLozengePayload } from 'src/content/app/genome-browser/services/genome-browser-service/types/hotspot';
import type {
  FocusGene,
  FocusVariant
} from 'src/shared/types/focus-object/focusObjectTypes';

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

  useFocusVariant({
    genomeBrowserMethods,
    focusVariant:
      parsedFocusObjectId?.type === 'variant'
        ? (focusObject as FocusVariant)
        : null,
    focusObjectId
  });

  /**
   * TODO: move the code for saving previous focus object here
   */
};

type UseFocusGeneParams = {
  focusGene: FocusGene | null;
  focusObjectId: string;
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>;
};

const useFocusGene = (params: UseFocusGeneParams) => {
  const { focusGene, genomeBrowserMethods, focusObjectId } = params;
  const { genomeBrowser, genomeBrowserService, updateFocusGeneTranscripts } =
    genomeBrowserMethods;
  const geneStableId = focusGene?.stable_id;
  const focusObjectIdRef = useRef(focusObjectId);
  const geneIdRef = useRef(geneStableId);
  const visibleTranscriptIds = focusGene?.visibleTranscriptIds ?? null;
  const focusGeneTrackSettings = useAppSelector(getAllTrackSettings)
    ?.settingsForIndividualTracks.focus as FocusGeneTrack | undefined;

  const allSortedFocusGeneTranscriptsRef = useRef<string[]>([]);
  const visibleTranscriptIdsRef = useRef(visibleTranscriptIds);
  const showSeveralTranscriptsRef = useRef(
    focusGeneTrackSettings?.settings.several
  );
  const previousSeveralTranscriptsSetting = usePrevious(
    focusGeneTrackSettings?.settings.several
  );

  const { currentData: fetchedFocusGeneData } = useGetTrackPanelGeneQuery(
    {
      genomeId: focusGene?.genome_id ?? '',
      geneId: geneStableId ?? ''
    },
    {
      skip: !focusGene
    }
  );

  const stringifiedVisibleTranscriptIds = visibleTranscriptIds
    ? String([...visibleTranscriptIds].sort())
    : 'null';

  const dispatch = useAppDispatch();

  // update all the refs
  useEffect(() => {
    focusObjectIdRef.current = focusObjectId;
    geneIdRef.current = geneStableId;
    allSortedFocusGeneTranscriptsRef.current = fetchedFocusGeneData
      ? defaultSort(fetchedFocusGeneData.gene.transcripts).map(
          (transcript) => transcript.stable_id
        )
      : [];
    visibleTranscriptIdsRef.current = visibleTranscriptIds;
    showSeveralTranscriptsRef.current =
      focusGeneTrackSettings?.settings.several;
  }, [
    focusObjectId,
    geneStableId,
    fetchedFocusGeneData,
    stringifiedVisibleTranscriptIds
  ]);

  useEffect(() => {
    if (!genomeBrowserService) {
      return;
    }
    const visibleTranscriptsSubscription = genomeBrowserService.subscribe(
      'track_summary',
      (message: TrackSummaryMessage) => {
        const focusGeneTrackInfo = getFocusGeneTrackInfo(
          message.payload.summary
        );
        if (!focusGeneTrackInfo) {
          return; // shouldn't happen
        }

        const { gene_id, transcript_ids } = focusGeneTrackInfo;
        if (
          gene_id === geneIdRef.current &&
          xor(transcript_ids, visibleTranscriptIdsRef.current).length // symmetric difference between two arrays; TODO: replace with Set.prototype.symmetricDifference when it is included in JS standard
        ) {
          setVisibleTranscriptIds(transcript_ids);
        }
      }
    );

    const lozengeClicksSubscription = genomeBrowserService.subscribe(
      'hotspot',
      (message: HotspotMessage) => {
        if (isLozengeClickMessage(message.payload)) {
          onLozengeClick();
        }
      }
    );

    const subscriptions = [
      visibleTranscriptsSubscription,
      lozengeClicksSubscription
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [genomeBrowserService]);

  /**
   * In the below hook, we are making a choice about how many transcript ids to send to the genome browser.
   * Specifically, we are trying to establish:
   * 1) whether the gene has been previously viewed and the number of its visible transcripts saved in browser storage
   * 2) if not, then what is the value of the 1/5 transcripts toggle in track settings panel
   */
  useEffect(() => {
    if (!geneStableId || !fetchedFocusGeneData) {
      return;
    }
    let transcriptIds: string[];

    if (
      !visibleTranscriptIds || // hopefully, there won't be any race conditions
      (typeof previousSeveralTranscriptsSetting === 'boolean' &&
        typeof focusGeneTrackSettings?.settings.several === 'boolean' &&
        previousSeveralTranscriptsSetting !==
          focusGeneTrackSettings?.settings.several) // the toggle has been switched
    ) {
      const shouldShowSeveralTranscripts =
        focusGeneTrackSettings?.settings.several;
      const numberOfTranscriptsToShow = shouldShowSeveralTranscripts ? 5 : 1;

      transcriptIds = allSortedFocusGeneTranscriptsRef.current.slice(
        0,
        numberOfTranscriptsToShow
      );
    } else {
      transcriptIds = visibleTranscriptIds;
    }

    updateFocusGeneTranscripts(transcriptIds);
  }, [
    genomeBrowser, // updateFocusGeneTranscripts requires genomeBrowser to be defined
    geneStableId,
    stringifiedVisibleTranscriptIds,
    focusGeneTrackSettings?.settings.several,
    allSortedFocusGeneTranscriptsRef.current.length
  ]);

  // apply track settings other than several transcripts
  useEffect(() => {
    if (!geneStableId || !focusGeneTrackSettings) {
      return;
    }

    sendFocusGeneTrackSettings(
      focusGeneTrackSettings.settings,
      genomeBrowserMethods
    );
  }, [focusGeneTrackSettings]);

  const setVisibleTranscriptIds = (transcriptIds: string[]) => {
    dispatch(
      updateFocusGeneTranscriptsVisibility({
        focusGeneId: focusObjectIdRef.current,
        visibleTranscriptIds: transcriptIds
      })
    );
  };

  const onLozengeClick = useCallback(() => {
    const allTranscriptIds = allSortedFocusGeneTranscriptsRef.current;
    let transcriptIds: string[];
    if (visibleTranscriptIdsRef.current?.length === allTranscriptIds.length) {
      // all transcripts shown; should collapse transcripts to one or several
      transcriptIds = showSeveralTranscriptsRef.current
        ? allTranscriptIds.slice(0, 5)
        : allTranscriptIds.slice(0, 1);
    } else {
      transcriptIds = allTranscriptIds;
    }

    updateFocusGeneTranscripts(transcriptIds);
  }, [
    stringifiedVisibleTranscriptIds,
    updateFocusGeneTranscripts,
    focusGeneTrackSettings
  ]);
};

const sendFocusGeneTrackSettings = (
  trackSettings: FocusGeneTrackSettings,
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>
) => {
  const trackId = 'focus';
  const { toggleTrackSetting } = genomeBrowserMethods;

  // Notice that in contrast to genomic tracks, we aren't sending the "show five transcripts"
  // message to the genome browser here. We haven't found a good way of reconciling the state
  // of the "show five transcripts" toggle for the focus gene track, and the list of manually shown/hidden transcripts
  Object.entries(trackSettings)
    .filter(([settingName]) => settingName !== 'several')
    .forEach((keyValuePair) => {
      const [settingName, settingValue] = keyValuePair as [string, boolean];
      toggleTrackSetting({
        trackId,
        setting: settingName,
        isEnabled: settingValue
      });
    });
};

type UseFocusVariantParams = {
  focusVariant: FocusVariant | null;
  focusObjectId: string;
  genomeBrowserMethods: ReturnType<typeof useGenomeBrowser>;
};

const useFocusVariant = (params: UseFocusVariantParams) => {
  const { focusVariant, genomeBrowserMethods } = params;
  const { setFocusObject, toggleTrackSetting, genomeBrowser } =
    genomeBrowserMethods;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!focusVariant || !genomeBrowser) {
      return;
    }

    restoreTrackSettings(focusVariant.genome_id);

    setFocusObject(focusVariant.object_id);
  }, [genomeBrowser, focusVariant?.object_id]);

  // NOTE: ideally, this should be run once per genome id change or once per focus object type change
  const restoreTrackSettings = async (genomeId: string) => {
    const savedTrackSettings = await getTrackSettingsFromStorage(
      genomeId,
      'focus-variant'
    );

    let trackSettings;

    if (savedTrackSettings) {
      trackSettings = {
        id: savedTrackSettings.trackId,
        trackType: savedTrackSettings.trackType,
        settings: savedTrackSettings.settings as FocusVariantTrackSettings
      } as TrackSettings;
    } else {
      trackSettings = buildDefaultFocusVariantTrack();
    }

    applyGenomeBrowserSettings(trackSettings);

    dispatch(
      addSettingsForTrack({
        genomeId,
        trackId: 'focus-variant',
        trackSettings
      })
    );
  };

  const applyGenomeBrowserSettings = (trackSettings: TrackSettings) => {
    for (const [settingName, settingValue] of Object.entries(
      trackSettings.settings
    )) {
      toggleTrackSetting({
        trackId: 'focus-variant',
        setting: settingName,
        isEnabled: settingValue
      });
    }
  };
};

const getFocusGeneTrackInfo = (trackSummary: TrackSummary[]) => {
  const focusTrackSummary = trackSummary.find(
    (track) => track['switch-id'] === 'focus'
  ) as FocusGeneTrackSummary | null;
  if (!focusTrackSummary) {
    return null;
  }

  const transcript_ids = focusTrackSummary['transcripts-shown'];
  const gene_id = focusTrackSummary.id;

  return {
    transcript_ids,
    gene_id
  };
};

const isLozengeClickMessage = (payload: {
  variety: { type: string }[];
}): payload is TranscriptsLozengePayload => {
  return payload.variety[0].type === 'lozenge';
};

export default useFocusTrack;
