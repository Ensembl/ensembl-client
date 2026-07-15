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

import '@ensembl/ensembl-elements-common/components/nav-buttons/nav-buttons.js';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import type { NavButtons } from '@ensembl/ensembl-elements-common/components/nav-buttons/nav-buttons.js';

type NavButtonsProps = DetailedHTMLProps<
  HTMLAttributes<NavButtons>,
  NavButtons
> & {
  isMoveLeftDisabled?: boolean;
  isMoveRightDisabled?: boolean;
  isZoomInDisabled?: boolean;
  isZoomOutDisabled?: boolean;
};

type LocationInCallback = {
  start: number;
  end: number;
};

type Props = {
  onChange: (params: LocationInCallback) => void;
  viewportStart: number;
  viewportEnd: number;
  regionLength: number;
  className?: string;
};

const PANNING_STEP = 0.1;
const ZOOMING_STEP = 0.5;

const RegionNavigationButtons = (props: Props) => {
  const {
    viewportStart: start,
    viewportEnd: end,
    regionLength,
    className
  } = props;

  const viewportDistance = end - start; // NOTE: this may not work with circular chromosomes; but cirtular chromosomes are far away

  const onMoveLeft = () => {
    const moveDistance = Math.round(viewportDistance * PANNING_STEP);
    const newStart = Math.max(start - moveDistance, 1);
    const newEnd = newStart + viewportDistance;
    props.onChange({ start: newStart, end: newEnd });
  };

  const onMoveRight = () => {
    const moveDistance = Math.round(viewportDistance * PANNING_STEP);
    const newEnd = Math.min(end + moveDistance, regionLength);
    const newStart = newEnd - viewportDistance;
    props.onChange({ start: newStart, end: newEnd });
  };

  const onZoomIn = () => {
    const midpoint = start + Math.round((end - start) / 2);
    const newViewportDistance = Math.ceil(viewportDistance * ZOOMING_STEP);
    const halfNewViewportDistance = Math.ceil(newViewportDistance / 2);
    const newStart = midpoint - halfNewViewportDistance;
    const newEnd = newStart + newViewportDistance;
    props.onChange({ start: newStart, end: newEnd });
  };

  const onZoomOut = () => {
    const midpoint = start + Math.round((end - start) / 2);
    const newViewportDistance = Math.min(
      viewportDistance / ZOOMING_STEP,
      regionLength
    );
    const halfNewViewportDistance = Math.ceil(newViewportDistance / 2);

    const newStart = Math.max(midpoint - halfNewViewportDistance, 1);
    const newEnd = Math.min(newStart + newViewportDistance, regionLength);
    props.onChange({ start: newStart, end: newEnd });
  };

  return (
    <ens-nav-buttons
      className={className}
      isMoveLeftDisabled={start === 1}
      isMoveRightDisabled={end === regionLength}
      isZoomInDisabled={end - start < 30}
      isZoomOutDisabled={start === 1 && end === regionLength}
      onmove-left={onMoveLeft}
      onmove-right={onMoveRight}
      onzoom-in={onZoomIn}
      onzoom-out={onZoomOut}
    ></ens-nav-buttons>
  );
};

export default RegionNavigationButtons;

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-nav-buttons': NavButtonsProps;
    }
  }
}
