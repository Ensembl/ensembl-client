// TODO: think about the name; perhaps something like MiniMap is a better option?

import React from 'react';
import useResizeObserver from 'use-resize-observer';

import * as constants from './chromosomeNavigatorConstants';

import { calculateStyles } from './chromosomeNavigatorHelper';

import styles from './ChromosomeNavigator.scss';

type WrapperProps = {
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
};

export type ChromosomeNavigatorProps = WrapperProps & {
  containerWidth: number; // width of the container, in pixels
};

const ChromosomeNavigatorWrapper = (props: WrapperProps) => {
  const [containerRef, containerWidth] = useResizeObserver();

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={styles.chromosomeNavigator}
    >
      {containerWidth ? (
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
