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

import { useAppDispatch } from 'src/store';

import { setRegionDetailLocation } from 'src/content/app/regulatory-activity-viewer/state/region-detail/regionDetailSlice';

type Props = {
  genomeId: string;
  location: { start: number; end: number };
  regionDetailLocation: { start: number; end: number } | null;
};

const RegionOverviewZoomButtons = (props: Props) => {
  const dispatch = useAppDispatch();

  const onZoomIn = () => {
    const newLocation = calculateZoomIn(props);
    dispatch(
      setRegionDetailLocation({
        genomeId: props.genomeId,
        location: newLocation
      })
    );
  };

  const onZoomOut = () => {
    const newLocation = calculateZoomOut(props);
    dispatch(
      setRegionDetailLocation({
        genomeId: props.genomeId,
        location: newLocation
      })
    );
  };

  return (
    <>
      <button onClick={onZoomIn}>-</button>
      <button onClick={onZoomOut}>+</button>
    </>
  );
};

// When zooming in, pick the location that is half the viewport in size, and is in the middle of the viewport
const calculateZoomIn = ({ location, regionDetailLocation }: Props) => {
  const viewportLocation = regionDetailLocation ?? location;
  const viewportDistance = viewportLocation.end - viewportLocation.start;
  const halfViewportDistance = Math.round(viewportDistance / 2);
  const quarterViewportDistance = Math.round(halfViewportDistance / 2);

  const newStart = viewportLocation.start + quarterViewportDistance;
  const newEnd = newStart + halfViewportDistance;

  return {
    start: newStart,
    end: newEnd
  };
};

const calculateZoomOut = ({ location, regionDetailLocation }: Props) => {
  if (!regionDetailLocation) {
    return location;
  }

  const viewportDistance =
    regionDetailLocation.end - regionDetailLocation.start;
  const newViewportDistance = viewportDistance * 2;
  const quarterNewDistance = Math.round(newViewportDistance / 4);
  const newStart = Math.max(
    regionDetailLocation.start - quarterNewDistance,
    location.start
  );
  const newEnd = Math.min(
    regionDetailLocation.end + quarterNewDistance,
    location.end
  );

  return {
    start: newStart,
    end: newEnd
  };
};

export default RegionOverviewZoomButtons;
