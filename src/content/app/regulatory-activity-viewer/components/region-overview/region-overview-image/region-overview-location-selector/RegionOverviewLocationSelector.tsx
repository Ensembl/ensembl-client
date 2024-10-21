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

import { type MutableRefObject, type ReactNode } from 'react';
import { type ScaleLinear } from 'd3';

import { useAppDispatch } from 'src/store';

import useLocationSelector from './useLocationSelector';

import { setRegionDetailLocation } from 'src/content/app/regulatory-activity-viewer/state/region-detail/regionDetailSlice';

/**
 * Somehow enter the selection mode
 *  - Maybe long mousedown / long touch?
 *    - Be careful though, because who knows how a long touch would work
 *      if there is something to scroll
 *    - Consider the implication that this has for clicking to select a gene
 *
 * RULES:
 *  - Do not let the selection continue outside of the svg
 *  - There should probably be a minimum possible selection
 */

type Props = {
  activeGenomeId: string;
  imageRef: MutableRefObject<SVGSVGElement | null>;
  height: number;
  width: number;
  scale: ScaleLinear<number, number>;
  children: ReactNode;
};

const RegionOverviewLocationSelector = (props: Props) => {
  const { activeGenomeId, scale, imageRef, children } = props;
  const dispatch = useAppDispatch();

  const onSelectionCompleted = (params: { start: number; end: number }) => {
    const { start, end } = params;
    const genomicStart = Math.round(scale.invert(start));
    const genomicEnd = Math.round(scale.invert(end));

    dispatch(
      setRegionDetailLocation({
        genomeId: activeGenomeId,
        location: {
          start: genomicStart,
          end: genomicEnd
        }
      })
    );
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
          positionLeft={selectedLocation.start}
          positionRight={selectedLocation.end}
        />
      )}
      <g filter={`url(#${filterId})`}>{children}</g>
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
            positionLeft={selectedLocation.start}
            positionRight={selectedLocation.end}
          />
        </>
      )}
    </>
  );
};

const Filter = ({
  id,
  positionLeft,
  positionRight,
  height,
  width
}: {
  id: string;
  positionLeft: number;
  positionRight: number;
  width: number;
  height: number;
}) => {
  const rightFilterWidth = width - positionRight;

  return (
    <filter id={id}>
      <feFlood
        floodColor="#e5eaf0"
        floodOpacity="1"
        x="0"
        y="0"
        height={height}
        width={positionLeft}
        result="A"
      />
      <feFlood
        floodColor="#e5eaf0"
        floodOpacity="1"
        x={positionRight}
        y="0"
        height={height}
        width={rightFilterWidth}
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
 * The purpose of this component is to act as a shield from user's clicks
 * over the area outside the selection
 */
const InertAreas = ({
  height,
  width,
  positionLeft,
  positionRight
}: {
  height: number;
  width: number;
  positionLeft: number;
  positionRight: number;
}) => {
  return (
    <g>
      <rect
        x={0}
        width={positionLeft}
        y={0}
        height={height}
        fill="transparent"
      />
      <rect
        x={positionRight}
        width={width - positionRight}
        y={0}
        height={height}
        fill="transparent"
      />
    </g>
  );
};

export default RegionOverviewLocationSelector;
