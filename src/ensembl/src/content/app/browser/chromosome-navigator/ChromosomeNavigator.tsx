// TODO: think about the name; perhaps something like MiniMap is a better option?

import React from 'react';
import useResizeObserver from 'use-resize-observer';

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

const ChromosomeNavigator = (props: ChromosomeNavigatorProps) => {
  return (
    <div className={styles.chromosomeNavigator}>
      <svg height="20">
        <rect y="1" className={styles.stick} />
        <rect x="100" y="1" className={styles.viewport} />
        <g className={styles.centromere}>
          <rect
            className={styles.centromereRegion}
            y="1"
            height="4"
            width="10"
          />
          <circle className={styles.centromereCentre} cx="5" cy="3" r="2" />
        </g>
        <g>
          <polyline
            points="103,0 100,0 100,6 103,6"
            className={styles.viewportBorder}
          />
          <polyline
            points="147,0 150,0 150,6 147,6"
            className={styles.viewportBorder}
          />
        </g>
        <g className={styles.focusPointer}>
          <line x1="5" y1="9" x2="5" y2="1" />
          <polygon points="0,16 5,8 10,16" />
        </g>
      </svg>
    </div>
  );
};

export default ChromosomeNavigatorWrapper;
