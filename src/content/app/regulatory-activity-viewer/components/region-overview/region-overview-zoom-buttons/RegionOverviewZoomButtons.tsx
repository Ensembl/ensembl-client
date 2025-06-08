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

import { useLocation, useNavigate } from 'react-router';

// FIXME: either create shared NavigationButtons components, or reuse the same approach as in genome browser (with ImageButton)

import CirclePlusIcon from 'static/icons/icon_plus_circle.svg';
import CircleMinusIcon from 'static/icons/icon_minus_circle.svg';

import styles from './RegionOverviewZoomButtons.module.css';

type Props = {
  genomeId: string;
  location: { regionName: string; start: number; end: number };
  regionLength: number;
};

const RegionOverviewZoomButtons = (props: Props) => {
  const navigate = useNavigate();
  const urlLocation = useLocation();

  const onZoomIn = () => {
    const newLocation = calculateZoomIn(props);
    navigateTo(newLocation);
  };

  const onZoomOut = () => {
    const newLocation = calculateZoomOut(props);
    navigateTo(newLocation);
  };

  const navigateTo = ({ start, end }: { start: number; end: number }) => {
    const { regionName } = props.location;
    const { pathname, search } = urlLocation;

    const newLocation = `${regionName}:${start}-${end}`;

    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set('location', newLocation);
    // for aesthetic purposes, prevent the colon in location query parameter from being encoded
    const newSearchParamsString = decodeURIComponent(
      newSearchParams.toString()
    );

    navigate(`${pathname}?${newSearchParamsString}`, { replace: true });
  };

  return (
    <div className={styles.buttons}>
      <button className={styles.button} onClick={onZoomIn} aria-label="Zoom in">
        <CirclePlusIcon />
      </button>
      <button
        className={styles.button}
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <CircleMinusIcon />
      </button>
    </div>
  );
};

// When zooming in, pick the location that is half the viewport in size, and is in the middle of the viewport
const calculateZoomIn = ({ location }: Props) => {
  const viewportLocation = location;
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

const calculateZoomOut = ({ location, regionLength }: Props) => {
  const viewportDistance = location.end - location.start;
  const newViewportDistance = viewportDistance * 2;
  const quarterNewDistance = Math.round(newViewportDistance / 4);
  const newStart = Math.max(location.start - quarterNewDistance, 1);
  const newEnd = Math.min(location.end + quarterNewDistance, regionLength);

  return {
    start: newStart,
    end: newEnd
  };
};

export default RegionOverviewZoomButtons;
