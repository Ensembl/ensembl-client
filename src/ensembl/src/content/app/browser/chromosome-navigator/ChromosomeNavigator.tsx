// TODO: think about the name; perhaps something like MiniMap is a better option?

import React from 'react';
import useResizeObserver from 'use-resize-observer';

import { calculateStyles, CalculatedStyles } from './chromosomeNavigatorHelper';

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

type ChromosomeNavigatorProps = WrapperProps & {
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
    <div className={styles.chromosomeNavigator}>
      <svg height="20">
        <rect y="1" className={styles.stick} />
        <rect {...calculatedStyles.viewport.area} className={styles.viewport} />
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
      </svg>
    </div>
  );
};

export default ChromosomeNavigatorWrapper;
