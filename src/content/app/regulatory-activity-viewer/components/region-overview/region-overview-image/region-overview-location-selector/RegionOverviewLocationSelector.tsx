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

import { type RefObject, type ReactNode } from 'react';
import { type ScaleLinear } from 'd3';
import { useNavigate, useLocation } from 'react-router';

import { useAppDispatch, useAppSelector } from 'src/store';

import useLocationSelector from './useLocationSelector';

import { getMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import { setMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

type Props = {
  activeGenomeId: string;
  regionName: string;
  imageRef: RefObject<SVGSVGElement | null>;
  height: number;
  width: number;
  scale: ScaleLinear<number, number>;
  children: ReactNode;
};

const RegionOverviewLocationSelector = (props: Props) => {
  const { activeGenomeId, regionName, scale, imageRef, children } = props;
  const mainContentBottomView = useAppSelector((state) =>
    getMainContentBottomView(state, activeGenomeId)
  );
  const urlLocation = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSelectionCompleted = (params: { start: number; end: number }) => {
    const { start, end } = params;
    const genomicStart = Math.round(scale.invert(start));
    const genomicEnd = Math.round(scale.invert(end));

    const { pathname, search } = urlLocation;

    const newLocation = `${regionName}:${genomicStart}-${genomicEnd}`;

    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set('location', newLocation);
    // for aesthetic purposes, prevent the colon in location query parameter from being encoded
    const newSearchParamsString = decodeURIComponent(
      newSearchParams.toString()
    );

    navigate(`${pathname}?${newSearchParamsString}`, { replace: true });

    if (mainContentBottomView !== 'dataviz') {
      dispatch(
        setMainContentBottomView({
          genomeId: activeGenomeId,
          view: 'dataviz'
        })
      );
    }
  };

  const selectedLocation = useLocationSelector({
    ref: imageRef,
    onSelectionCompleted
  });

  // TODO: get the red colour from the CSS variable

  const filterId = 'greyscale';

  return (
    <>
      {selectedLocation && (
        <Filter
          id={filterId}
          height={props.height}
          width={props.width}
          selectionStart={selectedLocation.start}
          selectionEnd={selectedLocation.end}
        />
      )}
      <g filter={selectedLocation ? `url(#${filterId})` : undefined}>
        {children}
      </g>
      {selectedLocation && (
        <>
          <rect
            x={selectedLocation.start}
            width={selectedLocation.end - selectedLocation.start}
            y={2}
            height={props.height - 4}
            fill="none"
            stroke="#d90000"
            strokeDasharray="2"
          />
          <InertAreas
            width={props.width}
            height={props.height}
            selectionStart={selectedLocation.start}
            selectionEnd={selectedLocation.end}
          />
        </>
      )}
    </>
  );
};

/**
 * This component applies an svg filter that changes the colour of all the shapes
 * (both full shapes and their fragments) that are outside the selected area
 * to grey
 */
const Filter = ({
  id,
  selectionStart,
  selectionEnd,
  height,
  width
}: {
  id: string;
  height: number; // <-- total height of the image
  width: number; // <-- total width of the image
  selectionStart: number; // <-- left coordinate of the selection area
  selectionEnd: number; // <-- right coordinate of the selection area
}) => {
  const rightFilterWidth = width - selectionEnd;

  return (
    <filter id={id}>
      <feFlood
        floodColor="#e5eaf0"
        floodOpacity="1"
        x="0"
        y="0"
        height={height}
        width={Math.max(selectionStart, 1)}
        result="A"
      />
      <feFlood
        floodColor="#e5eaf0"
        floodOpacity="1"
        x={selectionEnd}
        y="0"
        height={height}
        width={Math.max(rightFilterWidth, 1)}
        result="D"
      />
      <feComposite operator="in" in2="SourceGraphic" in="D" result="C" />
      <feComposite operator="in" in2="SourceGraphic" in="A" result="B" />
      <feMerge>
        <feMergeNode in="B" />
        <feMergeNode in="C" />
      </feMerge>
      <feComposite operator="over" in2="SourceGraphic" />
    </filter>
  );
};

/**
 * The purpose of this component is to cover the elements that are outside of the selection
 * and to prevent them from receiving user events, such as clicks or mouseovers
 */
const InertAreas = ({
  height,
  width,
  selectionStart,
  selectionEnd
}: {
  height: number; // <-- total height of the image
  width: number; // <-- total width of the image
  selectionStart: number; // <-- left coordinate of the selection area
  selectionEnd: number; // <-- right coordinate of the selection area
}) => {
  return (
    <g>
      <rect
        x={0}
        width={selectionStart}
        y={0}
        height={height}
        fill="transparent"
        data-name="inert-area"
      />
      <rect
        x={selectionEnd}
        width={width - selectionEnd}
        y={0}
        height={height}
        fill="transparent"
        data-name="inert-area"
      />
    </g>
  );
};

export default RegionOverviewLocationSelector;
