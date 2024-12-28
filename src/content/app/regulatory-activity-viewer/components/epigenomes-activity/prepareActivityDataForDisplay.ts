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
  EpigenomeActivityMetadata,
  HistoneGappedPeakData,
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

type PreparedOpenChromatinPeak = {
  x: number;
  width: number;
};

type PreparedHistoneNarrowPeak = {
  type: 'narrow_peak';
  label: string;
  x: number;
  width: number;
  color: string;
  order: number; // order along the y-axis in which to paint the peak
};

type PreparedHistoneGappedPeak = {
  type: 'gapped_peak';
  label: string;
  blocks: {
    x: number;
    width: number;
  }[];
  connectors: {
    x: number;
    width: number;
  }[];
  color: string;
  order: number; // order along the y-axis in which to paint the peak
};

export type TrackDataForDisplay = {
  openChromatin: {
    signals: PreparedOpenChromatinSignal[];
    peaks: PreparedOpenChromatinPeak[];
  };
  histones: {
    narrowPeaks: PreparedHistoneNarrowPeak[];
    gappedPeaks: PreparedHistoneGappedPeak[];
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
      metadata: params.data.metadata,
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
  metadata: EpigenomeActivityMetadata;
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}): TrackDataForDisplay => {
  const openChromatinSignals = prepareOpenChromatinSignalsForTrack(params);
  const openChromatinPeaks = prepareOpenChromatinPeaksForTrack(params);
  const histoneNarrowPeaks = prepareHistoneNarrowPeaksForTrack(params);
  const histoneGappedPeaks = prepareHistoneGappedPeaksForTrack(params);

  return {
    openChromatin: {
      signals: openChromatinSignals,
      peaks: openChromatinPeaks
    },
    histones: {
      narrowPeaks: histoneNarrowPeaks,
      gappedPeaks: histoneGappedPeaks
    }
  };
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
    const signalWidth = scale(signalEnd) - signalX;

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

const prepareOpenChromatinPeaksForTrack = ({
  track,
  location,
  scale
}: {
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}) => {
  const openChromatinPeaks = track.open_chromatin.peaks;

  const result: PreparedOpenChromatinPeak[] = [];

  for (const peak of openChromatinPeaks) {
    if (peak.e < location.start || peak.s > location.end) {
      continue;
    }

    const peakStart = Math.max(location.start, peak.s);
    const peakEnd = Math.min(location.end, peak.e);

    const peakX = scale(peakStart);
    const peakWidth = scale(peakEnd) - peakX;

    if (!peakWidth) {
      continue;
    }

    const trackPeakData = {
      x: peakX,
      width: peakWidth
    };

    result.push(trackPeakData);
  }

  return result;
};

const prepareHistoneNarrowPeaksForTrack = ({
  metadata,
  track,
  location,
  scale
}: {
  metadata: EpigenomeActivityMetadata;
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}) => {
  const allHistoneMetadata = metadata.histone;
  const narrowPeakHistoneNames = Object.keys(allHistoneMetadata).filter(
    (histoneName) => allHistoneMetadata[histoneName].peak_type === 'narrow'
  );

  const allHistoneData = track.histone;

  const result: PreparedHistoneNarrowPeak[] = [];

  for (const hisoneName of Object.keys(allHistoneData)) {
    if (!narrowPeakHistoneNames.includes(hisoneName)) {
      continue;
    }

    const order = narrowPeakHistoneNames.indexOf(hisoneName);

    const histonePeaks = allHistoneData[hisoneName];

    for (const histonePeak of histonePeaks) {
      if (histonePeak.e < location.start || histonePeak.s > location.end) {
        continue;
      }

      const peakStart = Math.max(histonePeak.s, location.start);
      const peakEnd = Math.min(histonePeak.e, location.end);

      const peakX = scale(peakStart);
      const peakWidth = scale(peakEnd) - peakX;

      if (!peakWidth) {
        continue;
      }

      const trackPeakData = {
        type: 'narrow_peak',
        x: peakX,
        width: peakWidth,
        label: allHistoneMetadata[hisoneName].label,
        color: allHistoneMetadata[hisoneName].color,
        order
      } as const;

      result.push(trackPeakData);
    }
  }

  return result;
};

const prepareHistoneGappedPeaksForTrack = ({
  metadata,
  track,
  location,
  scale
}: {
  metadata: EpigenomeActivityMetadata;
  track: TrackData;
  location: Params['location'];
  scale: Params['scale'];
}) => {
  const allHistoneMetadata = metadata.histone;
  const narrowPeakHistoneNames = Object.keys(allHistoneMetadata).filter(
    (histoneName) => allHistoneMetadata[histoneName].peak_type === 'gapped'
  );

  const allHistoneData = track.histone;

  const result: PreparedHistoneGappedPeak[] = [];

  for (const hisoneName of Object.keys(allHistoneData)) {
    if (!narrowPeakHistoneNames.includes(hisoneName)) {
      continue;
    }

    const order = narrowPeakHistoneNames.indexOf(hisoneName);

    const histonePeaks = allHistoneData[hisoneName] as HistoneGappedPeakData[];

    for (const histonePeak of histonePeaks) {
      if (histonePeak.e < location.start || histonePeak.s > location.end) {
        continue;
      }

      const blocks: PreparedHistoneGappedPeak['blocks'] = [];
      const connectors: PreparedHistoneGappedPeak['connectors'] = [];

      for (let i = 0; i < histonePeak.block_starts.length; i++) {
        const blockRelativeStart = histonePeak.block_starts[i];
        const blockStart = Math.max(
          histonePeak.s + blockRelativeStart,
          location.start
        );
        const blockSize = histonePeak.block_sizes[i];
        const blockEnd = Math.min(blockStart + blockSize - 1, location.end);

        if (blockStart > location.end || blockEnd < location.start) {
          continue;
        }

        const blockX = scale(blockStart);
        const blockWidth = scale(blockEnd) - blockX;

        if (!blockWidth) {
          continue;
        }

        const block = {
          x: blockX,
          width: blockWidth
        };

        const previousBlock = blocks.at(-1);
        if (previousBlock) {
          const previousBlockEnd = previousBlock.x + previousBlock.width;
          const connector = {
            x: previousBlockEnd,
            width: block.x - previousBlockEnd
          };
          if (connector.width) {
            connectors.push(connector);
          }
        }

        blocks.push(block);
      }

      const trackPeakData = {
        type: 'gapped_peak',
        blocks,
        connectors,
        label: allHistoneMetadata[hisoneName].label,
        color: allHistoneMetadata[hisoneName].color,
        order
      } as const;

      result.push(trackPeakData);
    }
  }

  return result;
};
