import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';

import styles from './ChromosomeNavigator.stories.scss';

const Wrapper = () => {
  const length = 1000000;
  const [viewportStart, setViewportStart] = useState(200000);
  const [viewportEnd, setViewportEnd] = useState(500000);
  const [focusRegionStart, setFocusRegionStart] = useState(300000);
  const [focusRegionEnd, setFocusRegionEnd] = useState(350000);
  const [centromereStart, setCentromereStart] = useState(150000);
  const [centromereEnd, setCentromereEnd] = useState(160000);

  const updateValue = (updater: Function) => (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.currentTarget.value);
    updater(value);
  };

  return (
    <>
      <div className={styles.chromosomeNavigatorContainer}>
        <ChromosomeNavigator
          length={1000000}
          viewportStart={viewportStart}
          viewportEnd={viewportEnd}
          focusRegion={{
            start: focusRegionStart,
            end: focusRegionEnd
          }}
          centromere={{
            start: centromereStart,
            end: centromereEnd
          }}
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <div>Viewport</div>
          <label>
            Viewport start
            <input
              type="range"
              min={0}
              max={length}
              value={viewportStart}
              onChange={updateValue(setViewportStart)}
            />
          </label>
          <label>
            Viewport end
            <input
              type="range"
              min={0}
              max={length}
              value={viewportEnd}
              onChange={updateValue(setViewportEnd)}
            />
          </label>
        </div>
        <div className={styles.controlsGroup}>
          <div>Focus region</div>
          <label>
            Focus region start
            <input
              type="range"
              min={0}
              max={length}
              value={focusRegionStart}
              onChange={updateValue(setFocusRegionStart)}
            />
          </label>
          <label>
            Focus region end
            <input
              type="range"
              min={0}
              max={length}
              value={focusRegionEnd}
              onChange={updateValue(setFocusRegionEnd)}
            />
          </label>
        </div>
        <div className={styles.controlsGroup}>
          <div>Centromere</div>
          <label>
            Centromere start
            <input
              type="range"
              min={0}
              max={centromereEnd}
              value={centromereStart}
              onChange={updateValue(setCentromereStart)}
            />
          </label>
          <label>
            Centromere end
            <input
              type="range"
              min={centromereStart}
              max={length}
              value={centromereEnd}
              onChange={updateValue(setCentromereEnd)}
            />
          </label>
        </div>
      </div>
    </>
  );
};

storiesOf('Components|Genome Browser/ChromosomeNavigator', module).add(
  'default',
  () => <Wrapper />
);
