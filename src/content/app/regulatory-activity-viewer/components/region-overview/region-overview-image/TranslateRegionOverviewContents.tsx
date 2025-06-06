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

import { useRef, useReducer, type ReactNode } from 'react';
import type { ScaleLinear } from 'd3';
import { useLocation, useNavigate } from 'react-router';

import {
  calculateShiftLeft,
  calculateLocationAfterDrag,
  getGenomicDistanceDragged
} from './regionOverviewImageHelpers';

type Props = {
  location: { regionName: string; start: number; end: number };
  regionDetailLocation: { start: number; end: number } | null;
  scale: ScaleLinear<number, number>; // d3 scale mapping the whole location to the width of an imaginary container
  children: ReactNode;
};

type State = {
  initialOffset: number;
  currentOffset: number;
};

type SetInitialStateAction = {
  type: 'set-initial-state';
  payload: State;
};

type UpdatePositionAction = {
  type: 'update-position';
  payload: {
    distance: number;
  };
};

type Action = SetInitialStateAction | UpdatePositionAction;

const stateReducer = (state: State, action: Action): State => {
  if (action.type === 'set-initial-state') {
    return action.payload;
  } else if (action.type === 'update-position') {
    return {
      ...state,
      currentOffset: action.payload.distance
    };
  }

  return state;
};

const computeTranslateX = (state: State) => {
  const { initialOffset, currentOffset } = state;
  return -1 * initialOffset + currentOffset;
};

const getInitialState = (initialOffset: number): State => {
  return {
    initialOffset,
    currentOffset: 0
  };
};

const TranslateRegionOverviewContents = (props: Props) => {
  const { location, regionDetailLocation, scale, children } = props;
  const initialShiftLeft = calculateShiftLeft({
    location,
    detailLocation: regionDetailLocation,
    scale
  });
  const initialState = getInitialState(initialShiftLeft);
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const translateX = computeTranslateX(state);
  const navigate = useNavigate();
  const urlLocation = useLocation();

  const pressStartXRef = useRef<number | null>(null);
  const stateRef = useRef(state);

  // make sure to update state ref at every rerender
  stateRef.current = state;

  // Keep track of the props that are used in the calculation of translateX value,
  // and reset the state if these props update
  // (running this as part of a render pass rather than in a useEffect as recommended by react docs)
  const prevLocationRef = useRef(location);
  const prevRegionDetailLocationRef = useRef(regionDetailLocation);
  const prevScaleRef = useRef(scale);
  if (
    location !== prevLocationRef.current ||
    regionDetailLocation !== prevRegionDetailLocationRef.current ||
    scale !== prevScaleRef.current
  ) {
    const shiftLeft = calculateShiftLeft({
      location,
      detailLocation: regionDetailLocation,
      scale
    });
    const newState = getInitialState(shiftLeft);

    dispatch({
      type: 'set-initial-state',
      payload: newState
    });

    prevLocationRef.current = location;
    prevRegionDetailLocationRef.current = regionDetailLocation;
    prevScaleRef.current = scale;
  }

  const onMount = (element: SVGGElement) => {
    setupDragHandler(element);

    return () => {
      detachDragHandler(element);
    };
  };

  const setupDragHandler = (element: SVGGElement) => {
    const svgImage = element.closest('svg');
    svgImage?.addEventListener('mousedown', onMouseDown);
  };

  const detachDragHandler = (element: SVGGElement) => {
    const svgImage = element.closest('svg');
    svgImage?.removeEventListener('mousedown', onMouseDown);
  };

  const onMouseDown = (event: MouseEvent) => {
    const { currentTarget } = event;
    if (!(currentTarget instanceof SVGSVGElement)) {
      return;
    }

    // NOTE: the below condition makes the hook not reusable;
    // but perhaps it doesn't have to be reusable?
    const pointerY = event.offsetY;
    if (Math.round(pointerY) < 15) {
      return;
    }

    pressStartXRef.current = event.offsetX;

    currentTarget.addEventListener('mousemove', onMouseMove);
    currentTarget.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (event: MouseEvent) => {
    const pointerX = event.offsetX;
    const distance = pointerX - (pressStartXRef.current as number);
    const genomicDistance = getGenomicDistanceDragged({
      distance,
      scale
    });

    const shouldBail =
      !regionDetailLocation ||
      (distance > 0 &&
        regionDetailLocation.start - genomicDistance < location.start) ||
      (distance < 0 &&
        regionDetailLocation.end + genomicDistance > location.end);

    if (shouldBail) {
      return;
    }

    dispatch({
      type: 'update-position',
      payload: { distance }
    });
  };

  const onMouseUp = (event: MouseEvent) => {
    const element = event.currentTarget as SVGSVGElement;
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseup', onMouseUp);

    updateLocation();
  };

  const updateLocation = () => {
    const distance = stateRef.current.currentOffset;

    if (!distance) {
      return;
    }

    const { start: genomicStart, end: genomicEnd } = calculateLocationAfterDrag(
      {
        location,
        detailLocation: regionDetailLocation ?? location,
        scale,
        distance
      }
    );

    const { regionName } = location;
    const { pathname, search } = urlLocation;

    const newLocation = `${regionName}:${genomicStart}-${genomicEnd}`;

    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set('location', newLocation);
    // for aesthetic purposes, prevent the colon in location query parameter from being encoded
    const newSearchParamsString = decodeURIComponent(
      newSearchParams.toString()
    );

    navigate(`${pathname}?${newSearchParamsString}`, { replace: true });
  };

  return (
    <g transform={`translate(${translateX}, 0)`} ref={onMount}>
      {children}
    </g>
  );
};

export default TranslateRegionOverviewContents;
