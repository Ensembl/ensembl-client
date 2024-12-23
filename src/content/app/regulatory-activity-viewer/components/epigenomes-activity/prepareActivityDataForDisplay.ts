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

import type { ScaleLinear } from 'd3';

import type {
  EpigenomeActivityResponse,
  TrackData
} from 'src/content/app/regulatory-activity-viewer/types/epigenomeActivity';

/**
 * CONSIDER:
 * - The number of DOM elements in a track should never be greater
 *   than the number of pixels along the x-axis of the track
 *   (i.e., no greater than the width of the track)
 * - Input data uses genomic coordinates. Therefore, the function
 *   that collates the data should
 *
 * Compress the
 */

type Params = {
  data: EpigenomeActivityResponse;
  location: {
    start: number;
    end: number;
  };
  scale: ScaleLinear<number, number>;
};

type PreparedOpenChromatinSignal = {
  x: number;
  width: number;
  value: number;
};

export type TrackDataForDisplay = {
  openChromatin: {
    signals: PreparedOpenChromatinSignal[];
  };
};

export type EpigenomicActivityForDisplay = {
  data: TrackDataForDisplay[];
};

export const prepareActivityDataForDisplay = (
  params: Params
): EpigenomicActivityForDisplay => {
  const preparedTracks = params.data.data.map((trackData) =>
    prepareTrackData({
      track: trackData,
      location: params.location,
      scale: params.scale
    })
  );

  return {
    data: preparedTracks
  };
};

const prepareTrackData = (params: {
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}) => {
  const openChromatinSignals = prepareOpenChromatinSignalsForTrack(params);

  return {
    openChromatin: {
      signals: openChromatinSignals
    }
  } as TrackDataForDisplay;
};

const prepareOpenChromatinSignalsForTrack = ({
  track,
  location,
  scale
}: {
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}) => {
  const openChromatinSignals = track.open_chromatin.signal;

  const result: PreparedOpenChromatinSignal[] = [];

  for (const signal of openChromatinSignals) {
    if (signal.e < location.start || signal.s > location.end) {
      continue;
    }
    const signalStart = Math.max(location.start, signal.s);
    const signalEnd = Math.min(location.end, signal.e);
    const signalValue = signal.v;

    const signalX = scale(signalStart);
    const signalWidth = scale(signalEnd - signalStart);

    const previousPreparedSignal = result.at(-1);

    const distanceFromPreviousSignal = previousPreparedSignal
      ? signalX - previousPreparedSignal.x
      : 1;

    if (distanceFromPreviousSignal >= 1) {
      const signal = {
        x: signalX,
        width: Math.max(signalWidth, 1),
        value: signalValue
      };
      result.push(signal);
    } else {
      // combine current signal with the previous signal
      const newValue = Math.round(
        (signalValue + previousPreparedSignal!.value) / 2
      );
      previousPreparedSignal!.value = newValue;
    }
  }

  return result;
};
