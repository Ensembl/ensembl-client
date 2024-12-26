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

import { scaleLinear, interpolateHcl, type ScaleLinear } from 'd3';

import {
  TRACK_HEIGHT,
  OPEN_CHROMATIN_SIGNAL_HEIGHT,
  OPEN_CHROMATIN_SIGNAL_OFFSET_TOP,
  OPEN_CHROMATIN_PEAK_HEIGHT,
  OPEN_CHROMATIN_PEAK_OFFSET_TOP,
  HISTONE_NARROW_PEAK_OFFSET_TOP,
  HISTONE_NARROW_PEAK_HEIGHT
} from './epigenomeActivityImageConstants';

import type {
  EpigenomicActivityForDisplay,
  TrackDataForDisplay
} from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/prepareActivityDataForDisplay';

type Props = {
  data: EpigenomicActivityForDisplay;
  scale: ScaleLinear<number, number>;
  width: number;
};

const EpigenomeActivityImage = (props: Props) => {
  const width = props.width;
  const imageHeight = getImageHeight(props.data);

  return (
    <svg
      viewBox={`0 0 ${width} ${imageHeight}`}
      style={{
        width: `${width}px`,
        height: `${imageHeight}px`
      }}
    >
      <ActivityTracks {...props} />
    </svg>
  );
};

const ActivityTracks = ({ data }: { data: Props['data'] }) => {
  return data.data.map((row, index) => (
    <ActivityTrack key={index} data={row} offsetTop={index * TRACK_HEIGHT} />
  ));
};

const ActivityTrack = (props: {
  data: TrackDataForDisplay;
  offsetTop: number;
}) => {
  return (
    <>
      <OpenChromatinSignals {...props} />
      <OpenChromatinPeaks {...props} />
      <HistoneNarrowPeaks {...props} />
    </>
  );
};

const OpenChromatinSignals = ({
  data,
  offsetTop
}: {
  data: TrackDataForDisplay;
  offsetTop: number;
}) => {
  return data.openChromatin.signals.map((signal) => (
    <rect
      key={signal.x}
      x={signal.x}
      y={offsetTop + OPEN_CHROMATIN_SIGNAL_OFFSET_TOP}
      width={signal.width}
      height={OPEN_CHROMATIN_SIGNAL_HEIGHT}
      fill={getSignalColor(signal.value)}
    />
  ));
};

const OpenChromatinPeaks = ({
  data,
  offsetTop
}: {
  data: TrackDataForDisplay;
  offsetTop: number;
}) => {
  return data.openChromatin.peaks.map((peak) => (
    <rect
      key={peak.x}
      x={peak.x}
      y={offsetTop + OPEN_CHROMATIN_PEAK_OFFSET_TOP}
      width={peak.width}
      height={OPEN_CHROMATIN_PEAK_HEIGHT}
      data-type="open-chromatin-peak"
      stroke="black"
      fill="none"
    />
  ));
};

const HistoneNarrowPeaks = ({
  data,
  offsetTop
}: {
  data: TrackDataForDisplay;
  offsetTop: number;
}) => {
  return data.histones.narrowPeaks.map((peak) => {
    const order = peak.order;
    const trackOffsetTop = offsetTop;
    const peakOffsetTop =
      trackOffsetTop +
      OPEN_CHROMATIN_PEAK_HEIGHT +
      HISTONE_NARROW_PEAK_OFFSET_TOP +
      order * (HISTONE_NARROW_PEAK_HEIGHT + HISTONE_NARROW_PEAK_OFFSET_TOP);

    return (
      <rect
        key={`${peak.label}-${peak.x}`}
        x={peak.x}
        y={peakOffsetTop}
        width={peak.width}
        height={HISTONE_NARROW_PEAK_HEIGHT}
        data-type="histone-narrow-peak"
        data-order={order}
        data-track-offset-top={trackOffsetTop}
        fill={peak.color}
      />
    );
  });
};

const getImageHeight = ({ data }: EpigenomicActivityForDisplay) => {
  const tracksCount = data.length;

  return TRACK_HEIGHT * tracksCount;
};

const signalColorScale = scaleLinear<string>()
  .domain([1, 9])
  .range(['#f1f1f1', '#474747'])
  .interpolate(interpolateHcl);

const getSignalColor = (value: number) => {
  return signalColorScale(value);
};

export default EpigenomeActivityImage;
