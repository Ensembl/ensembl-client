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

import type {
  EpigenomicActivityForDisplay,
  TrackDataForDisplay
} from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/prepareActivityDataForDisplay';

type Props = {
  data: EpigenomicActivityForDisplay;
  scale: ScaleLinear<number, number>;
  width: number;
};

// TODO: import as constant
const TRACK_HEIGHT = 12;
const OPEN_CHROMATIN_SIGNAL_HEIGHT = 8;

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

const ActivityTrack = ({
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
      y={offsetTop}
      width={signal.width}
      height={OPEN_CHROMATIN_SIGNAL_HEIGHT}
      fill={getSignalColor(signal.value)}
    />
  ));
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
