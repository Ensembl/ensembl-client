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

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import * as constants from './chromosomeNavigatorConstants';

import { calculateStyles } from './chromosomeNavigatorHelper';

import {
  getBrowserActiveGenomeId,
  getActualChrLocation,
  getDefaultChrLocation
} from 'src/content/app/browser/browserSelectors';

import { getKaryotypeItemLength } from 'src/shared/state/genome/genomeSelectors';

import * as centromeres from 'src/shared/data/centromeres';

import { RootState } from 'src/store';

import styles from './ChromosomeNavigator.scss';

export type ChromosomeNavigatorProps = {
  length: number; // total number of nucleotides
  viewportStart: number; // nucleotide position corresponding to the left border of genome browser
  viewportEnd: number; // nucleotide position corresponding to the right border of genome browser
  focusRegion: {
    start: number; // start position of focus region
    end: number; // end position of focus region
  } | null;
  centromere: {
    start: number; // start position of the centromere
    end: number; // end position of the centromere
  } | null;
  containerWidth: number; // width of the container, in pixels
};

export const ChromosomeNavigatorWrapper = () => {
  const [chromosomeName = '', viewportStart = 0, viewportEnd = 0] =
    useSelector(getActualChrLocation) || [];
  const defaultChrLocation = useSelector(getDefaultChrLocation);
  const focusRegion = defaultChrLocation
    ? {
        start: defaultChrLocation[1],
        end: defaultChrLocation[2]
      }
    : null;

  const karyotypeItemLength = useSelector((state: RootState) =>
    getKaryotypeItemLength(chromosomeName, state)
  );

  const length = karyotypeItemLength || 0;

  // the code below is naughty and temporary (see ENSWBSITES-385):
  // we are peeking at the string that represents genome id — something which we are not supposed to do
  const genomeId = useSelector(getBrowserActiveGenomeId);
  let centromere = null;
  if (chromosomeName && genomeId && genomeId.startsWith('homo_sapiens')) {
    centromere = centromeres.humanCentromeres[chromosomeName] || null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });

  const props = {
    length,
    centromere,
    viewportStart,
    viewportEnd,
    focusRegion
  };

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={styles.chromosomeNavigator}
    >
      {containerWidth && length ? (
        <ChromosomeNavigator {...{ ...props, containerWidth }} />
      ) : null}
    </div>
  );
};

export const ChromosomeNavigator = (props: ChromosomeNavigatorProps) => {
  const calculatedStyles = calculateStyles(props);

  return (
    <div>
      <svg height={constants.TOTAL_HEIGHT} width={props.containerWidth}>
        <rect
          y={constants.STICK_MARGIN_TOP}
          width={props.containerWidth}
          className={styles.stick}
        />
        {calculatedStyles.viewport.areas.map((area, index) => (
          <rect {...area} key={index} className={styles.viewport} />
        ))}
        {calculatedStyles.centromere && (
          <g className={styles.centromere}>
            <rect
              {...calculatedStyles.centromere.area}
              className={styles.centromereRegion}
            />
            <circle
              {...calculatedStyles.centromere.centre}
              className={styles.centromereCentre}
            />
          </g>
        )}
        <g>
          <polyline
            points={calculatedStyles.viewport.openingBracketShape}
            className={styles.viewportBorder}
          />
          <polyline
            points={calculatedStyles.viewport.closingBracketShape}
            className={styles.viewportBorder}
          />
        </g>
        {calculatedStyles.focusPointers &&
          calculatedStyles.focusPointers.map((pointerStyles, index) => (
            <g
              key={index}
              className={styles.focusPointer}
              transform={`translate(${pointerStyles.translateX})`}
            >
              <line {...pointerStyles.line} />
              <polygon points={pointerStyles.arrowhead.points} />
            </g>
          ))}
        {calculatedStyles.labels &&
          calculatedStyles.labels.map((label, index) => (
            <text key={index} {...label.styles} className={styles.label}>
              {label.text}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default ChromosomeNavigatorWrapper;
