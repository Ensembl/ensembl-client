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

import { useRef } from 'react';

import * as React from 'react';
import { useSelector } from 'react-redux';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import * as constants from './chromosomeNavigatorConstants';

import { calculateStyles } from './chromosomeNavigatorHelper';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  getActualChrLocation,
  getDefaultChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './ChromosomeNavigator.module.css';

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
  const genomeId = useSelector(getBrowserActiveGenomeId) as string;
  const [chromosomeName = '', viewportStart = 0, viewportEnd = 0] =
    useSelector(getActualChrLocation) || [];
  const defaultChrLocation = useSelector(getDefaultChrLocation);
  const focusRegion = defaultChrLocation
    ? {
        start: defaultChrLocation[1],
        end: defaultChrLocation[2]
      }
    : null;

  const { data: karyotype } = useGenomeKaryotypeQuery(genomeId);

  const currentKaryotypeItem = karyotype?.find(
    (item) => item.name === chromosomeName
  );
  const karyotypeItemLength = currentKaryotypeItem?.length ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });

  const props = {
    length: karyotypeItemLength,
    centromere: null,
    viewportStart,
    viewportEnd,
    focusRegion
  };

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>
      {containerWidth && length ? (
        <ChromosomeNavigator {...{ ...props, containerWidth }} />
      ) : null}
    </div>
  );
};

export const ChromosomeNavigator = (props: ChromosomeNavigatorProps) => {
  const calculatedStyles = calculateStyles(props);

  return (
    <div className={styles.chromosomeNavigator}>
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
