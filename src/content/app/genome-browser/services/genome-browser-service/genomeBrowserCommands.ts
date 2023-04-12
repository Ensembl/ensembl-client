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

import type { EnsemblGenomeBrowser } from 'src/content/app/genome-browser/services/genome-browser-service/types/ensemblGenomeBrowser';

export const setFocus = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  focusId: string;
  focusType: string;
  genomeId: string;
  bringIntoView?: boolean;
}) => {
  const { focusType } = payload;

  if (focusType === 'gene') {
    setFocusGene(payload);
  } else if (focusType === 'variant') {
    setFocusVariant(payload);
  } else if (focusType === 'location') {
    setFocusLocation(payload);
  }
};

export const setBrowserLocation = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  genomeId: string;
  regionName: string;
  start: number;
  end: number;
  focus?: { id: string; type: string };
}) => {
  const { genomeBrowser, regionName, start, end, genomeId, focus } = payload;
  genomeBrowser.set_stick(`${genomeId}:${regionName}`);

  if (focus) {
    setFocus({
      genomeBrowser,
      genomeId,
      focusId: focus.id,
      focusType: focus.type
    });
  }

  genomeBrowser.goto(start, end);
};

export const toggleTrack = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  trackId: string;
  isEnabled: boolean;
}) => {
  const { genomeBrowser, trackId, isEnabled } = payload;
  genomeBrowser.switch(['track', trackId], isEnabled);
};

// NOTE: this method can only handle boolean flags
export const toggleTrackSetting = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  trackId: string;
  setting: string;
  isEnabled: boolean;
}) => {
  const { genomeBrowser, trackId, setting, isEnabled } = payload;

  if (trackId === 'focus-variant') {
    toggleFocusVariantTrackSetting(payload);
  } else {
    genomeBrowser.switch(['track', trackId, setting], isEnabled);
  }
};

// NOTE: focus variant track deviates from any other track in that for some settings, it is identified by two strings: `focus, variant`
// To toggle name though, it is just `focus`
const toggleFocusVariantTrackSetting: typeof toggleTrackSetting = (payload) => {
  const { genomeBrowser, setting, isEnabled } = payload;
  if (setting === 'name') {
    genomeBrowser.switch(['track', 'focus', setting], isEnabled);
  } else {
    genomeBrowser.switch(['track', 'focus', 'variant', setting], isEnabled);
  }
};

// this can only be done for the focus gene track
export const setVisibleTranscripts = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  transcriptIds: string[] | null; // TODO: check whether null is still an usable option
}) => {
  const { genomeBrowser, transcriptIds } = payload;
  genomeBrowser.switch(
    ['track', 'focus', 'enabled-transcripts'],
    transcriptIds
  );
};

export const markTrackGroup = (payload: {
  genomeBrowser: EnsemblGenomeBrowser;
  trackGroup: string;
}) => {
  const { genomeBrowser, trackGroup } = payload;
  genomeBrowser.switch(['settings', 'tab-selected'], trackGroup);
};

const setFocusGene: typeof setFocus = (payload) => {
  const { genomeBrowser, genomeId, focusId, bringIntoView } = payload;

  if (bringIntoView) {
    genomeBrowser.jump(`focus:gene:${genomeId}:${focusId}`);
    genomeBrowser.wait();
  }

  genomeBrowser.switch(['track', 'focus'], true);
  genomeBrowser.switch(['track', 'focus', 'label'], true);
  genomeBrowser.switch(['track', 'focus', 'item', 'gene'], {
    genome_id: genomeId,
    item_id: focusId
  });
};

const setFocusVariant: typeof setFocus = (payload) => {
  const { genomeBrowser, genomeId, focusId, bringIntoView } = payload;

  if (bringIntoView) {
    genomeBrowser.jump(`focus:variant:${genomeId}:${focusId}`);
    genomeBrowser.wait();
  }

  genomeBrowser.switch(['track', 'focus'], true);
  genomeBrowser.switch(['track', 'focus', 'label'], true);
  genomeBrowser.switch(['track', 'focus', 'item', 'variant'], {
    genome_id: genomeId,
    variant_id: focusId
  });
};

const setFocusLocation: typeof setFocus = (payload) => {
  const { genomeBrowser, genomeId, focusId, bringIntoView } = payload;

  const locationRegex = /(.+):(\d+)-(\d+)/;
  const [, regionName, start, end] = locationRegex.exec(focusId) ?? [];
  if (!regionName || !start || !end) {
    return;
  }

  const startNum = parseInt(start);
  const endNum = parseInt(end);

  genomeBrowser.switch(['track', 'focus'], true);
  genomeBrowser.switch(['track', 'focus', 'item', 'location'], {
    genome_id: genomeId,
    region_name: regionName,
    start: startNum,
    end: endNum
  });

  // FIXME: can the below be replaced with the setBrowserLocation method?
  if (bringIntoView) {
    genomeBrowser.set_stick(`${genomeId}:${regionName}`);
    genomeBrowser.goto(startNum, endNum);
  }
};
